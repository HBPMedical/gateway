import {
  Inject,
  InternalServerErrorException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Request, Response } from 'express';
import authConfig from '../config/auth.config';
import { GQLRequest } from '../common/decorators/gql-request.decoractor';
import { GQLResponse } from '../common/decorators/gql-response.decoractor';
import { CurrentUser } from '../common/decorators/user.decorator';
import { parseToBoolean } from '../common/utils/shared.utils';
import { ENGINE_MODULE_OPTIONS } from '../engine/engine.constants';
import EngineService from '../engine/engine.service';
import EngineOptions from '../engine/interfaces/engine-options.interface';
import { User } from '../users/models/user.model';
import { AuthService } from './auth.service';
import { GlobalAuthGuard } from './guards/global-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticationInput } from './inputs/authentication.input';
import { AuthenticationOutput } from './outputs/authentication.output';

//Custom defined type because Pick<CookieOptions, 'sameSite'> does not work
type SameSiteType = boolean | 'lax' | 'strict' | 'none' | undefined;

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(
    private readonly engineService: EngineService,
    @Inject(ENGINE_MODULE_OPTIONS)
    private readonly engineOptions: EngineOptions,
    private readonly authService: AuthService,
    @Inject(authConfig.KEY) private authConf: ConfigType<typeof authConfig>,
  ) {}

  @Mutation(() => AuthenticationOutput)
  @UseGuards(LocalAuthGuard)
  async login(
    @GQLResponse() res: Response,
    @CurrentUser() user: User,
    @Args('variables') inputs: AuthenticationInput,
  ): Promise<AuthenticationOutput> {
    this.logger.verbose(`${inputs.username} logged in`);

    const data = await this.authService.login(user);
    if (!data)
      throw new InternalServerErrorException(
        `Error during the authentication process`,
      );

    res.cookie(this.authConf.cookie.name, data.accessToken, {
      httpOnly: parseToBoolean(this.authConf.cookie.httpOnly),
      sameSite: this.authConf.cookie.sameSite as SameSiteType,
      secure: parseToBoolean(this.authConf.cookie.secure),
    });

    return data;
  }

  @Mutation(() => AuthenticationOutput)
  async refresh(
    @GQLResponse() res: Response,
    @Args('refreshToken', { type: () => String }) refreshToken: string,
  ): Promise<AuthenticationOutput> {
    const data = await this.authService.createTokensWithRefreshToken(
      refreshToken,
    );

    res.cookie(this.authConf.cookie.name, data.accessToken, {
      httpOnly: parseToBoolean(this.authConf.cookie.httpOnly),
      sameSite: this.authConf.cookie.sameSite as SameSiteType,
      secure: parseToBoolean(this.authConf.cookie.secure),
    });

    return data;
  }

  @Mutation(() => Boolean)
  @UseGuards(GlobalAuthGuard)
  async logout(
    @GQLRequest() req: Request,
    @GQLResponse() res: Response,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    if (user) {
      this.logger.verbose(`${user.username} logged out`);
      try {
        if (this.engineService.has('logout')) {
          await this.engineService.logout(req);
        } else {
          this.authService.logout(user);
        }
      } catch (e) {
        this.logger.warn(
          `Service ${this.engineOptions.type} produce an error when logging out ${user.username}`,
        );
        this.logger.debug(e);
      }
    }

    res.clearCookie(this.authConf.cookie.name);

    return true;
  }
}
