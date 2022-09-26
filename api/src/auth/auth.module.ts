import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import authConfig from '../config/auth.config';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { EngineStrategy } from './strategies/engine.strategy';
import { JwtBearerStrategy } from './strategies/jwt-bearer.strategy';
import { JwtCookiesStrategy } from './strategies/jwt-cookies.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const authConf =
          configService.get<ConfigType<typeof authConfig>>('auth');
        return {
          secret: authConf.JWTSecret,
          signOptions: {
            expiresIn: authConf.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtBearerStrategy,
    JwtCookiesStrategy,
    EngineStrategy,
    AuthResolver,
  ],
  exports: [AuthService],
})
export class AuthModule {}
