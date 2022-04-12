import {
  Inject,
  InternalServerErrorException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Response, Request } from 'express';
import { GQLRequest } from '../common/decorators/gql-request.decoractor';
import { GQLResponse } from '../common/decorators/gql-response.decoractor';
import { parseToBoolean } from '../common/utilities';
import {
  ENGINE_MODULE_OPTIONS,
  ENGINE_SERVICE,
} from '../engine/engine.constants';
import { IEngineOptions, IEngineService } from '../engine/engine.interfaces';
import { User } from '../users/models/user.model';
import { authConstants } from './auth-constants';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticationInput } from './inputs/authentication.input';
import { AuthenticationOutput } from './outputs/authentication.output';

//Custom defined type because Pick<CookieOptions, 'sameSite'> does not work
type SameSiteType = boolean | 'lax' | 'strict' | 'none' | undefined;

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(
    @Inject(ENGINE_SERVICE) private readonly engineService: IEngineService,
    @Inject(ENGINE_MODULE_OPTIONS)
    private readonly engineOptions: IEngineOptions,
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
  @UseGuards(JwtAuthGuard)
  logout(
    @GQLRequest() req: Request,
    @GQLResponse() res: Response,
    @CurrentUser() user: User,
  ): boolean {
    if (user) {
      this.logger.verbose(`${user.username} logged out`);
      try {
        this.engineService.logout?.(req);
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
