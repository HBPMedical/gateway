import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path/posix';
import { Observable } from 'rxjs';
import { AssetsService } from './assets.service';
import { ENGINE_SERVICE } from './engine.constants';
import { IEngineService } from './engine.interfaces';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';

@UseInterceptors(ErrorsInterceptor)
@Controller()
export class EngineController {
  constructor(
    @Inject(ENGINE_SERVICE) private readonly engineService: IEngineService,
    private readonly assetsService: AssetsService,
  ) {}

  @Get('assets/:name')
  getFile(
    @Req() request: Request,
    @Res() response: Response,
    @Param('name') filename: string,
  ) {
    if (filename.endsWith('.md')) {
      const baseurl =
        request.protocol +
        '://' +
        join(request.get('host'), process.env.BASE_URL_CONTEXT ?? '', 'assets'); // not full url, should consider "/services"
      const text = this.assetsService.getMarkdown(filename, baseurl);
      return response.send(text);
    }

    const filepath = this.assetsService.getAssetFile(filename);

    // Test if the file exist, if not send 404
    if (filepath) {
      return response.sendFile(filepath);
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
