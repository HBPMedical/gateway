import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ENGINE_SERVICE } from 'src/engine/engine.constants';
import { IEngineService } from 'src/engine/engine.interfaces';
import { Request } from 'express';
import { Strategy } from 'passport-custom';

@Injectable()
export class EngineStrategy extends PassportStrategy(Strategy, 'engine') {
  constructor(
    @Inject(ENGINE_SERVICE) private readonly engineService: IEngineService,
  ) {
    super();
  }

  async validate(req: Request) {
    if (!this.engineService.getActiveUser) return false;
    const user = this.engineService.getActiveUser(req);

    return user ?? false;
  }
}
