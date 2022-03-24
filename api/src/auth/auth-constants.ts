export const authConstants = {
  JWTSecret: 'AUTH_JWT_SECRET',
  skipAuth: 'AUTH_SKIP',
  expiresIn: 'AUTH_JWT_TOKEN_EXPIRES_IN',
  enableSSO: 'AUTH_ENABLE_SSO',
  cookie: {
    name: 'jwt-gateway',
    sameSite: 'AUTH_COOKIE_SAME_SITE',
    secure: 'AUTH_COOKIE_SECURE',
    httpOnly: 'AUTH_COOKIE_HTTPONLY',
  },
};
