import { HttpService } from '@nestjs/axios';
import {
  Inject,
  InternalServerErrorException,
  Logger,
  NotImplementedException,
} from '@nestjs/common';
import { Request } from 'express';
import { catchError, firstValueFrom } from 'rxjs';
import { MIME_TYPES } from 'src/common/interfaces/utilities.interface';
import { errorAxiosHandler } from 'src/common/utilities';
import { ENGINE_MODULE_OPTIONS } from 'src/engine/engine.constants';
import {
  IConfiguration,
  IEngineOptions,
  IEngineService,
} from 'src/engine/engine.interfaces';
import { Domain } from 'src/engine/models/domain.model';
import { Algorithm } from 'src/engine/models/experiment/algorithm.model';
import { Experiment } from 'src/engine/models/experiment/experiment.model';
import { ExperimentCreateInput } from 'src/experiments/models/input/experiment-create.input';
import { ListExperiments } from 'src/engine/models/experiment/list-experiments.model';
import { RawResult } from 'src/engine/models/result/raw-result.model';
import {
  TableResult,
  TableStyle,
} from 'src/engine/models/result/table-result.model';
import { User } from 'src/users/models/user.model';
import {
  dataToGroups,
  dsGroup,
  transformToDomain,
  transformToHisto,
  transformToTable,
} from './transformations';

export default class DataShieldService implements IEngineService {
  private static readonly logger = new Logger(DataShieldService.name);
  headers = {};
  constructor(
    @Inject(ENGINE_MODULE_OPTIONS) private readonly options: IEngineOptions,
    private readonly httpService: HttpService,
  ) {}

  getConfiguration(): IConfiguration {
    return {};
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

    const cookies = (loginData.headers['set-cookie'] as string[]) ?? [];
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
    throw new NotImplementedException();
  }

  async getHistogram(variable: string, cookie?: string): Promise<RawResult> {
    const path =
      this.options.baseurl + `histogram?var=${variable}&type=combine`;

    const response = await firstValueFrom(
      this.httpService.get(path, {
        headers: {
          cookie,
        },
      }),
    );

    if (response.data['global'] === undefined) {
      DataShieldService.logger.warn('Inconsistency on histogram result');
      DataShieldService.logger.verbose(path);
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
    cookie?: string,
  ): Promise<TableResult> {
    const path = this.options.baseurl + `quantiles?var=${variable}&type=split`;

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

  async createExperiment(
    data: ExperimentCreateInput,
    isTransient: boolean,
    request: Request,
  ): Promise<Experiment> {
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
          data.variables.map(
            async (variable) => await this.getHistogram(variable, cookie),
          ),
        );
        break;
      }
      case 'DESCRIPTIVE_STATS': {
        expResult.results = await Promise.all<TableResult>(
          [...data.variables, ...data.coVariables].map(
            async (variable) =>
              await this.getDescriptiveStats(variable, cookie),
          ),
        );
        break;
      }
    }

    return expResult;
  }

  async listExperiments(): Promise<ListExperiments> {
    return {
      totalExperiments: 0,
      experiments: [],
      totalPages: 0,
      currentPage: 0,
    };
  }

  async getExperiment(id: string): Promise<Experiment> {
    throw new NotImplementedException();
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

  async getDomains(ids: string[], request: Request): Promise<Domain[]> {
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
    return {
      username: user.id,
      id: user.id,
      fullname: user.id,
    };
  }
}
