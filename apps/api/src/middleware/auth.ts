import jwt from 'jsonwebtoken';
import type { JwtPayload } from '@ronda/types';

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'dev_secret_change_in_production';

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function extractTokenFromHeader(authorization?: string): string | null {
  if (!authorization || !authorization.startsWith('Bearer ')) return null;
  return authorization.slice(7);
}
