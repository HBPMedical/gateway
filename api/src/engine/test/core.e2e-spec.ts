import { Test, TestingModule } from '@nestjs/testing';
import { Domain } from 'src/engine/models/domain.model';
import { AppModule } from '../../main/app.module';
import { TIMEOUT_DURATION_SECONDS } from '../connectors/exareme/interfaces/test-utilities';
import { ENGINE_SERVICE } from '../engine.constants';
import { IEngineService } from '../engine.interfaces';

jest.setTimeout(1000 * TIMEOUT_DURATION_SECONDS);

describe('Engine service', () => {
  let engineService: IEngineService;
  let domains: Domain[];

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    engineService = await moduleRef.resolve<IEngineService>(ENGINE_SERVICE);

    domains = await engineService.getDomains([]);
  });

  it('Get domains', async () => {
    expect(domains).toBeTruthy();
    expect(domains.length).toBeGreaterThanOrEqual(1);
  });

  it('Get datasets', async () => {
    domains.forEach((domain) => {
      expect(domain.datasets).toBeTruthy();
    });
  });

  it('Get algorithms', async () => {
    const algorithms = await engineService.getAlgorithms();
    expect(algorithms).toBeTruthy();
    expect(algorithms.length).toBeGreaterThanOrEqual(1);
  });

  it('Get groups', async () => {
    domains.forEach((domain) => {
      expect(domain.groups).toBeTruthy();
      expect(domain.groups.length).toBeGreaterThanOrEqual(1);
    });
  });
});
