import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ENGINE_SERVICE } from 'src/engine/engine.constants';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import EngineService from 'src/engine/interfaces/engine-service.interface';

@Injectable()
export class EngineStrategy extends PassportStrategy(Strategy, 'engine') {
  constructor(
    @Inject(ENGINE_SERVICE) private readonly engineService: EngineService,
  ) {
    super();
  }

  async validate(req: Request) {
    if (!this.engineService.getActiveUser) return false;
    const user = this.engineService.getActiveUser(req);

    return user ?? false;
  }
}
