import {
  Inject,
  Injectable,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import authConfig from '../config/auth.config';
import EngineService from '../engine/engine.service';
import { User } from '../users/models/user.model';
import { AuthenticationOutput } from './outputs/authentication.output';
import * as bcrypt from 'bcrypt';

type TokenPayload = {
  context: User;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY) private authConf: ConfigType<typeof authConfig>,
    private readonly engineService: EngineService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    if (!this.engineService.has('login')) throw new NotImplementedException();
    return this.engineService.login(username, password);
  }

  /**
   * It takes a user and returns an access and refresh tokens
   * @param {User} user - The user object that is being authenticated.
   * @returns An object with an accessToken property.
   */
  async login(user: User): Promise<AuthenticationOutput> {
    const payload: TokenPayload = {
      context: {
        ...user,
        refreshToken: undefined,
        agreeNDA: undefined,
      },
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.getRefreshTokenOptions()),
    ]);

    const hashRefresh = await this.getHash(refreshToken);

    this.usersService.update(user.id, {
      refreshToken: hashRefresh,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logout the user by deleting the refresh token from the database.
   * @param {User} user - User object that is being logged out.
   */
  async logout(user: User): Promise<void> {
    this.usersService.update(user.id, { refreshToken: null });
  }

  async createTokensWithRefreshToken(
    refreshToken: string,
  ): Promise<AuthenticationOutput> {
    try {
      const payload = this.jwtService.verify<TokenPayload>(
        refreshToken,
        this.getRefreshTokenOptions(),
      );
      const user = await this.usersService.findOne(payload.context.id);
      const isMatchingTokens = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!isMatchingTokens) throw new UnauthorizedException();
      return this.login(payload.context);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async getHash(obj: any): Promise<string> {
    return bcrypt.hash(obj, 5);
  }

  private getRefreshTokenOptions(): JwtSignOptions {
    return {
      expiresIn: this.authConf.refreshExperiesIn,
      secret: this.authConf.JWTResfreshSecret,
    };
  }
}
