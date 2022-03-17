import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { authConstants } from '../auth-constants';

@Injectable()
export class JwtCookiesStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookies',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: JwtCookiesStrategy.extractFromCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(authConstants.JWTSecret),
    });
  }

  static extractFromCookie = function (req: Request) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies[authConstants.cookie.name];
    }
    return token;
  };

  async validate(payload: any) {
    return payload.sub;
  }
}
