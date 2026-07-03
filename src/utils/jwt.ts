import jwt from 'jsonwebtoken';

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }
  return secret;
}

export function generateToken(userId: string): string {
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '24h';
  return jwt.sign({ userId }, getSecret(), { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): { userId: string } {
  const decoded = jwt.verify(token, getSecret()) as { userId: string };
  return { userId: decoded.userId };
}
