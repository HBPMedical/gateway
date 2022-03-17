import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path/posix';
import { FilesService } from './files.service';

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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
      const text = this.filesService.getMarkdown(filename, baseurl);
      response.setHeader('Content-Type', 'text/markdown');
      return response.send(text);
    }

    const filepath = this.filesService.getAssetFile(filename);

    // Test if the file exist, if not send 404
    if (filepath) {
      return response.sendFile(filepath);
    } else {
      throw new NotFoundException();
    }
  }
}
