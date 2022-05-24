import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentsResolver } from './experiments.resolver';

describe('ExperimentsResolver', () => {
  let resolver: ExperimentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExperimentsResolver],
    }).compile();

    resolver = module.get<ExperimentsResolver>(ExperimentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
