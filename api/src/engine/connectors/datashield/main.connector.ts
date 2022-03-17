import { HttpService } from '@nestjs/axios';
import { Inject, Logger, NotImplementedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { catchError, firstValueFrom, Observable } from 'rxjs';
import { User } from 'src/users/models/user.model';
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
import {
  Experiment,
  PartialExperiment,
} from 'src/engine/models/experiment/experiment.model';
import { ExperimentCreateInput } from 'src/engine/models/experiment/input/experiment-create.input';
import { ExperimentEditInput } from 'src/engine/models/experiment/input/experiment-edit.input';
import { ListExperiments } from 'src/engine/models/experiment/list-experiments.model';
import { RawResult } from 'src/engine/models/result/raw-result.model';
import {
  TableResult,
  ThemeType,
} from 'src/engine/models/result/table-result.model';
import {
  transformToDomains,
  transformToHisto,
  transformToTable,
} from './transformations';

export default class DataShieldService implements IEngineService {
  private static readonly logger = new Logger(DataShieldService.name);
  headers = {};
  constructor(
    @Inject(ENGINE_MODULE_OPTIONS) private readonly options: IEngineOptions,
    private readonly httpService: HttpService,
    @Inject(REQUEST) private readonly req: Request,
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

  getAlgorithms(): Algorithm[] | Promise<Algorithm[]> {
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
          data: 'Engine result are inconsitent',
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
      theme: ThemeType.NORMAL,
    };
  }

  async createExperiment(
    data: ExperimentCreateInput,
    isTransient: boolean,
  ): Promise<Experiment> {
    const user = this.req.user as User;
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
        id: data.algorithm.id,
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

  listExperiments(
    page: number,
    name: string,
  ): ListExperiments | Promise<ListExperiments> {
    return {
      totalExperiments: 0,
      experiments: [],
      totalPages: 0,
      currentPage: 0,
    };
  }

  getExperiment(id: string): Experiment | Promise<Experiment> {
    throw new NotImplementedException();
  }

  removeExperiment(id: string): PartialExperiment | Promise<PartialExperiment> {
    throw new NotImplementedException();
  }

  editExperient(
    id: string,
    expriment: ExperimentEditInput,
  ): Experiment | Promise<Experiment> {
    throw new NotImplementedException();
  }

  async getDomains(): Promise<Domain[]> {
    const user = this.req.user as User;
    const cookies = [`sid=${user.extraFields['sid']}`, `user=${user.id}`];
    const path = this.options.baseurl + 'getvars';

    const response = await firstValueFrom(
      this.httpService.get(path, {
        headers: {
          cookie: cookies.join(';'),
        },
      }),
    );

    return [transformToDomains.evaluate(response.data)];
  }

  getActiveUser(): string {
    const dummyUser = {
      username: 'anonymous',
      subjectId: 'anonymousId',
      fullname: 'anonymous',
      email: 'anonymous@anonymous.com',
      agreeNDA: true,
    };
    return JSON.stringify(dummyUser);
  }

  editActiveUser(): Observable<string> {
    throw new NotImplementedException();
  }

  getExperimentREST(): Observable<string> {
    throw new NotImplementedException();
  }

  deleteExperiment(): Observable<string> {
    throw new NotImplementedException();
  }

  editExperimentREST(): Observable<string> {
    throw new NotImplementedException();
  }

  startExperimentTransient(): Observable<string> {
    throw new NotImplementedException();
  }

  startExperiment(): Observable<string> {
    throw new NotImplementedException();
  }

  getExperiments(): string {
    return '[]';
  }

  getAlgorithmsREST(): string {
    return '[]';
  }
}
