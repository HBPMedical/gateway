import { HttpService } from '@nestjs/axios';
import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { Request } from 'express';
import { catchError, firstValueFrom } from 'rxjs';
import {
  ExperimentResult,
  MIME_TYPES,
} from 'src/common/interfaces/utilities.interface';
import { errorAxiosHandler } from 'src/common/utils/shared.utils';
import { ENGINE_MODULE_OPTIONS } from 'src/engine/engine.constants';
import ConnectorConfiguration from 'src/engine/interfaces/connector-configuration.interface';
import EngineOptions from 'src/engine/interfaces/engine-options.interface';
import { Domain } from 'src/engine/models/domain.model';
import { Algorithm } from 'src/engine/models/experiment/algorithm.model';
import { Experiment } from 'src/engine/models/experiment/experiment.model';
import { RawResult } from 'src/engine/models/result/raw-result.model';
import {
  TableResult,
  TableStyle,
} from 'src/engine/models/result/table-result.model';
import { ExperimentCreateInput } from 'src/experiments/models/input/experiment-create.input';
import EngineService from 'src/engine/interfaces/engine-service.interface';
import { User } from 'src/users/models/user.model';
import {
  dataToGroups,
  dsGroup,
  transformToDomain,
  transformToHisto,
  transformToTable,
} from './transformations';

export default class DataShieldConnector implements EngineService {
  private static readonly logger = new Logger(DataShieldConnector.name);
  headers = {};
  constructor(
    @Inject(ENGINE_MODULE_OPTIONS) private readonly options: EngineOptions,
    private readonly httpService: HttpService,
  ) {}

  getConfiguration(): ConnectorConfiguration {
    return {
      hasGalaxy: false,
      hasGrouping: false,
    };
  }

  async login(username: string, password: string): Promise<User> {
    const loginPath = this.options.baseurl + 'login';

    const user: User = {
      id: username,
      username,
      extraFields: {
        sid: '',
      },
    };

    const loginData = await firstValueFrom(
      this.httpService
        .get(loginPath, {
          auth: { username, password },
        })
        .pipe(catchError((e) => errorAxiosHandler(e))),
    );

    const cookies = loginData.headers['set-cookie'] ?? [];
    if (loginData.headers && loginData.headers['set-cookie']) {
      cookies.forEach((cookie) => {
        const [key, value] = cookie.split(/={1}/);
        if (key === 'sid') {
          user.extraFields.sid = value;
        }
      });
    }

    return user;
  }

  async getAlgorithms(): Promise<Algorithm[]> {
    return [];
  }

  async getHistogram(
    variable: string,
    datasets: string[],
    cookie?: string,
  ): Promise<RawResult> {
    const url = new URL(this.options.baseurl + `histogram`);

    url.searchParams.append('var', variable);
    url.searchParams.append('type', 'combine');
    url.searchParams.append('cohorts', datasets.join(','));

    const path = url.href;

    const response = await firstValueFrom(
      this.httpService.get(path, {
        headers: {
          cookie,
        },
      }),
    );

    if (response.data['global'] === undefined) {
      DataShieldConnector.logger.warn('Cannot parse histogram result');
      DataShieldConnector.logger.verbose(path);
      return {
        rawdata: {
          data:
            'Engine error when processing the request. Reason: ' +
            response.data,
          type: MIME_TYPES.ERROR,
        },
      };
    }

    const title = variable.replace(/\./g, ' ').trim();
    const data = { ...response.data, title };

    const chart = transformToHisto.evaluate(data);

    return {
      rawdata: {
        data: chart,
        type: 'application/vnd.highcharts+json',
      },
    };
  }

  async getDescriptiveStats(
    variable: string,
    datasets: string[],
    cookie?: string,
  ): Promise<TableResult> {
    const url = new URL(this.options.baseurl + 'quantiles');

    url.searchParams.append('var', variable);
    url.searchParams.append('type', 'split');
    url.searchParams.append('cohorts', datasets.join(','));

    const path = url.href;

    const response = await firstValueFrom(
      this.httpService.get(path, {
        headers: {
          cookie,
        },
      }),
    );

    const title = variable.replace(/\./g, ' ').trim();
    const data = { ...response.data, title };
    const table = transformToTable.evaluate(data);
    return {
      ...table,
      tableStyle: TableStyle.DEFAULT,
    };
  }

  async runExperiment(
    data: ExperimentCreateInput,
    request: Request,
  ): Promise<ExperimentResult[]> {
    const user = request.user as User;
    const cookie = [`sid=${user.extraFields['sid']}`, `user=${user.id}`].join(
      ';',
    );
    const expResult: Experiment = {
      id: `${data.algorithm.id}-${Date.now()}`,
      variables: data.variables,
      name: data.name,
      domain: data.domain,
      datasets: data.datasets,
      algorithm: {
        name: data.algorithm.id,
      },
    };

    switch (data.algorithm.id) {
      case 'MULTIPLE_HISTOGRAMS': {
        expResult.results = await Promise.all<RawResult>(
          data.variables.map((variable) =>
            this.getHistogram(variable, expResult.datasets, cookie),
          ),
        );
        break;
      }
      case 'DESCRIPTIVE_STATS': {
        expResult.results = await Promise.all<TableResult>(
          [...data.variables, ...data.coVariables].map((variable) =>
            this.getDescriptiveStats(variable, expResult.datasets, cookie),
          ),
        );
        break;
      }
    }

    return expResult.results;
  }

  async logout(request: Request): Promise<void> {
    const user = request.user as User;
    const cookie = [`sid=${user.extraFields['sid']}`, `user=${user.id}`].join(
      ';',
    );

    const path = new URL('/logout', this.options.baseurl).href;

    this.httpService.get(path, {
      headers: {
        cookie,
      },
    });
  }

  async getDomains(_ids: string[], request: Request): Promise<Domain[]> {
    const user = request.user as User;
    const sid = user && user.extraFields && user.extraFields['sid'];

    if (!sid)
      throw new InternalServerErrorException(
        'Datashield sid is missing from the user',
      );

    const cookies = [`sid=${user.extraFields['sid']}`, `user=${user.id}`];
    const path = this.options.baseurl + 'getvars';

    const response = await firstValueFrom(
      this.httpService.get(path, {
        headers: {
          cookie: cookies.join(';'),
        },
      }),
    );

    const dsDomain = transformToDomain.evaluate(response.data);
    const groups = response.data['groups'] as dsGroup[];

    dataToGroups(dsDomain, groups);
    return [dsDomain];
  }

  async getActiveUser(req: Request): Promise<User> {
    const user = req.user as User;

    if (!user) throw new InternalServerErrorException('User not found');

    return {
      username: user.id,
      id: user.id,
      fullname: user.id,
    };
  }
}
