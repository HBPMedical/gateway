import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ENGINE_SERVICE } from '../engine/engine.constants';
import { IEngineService } from '../engine/engine.interfaces';
import { User } from '../users/models/user.model';
import { AuthenticationOutput } from './outputs/authentication.output';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ENGINE_SERVICE) private readonly engineService: IEngineService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    if (!this.engineService.login) throw new NotImplementedException();
    return await this.engineService.login?.(username, password);
  }

  async login(user: User): Promise<Pick<AuthenticationOutput, 'accessToken'>> {
    const payload = { username: user.username, sub: user };
    return Promise.resolve({
      accessToken: this.jwtService.sign(payload),
    });
  }
}
