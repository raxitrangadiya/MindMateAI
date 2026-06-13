import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service.js';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

/**
 * Middleware to verify JWT token and attach userId to request.
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Authentication token is missing' });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ error: 'Authentication token is invalid or expired' });
    return;
  }

  req.userId = decoded.userId;
  next();
}

/**
 * Middleware to ensure the authenticated user matches the requested userId in the parameters or body.
 */
export function authorizeUser(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authenticatedUserId = req.userId;
  const targetUserId = req.params.userId || req.body.userId;

  if (!authenticatedUserId) {
    res.status(401).json({ error: 'Unauthenticated request' });
    return;
  }

  if (targetUserId && authenticatedUserId !== targetUserId) {
    res.status(403).json({ error: 'Access denied: cannot access another user\'s data' });
    return;
  }

  next();
}
