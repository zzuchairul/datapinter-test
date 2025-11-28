import { verifyAccessToken } from '@common/jwt';
import { NextFunction, Request, Response } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  // Check header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return
  }

  // Extract token
  const token = authHeader?.split(' ')[1];
  // Check if token exist
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return
  }

  try {
    // Verify access token
    const payload = verifyAccessToken(token);
    // Attach userId to request
    req.userId = payload.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return
  }
}
