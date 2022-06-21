import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ENGINE_SERVICE } from '../engine/engine.constants';
import EngineService from '../engine/interfaces/engine-service.interface';
import { User } from '../users/models/user.model';
import { AuthenticationOutput } from './outputs/authentication.output';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ENGINE_SERVICE) private readonly engineService: EngineService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    if (!this.engineService.login) throw new NotImplementedException();
    return this.engineService.login?.(username, password);
  }

  /**
   * It takes a user and returns an access token
   * @param {User} user - The user object that is being authenticated.
   * @returns An object with an accessToken property.
   */
  async login(user: User): Promise<Pick<AuthenticationOutput, 'accessToken'>> {
    const payload = { username: user.username, sub: user };
    return Promise.resolve({
      accessToken: this.jwtService.sign(payload),
    });
  }
}
