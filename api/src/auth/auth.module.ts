import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { authConstants } from './auth-constants';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtBearerStrategy } from './strategies/jwt-bearer.strategy';
import { JwtCookiesStrategy } from './strategies/jwt-cookies.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PassportModule.register({
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(authConstants.JWTSecret),
        signOptions: {
          expiresIn: configService.get(authConstants.expiresIn, '2d'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtBearerStrategy,
    JwtCookiesStrategy,
    AuthResolver,
  ],
  exports: [AuthService],
})
export class AuthModule {}
