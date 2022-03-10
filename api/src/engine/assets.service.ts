import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path/posix';
import { ENGINE_MODULE_OPTIONS } from './engine.constants';
import { IEngineOptions } from './engine.interfaces';

@Injectable()
export class AssetsService {
  constructor(
    @Inject(ENGINE_MODULE_OPTIONS)
    private readonly engineOptions: IEngineOptions,
  ) {}

  /**
   * Get internal asset file from filename
   * @param filename
   * @returns string if file is found undefined otherwise
   */
  getAssetFile(filename: string): string | undefined {
    // Construct file path based on the connector id
    let filePath = join(
      process.cwd(),
      'assets/engines',
      this.engineOptions.type,
      filename,
    );

    // if file doesn't exist for the current connector fallback to default
    if (!fs.existsSync(filePath)) {
      filePath = join(
        process.cwd(),
        'assets/engines/default',
        filename.toLowerCase(),
      );
    }

    if (!filePath.includes('assets/engines')) return undefined;

    return fs.existsSync(filePath) ? filePath : undefined;
  }

  /**
   * Get markdown enhanced with custom variable
   * `$ASSETS_URL$` will be transform with backend url
   * @param filename name of the asset
   * @param baseurl url of the backend service
   * @returns string markdown
   */
  getMarkdown(filename: string, baseurl: string): string {
    const filePath = this.getAssetFile(filename);

    if (!filePath) return '';

    const md = fs.readFileSync(filePath).toString();

    return md.replace(/\$ASSETS_URL\$/g, baseurl);
  }
}
