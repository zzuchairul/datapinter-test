import jwt, { type JwtPayload } from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

// Create access token that expire in 10 minutes
export function signAccessToken(payload: any) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '30m' });
}

// Create refresh token that expire in 1 day
export function signRefreshToken(payload: any) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '1d' });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}
