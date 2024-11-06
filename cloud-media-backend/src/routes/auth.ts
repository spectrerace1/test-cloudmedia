// routes/auth.ts
import { Router, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { authenticate, AuthRequest } from '../middleware/auth'; // AuthRequest'i içe aktarın

export const authRouter = Router();
const authService = new AuthService();

// Register endpoint
authRouter.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Login endpoint
authRouter.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Mevcut kullanıcı bilgilerini döndüren /auth/me endpoint'i
authRouter.get('/me', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id; // Token doğrulandıktan sonra user id alınır
    const user = await authService.getUserById(userId!); // Kullanıcı bilgilerini çekin
    res.json(user);
  } catch (error) {
    next(error);
  }
});
