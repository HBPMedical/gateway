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

  it('should be defined', () => {
    expect(service.getAssetFile('tos.md')).toEqual(expect.anything());
  });
});
