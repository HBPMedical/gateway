import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  JWTSecret: process.env.AUTH_JWT_SECRET || 'access-secret',
  JWTResfreshSecret: process.env.AUTH_JWT_REFRESH_SECRET || 'refresh-secret',
  skipAuth: process.env.AUTH_SKIP || 'false',
  expiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN || '1h',
  refreshExperiesIn: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN || '2d',
  enableSSO: process.env.AUTH_ENABLE_SSO || 'false',
  cookie: {
    name: process.env.AUTH_COOKIE_NAME || 'jwt-gateway',
    sameSite: process.env.AUTH_COOKIE_SAME_SITE || 'strict',
    secure: process.env.AUTH_COOKIE_SECURE || 'false',
    httpOnly: process.env.AUTH_COOKIE_HTTPONLY || 'true',
  },
}));
