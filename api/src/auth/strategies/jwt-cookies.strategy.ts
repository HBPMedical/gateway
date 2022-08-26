import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import authConfig from '../../config/auth.config';

@Injectable()
export class JwtCookiesStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookies',
) {
  constructor(
    @Inject(authConfig.KEY) private authConf: ConfigType<typeof authConfig>,
  ) {
    super({
      jwtFromRequest: JwtCookiesStrategy.extractFromCookie,
      ignoreExpiration: false,
      secretOrKey: authConf.JWTSecret,
    });
  }

  static extractFromCookie = function (req: Request) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies[this.authConf.cookie.name];
    }
    return token;
  };

  async validate(payload: any) {
    return payload.context;
  }
}
