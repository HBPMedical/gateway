import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import EngineService from '../../engine/engine.service';

@Injectable()
export class EngineStrategy extends PassportStrategy(Strategy, 'engine') {
  constructor(private readonly engineService: EngineService) {
    super();
  }

  async validate(req: Request) {
    if (!this.engineService.has('getActiveUser')) return false;
    const user = await this.engineService.getActiveUser(req);

    return user ?? false;
  }
}
