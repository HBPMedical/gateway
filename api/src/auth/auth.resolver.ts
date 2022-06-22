import {
  Inject,
  InternalServerErrorException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Response, Request } from 'express';
import { CurrentUser } from '../common/decorators/user.decorator';
import { GQLRequest } from '../common/decorators/gql-request.decoractor';
import { GQLResponse } from '../common/decorators/gql-response.decoractor';
import { ENGINE_MODULE_OPTIONS } from '../engine/engine.constants';
import { User } from '../users/models/user.model';
import { authConstants } from './auth-constants';
import { AuthService } from './auth.service';
import { GlobalAuthGuard } from './guards/global-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticationInput } from './inputs/authentication.input';
import { AuthenticationOutput } from './outputs/authentication.output';
import { parseToBoolean } from '../common/utils/shared.utils';
import EngineOptions from '../engine/interfaces/engine-options.interface';
import EngineService from '../engine/engine.service';

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
    private readonly configService: ConfigService,
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

    res.cookie(authConstants.cookie.name, data.accessToken, {
      httpOnly: parseToBoolean(
        this.configService.get(authConstants.cookie.httpOnly, 'true'),
      ),
      sameSite: this.configService.get<SameSiteType>(
        authConstants.cookie.sameSite,
        'strict',
      ),
      secure: parseToBoolean(
        this.configService.get(authConstants.cookie.secure, 'true'),
      ),
    });

    return {
      accessToken: data.accessToken,
    };
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
        }
      } catch (e) {
        this.logger.debug(
          `Service ${this.engineOptions.type} produce an error when logging out ${user.username}`,
        );
      }
    }

    res.clearCookie(authConstants.cookie.name);

    return true;
  }
}
