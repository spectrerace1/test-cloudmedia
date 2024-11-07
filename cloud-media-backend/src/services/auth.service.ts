import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { config } from '../config';
import { AppError } from '../middleware/errorHandler';
import { redisClient } from '../utils/redis';
import crypto from 'crypto';

const userRepository = AppDataSource.getRepository(User);

export class AuthService {
  
  // Kullanıcı kaydı
  async register(userData: Partial<User>) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    // İlk kullanıcıyı admin yap
    const userCount = await userRepository.count();
    const role = userCount === 0 ? 'admin' : 'user';

    const hashedPassword = await bcrypt.hash(
      userData.password!,
      config.bcrypt.saltRounds
    );

    const user = userRepository.create({
      ...userData,
      password: hashedPassword,
      role
    });

    await userRepository.save(user);
    return this.generateToken(user);
  }

  // Kullanıcı girişi
  async login(email: string, password: string) {
    const user = await userRepository.findOne({
      where: { email }
    });

    if (!user || !user.isActive) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Oturumu Redis'te sakla
    const sessionId = await this.createSession(user);

    return {
      ...(await this.generateToken(user)),
      sessionId
    };
  }

  // Kullanıcı çıkışı
  async logout(userId: string, sessionId: string) {
    await redisClient.del(`session:${sessionId}`);
    await redisClient.sRem(`user:${userId}:sessions`, sessionId);
  }

  // Refresh token ile yeni token oluşturma
  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
        id: string;
        sessionId: string;
      };

      const sessionExists = await redisClient.exists(`session:${decoded.sessionId}`);
      if (!sessionExists) {
        throw new AppError(401, 'Invalid session');
      }

      const user = await userRepository.findOne({
        where: { id: decoded.id }
      });

      if (!user || !user.isActive) {
        throw new AppError(401, 'User not found or inactive');
      }

      return this.generateToken(user, decoded.sessionId);
    } catch (error) {
      throw new AppError(401, 'Invalid refresh token');
    }
  }

  // Kullanıcı ID'ye göre veritabanından kullanıcı bilgilerini getirir
  async getUserById(userId: string) {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  // Kullanıcı oturumu oluşturma ve Redis'e kaydetme
  private async createSession(user: User) {
    const sessionId = crypto.randomUUID();
    const sessionData = {
      userId: user.id,
      role: user.role,
      createdAt: new Date().toISOString()
    };

    // Oturumu 24 saat süreyle sakla
    await redisClient.set(
      `session:${sessionId}`,
      JSON.stringify(sessionData),
      { EX: 86400 }
    );

    // Kullanıcının oturum setine ekle
    await redisClient.sAdd(`user:${user.id}:sessions`, sessionId);

    return sessionId;
  }

  // Kullanıcı için erişim ve yenileme tokenları oluşturur
  private async generateToken(user: User, sessionId?: string) {
    // Erişim token'ı (15 dakika süreli)
    const token = jwt.sign(
      { id: user.id, role: user.role, sessionId },
      config.jwt.secret,
      { expiresIn: '15m' }
    );

    // Yenileme token'ı (7 gün süreli)
    const refreshToken = jwt.sign(
      { id: user.id, sessionId },
      config.jwt.refreshSecret,
      { expiresIn: '7d' }
    );

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  // Oturumun geçerli olup olmadığını kontrol eder
  async validateSession(userId: string, sessionId: string) {
    const sessionData = await redisClient.get(`session:${sessionId}`);
    if (!sessionData) return false;

    const session = JSON.parse(sessionData);
    return session.userId === userId;
  }

  // Kullanıcının tüm oturumlarını getirir
  async getUserSessions(userId: string) {
    const sessionIds = await redisClient.sMembers(`user:${userId}:sessions`);
    const sessions = [];

    for (const sessionId of sessionIds) {
      const sessionData = await redisClient.get(`session:${sessionId}`);
      if (sessionData) {
        sessions.push({
          id: sessionId,
          ...JSON.parse(sessionData)
        });
      }
    }

    return sessions;
  }

  // Belirli bir oturumu sonlandırır
  async terminateSession(userId: string, sessionId: string) {
    await redisClient.del(`session:${sessionId}`);
    await redisClient.sRem(`user:${userId}:sessions`, sessionId);
  }

  // Tüm oturumları sonlandırır, belirtilen oturum hariç
  async terminateAllSessions(userId: string, exceptSessionId?: string) {
    const sessionIds = await redisClient.sMembers(`user:${userId}:sessions`);
    
    for (const sessionId of sessionIds) {
      if (sessionId !== exceptSessionId) {
        await this.terminateSession(userId, sessionId);
      }
    }
  }
}
