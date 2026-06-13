import type { Request, Response, NextFunction } from 'express';

const MAX_STRING_LENGTH = 5000;

/**
 * Strip HTML tags, trim whitespace, and limit string length for all
 * string fields in `req.body`.
 */
export function sanitizeInputs(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      const value = req.body[key];
      if (typeof value === 'string') {
        // Strip HTML tags
        let cleaned = value.replace(/<[^>]*>/g, '');
        // Trim whitespace
        cleaned = cleaned.trim();
        // Limit length
        if (cleaned.length > MAX_STRING_LENGTH) {
          cleaned = cleaned.slice(0, MAX_STRING_LENGTH);
        }
        req.body[key] = cleaned;
      }
    }
  }
  next();
}
