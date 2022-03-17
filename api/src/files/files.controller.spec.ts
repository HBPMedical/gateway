import { Test, TestingModule } from '@nestjs/testing';
import { ENGINE_MODULE_OPTIONS } from '../engine/engine.constants';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

describe('FilesController', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: ENGINE_MODULE_OPTIONS,
          useValue: {
            type: 'test',
            baseurl: 'test',
          },
        },
        FilesService,
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('getAssetFile', () => {
    const filePathEmpty = service.getAssetFile('FILE_THAT_DOES_NOT_EXIST.txt');
    const filePath = service.getAssetFile('tos.md');
    const fileWithLFI = service.getAssetFile('../../../.env');

    expect(filePathEmpty).toBeUndefined();
    expect(fileWithLFI).toBeUndefined();
    expect(filePath).toEqual(expect.anything());
  });

  it('markdown', () => {
    const fileContent = service.getMarkdown('login.md', 'http://localtest');
    expect(!!fileContent).toBeTruthy();
    expect(fileContent.includes('http://localtest')).toBeTruthy();
  });
});
