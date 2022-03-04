import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path/posix';
import { Observable } from 'rxjs';
import { ENGINE_MODULE_OPTIONS, ENGINE_SERVICE } from './engine.constants';
import { IEngineOptions, IEngineService } from './engine.interfaces';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
@UseInterceptors(ErrorsInterceptor)
@Controller()
export class EngineController {
  constructor(
    @Inject(ENGINE_SERVICE) private readonly engineService: IEngineService,
    @Inject(ENGINE_MODULE_OPTIONS)
    private readonly engineOptions: IEngineOptions,
  ) {}

  @Get('assets/:name')
  getFile(
    @Res({ passthrough: true }) response: Response,
    @Param('name') name: string,
  ) {
    // Construct file path based on the connector id
    let filePath = join(
      process.cwd(),
      'assets/engines',
      this.engineOptions.type,
      name,
    );

    // if file doesn't exist for the current connector fallback to default
    if (!fs.existsSync(filePath)) {
      filePath = join(
        process.cwd(),
        'assets/engines/default',
        name.toLowerCase(),
      );
    }

    // Test if the file exist, if not send 404
    if (fs.existsSync(filePath)) {
      return response.sendFile(filePath);
    } else {
      throw new NotFoundException();
    }
  }

  @Get('/algorithms')
  getAlgorithms(): Observable<string> | string {
    return this.engineService.getAlgorithmsREST();
  }

  @Get('activeUser')
  getActiveUser(): Observable<string> | string {
    return this.engineService.getActiveUser();
  }

  @Post('activeUser/agreeNDA')
  agreeNDA(): Observable<string> | string {
    return this.engineService.editActiveUser();
  }

  @Get('logout')
  logout(): void {
    this.engineService.logout();
  }

  @Get('galaxy')
  galaxy(): Observable<string> | string {
    return this.engineService.getPassthrough?.('galaxy');
  }
}
