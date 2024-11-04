<content>import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      const validationErrors = error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      next(new AppError(400, 'Validation error', validationErrors));
    }
  };
};
</content>