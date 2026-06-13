import type { Request, Response, NextFunction } from 'express';

/**
 * Detects common prompt injection patterns in request body string fields.
 * Returns 400 if a suspicious pattern is found.
 */

const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+(all\s+)?above\s+instructions/i,
  /disregard\s+(all\s+)?previous/i,
  /forget\s+(all\s+)?previous/i,
  /you\s+are\s+now/i,
  /new\s+instructions?:/i,
  /system\s*:/i,
  /\bact\s+as\b/i,
  /pretend\s+you\s+are/i,
  /override\s+(your\s+)?(system|instructions)/i,
  /\bdo\s+not\s+follow\b.*\binstructions\b/i,
  /\bjailbreak\b/i,
  /\bdan\s+mode\b/i,
  /reveal\s+(your\s+)?(system\s+)?prompt/i,
  /show\s+(your\s+)?(system\s+)?prompt/i,
  /what\s+are\s+your\s+instructions/i,
];

export function promptGuard(req: Request, res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      const value = req.body[key];
      if (typeof value === 'string') {
        for (const pattern of INJECTION_PATTERNS) {
          if (pattern.test(value)) {
            res.status(400).json({
              error: 'Invalid input detected. Please rephrase your message.',
            });
            return;
          }
        }
      }
    }
  }
  next();
}
