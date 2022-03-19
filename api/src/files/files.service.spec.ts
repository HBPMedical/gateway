import { Test, TestingModule } from '@nestjs/testing';
import { ENGINE_MODULE_OPTIONS } from '../engine/engine.constants';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

describe('FilesService', () => {
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

  it('Return file should be empty', () => {
    const filePathEmpty = service.getAssetFile('FILE_THAT_DOES_NOT_EXIST.txt');

    expect(filePathEmpty).toBeUndefined();
  });

  it('Try LFI injection', () => {
    const fileWithLFI = service.getAssetFile('../../../.env');

    expect(fileWithLFI).toBeUndefined();
  });

  it('Get existing file, should return something', () => {
    const filePath = service.getAssetFile('tos.md');

    expect(filePath).toEqual(expect.anything());
  });

  it('Get markdown file that exists, should return something', () => {
    const fileContent = service.getMarkdown('login.md', 'http://localtest');
    expect(!!fileContent).toBeTruthy();
    expect(fileContent.includes('http://localtest')).toBeTruthy();
  });

  it('Get markdown does not exist', () => {
    expect(
      service.getMarkdown('FILE_DO_NOT_EXIT.txt', 'http://fakeurl'),
    ).toEqual('');
  });
});
