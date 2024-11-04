import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { config } from '../config';
import { AppError } from '../middleware/errorHandler';
import { redisClient } from '../utils/redis';

const userRepository = AppDataSource.getRepository(User);

export class AuthService {
  async register(userData: Partial<User>) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(
      userData.password!,
      config.bcrypt.saltRounds
    );

    const user = userRepository.create({
      ...userData,
      password: hashedPassword
    });

    await userRepository.save(user);
    return this.generateToken(user);
  }

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

    // Store session in Redis
    const sessionId = await this.createSession(user);

    return {
      ...(await this.generateToken(user)),
      sessionId
    };
  }

  async logout(userId: string, sessionId: string) {
    await redisClient.del(`session:${sessionId}`);
    await redisClient.sRem(`user:${userId}:sessions`, sessionId);
  }

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

  private async createSession(user: User) {
    const sessionId = crypto.randomUUID();
    const sessionData = {
      userId: user.id,
      userAgent: user.userAgent,
      createdAt: new Date().toISOString()
    };

    // Store session with 24h expiry
    await redisClient.set(
      `session:${sessionId}`,
      JSON.stringify(sessionData),
      'EX',
      86400
    );

    // Add to user's session set
    await redisClient.sAdd(`user:${user.id}:sessions`, sessionId);

    return sessionId;
  }

  private async generateToken(user: User, sessionId?: string) {
    // Access token - short lived (15 minutes)
    const token = jwt.sign(
      { id: user.id, role: user.role, sessionId },
      config.jwt.secret,
      { expiresIn: '15m' }
    );

    // Refresh token - long lived (7 days)
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

  async validateSession(userId: string, sessionId: string) {
    const sessionData = await redisClient.get(`session:${sessionId}`);
    if (!sessionData) return false;

    const session = JSON.parse(sessionData);
    return session.userId === userId;
  }

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

  async terminateSession(userId: string, sessionId: string) {
    await redisClient.del(`session:${sessionId}`);
    await redisClient.sRem(`user:${userId}:sessions`, sessionId);
  }

  async terminateAllSessions(userId: string, exceptSessionId?: string) {
    const sessionIds = await redisClient.sMembers(`user:${userId}:sessions`);
    
    for (const sessionId of sessionIds) {
      if (sessionId !== exceptSessionId) {
        await this.terminateSession(userId, sessionId);
      }
    }
  }
}