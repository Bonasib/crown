import jwt from 'jsonwebtoken';

export interface AdminJwtPayload {
  sub: string;
  username: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
}

function secret(): string {
  const s = process.env['ADMIN_JWT_SECRET'];
  if (!s) throw new Error('ADMIN_JWT_SECRET is not set');
  return s;
}

export function signAdminToken(payload: AdminJwtPayload): string {
  return jwt.sign(payload, secret(), { expiresIn: '12h' });
}

export function verifyAdminToken(token: string): AdminJwtPayload {
  return jwt.verify(token, secret()) as AdminJwtPayload;
}
