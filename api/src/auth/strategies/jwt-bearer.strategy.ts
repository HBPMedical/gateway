import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { authConstants } from '../auth-constants';

@Injectable()
export class JwtBearerStrategy extends PassportStrategy(
  Strategy,
  'jwt-bearer',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(authConstants.JWTSecret),
    });
  }

  async validate(payload: any) {
    return payload.sub;
  }
}
