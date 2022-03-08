import { HttpService } from '@nestjs/axios';
import { Inject, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { firstValueFrom, Observable } from 'rxjs';
import { MIME_TYPES } from 'src/common/interfaces/utilities.interface';
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
import { TableResult } from 'src/engine/models/result/table-result.model';
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

  logout(): void {
    throw new Error('Method not implemented.');
  }

  getAlgorithms(): Algorithm[] | Promise<Algorithm[]> {
    throw new Error('Method not implemented.');
  }

  async getHistogram(variable: string): Promise<RawResult> {
    const path =
      this.options.baseurl + `histogram?var=${variable}&type=combine`;

    const response = await firstValueFrom(
      this.httpService.get(path, {
        headers: {
          cookie: this.req['req'].headers['cookie'],
        },
      }),
    );

    if (response.data['breaks'] === undefined) {
      DataShieldService.logger.warn('Inconsistency on histogram result');
      DataShieldService.logger.verbose(path);
      return {
        rawdata: {
          data: response.data[0],
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

  async getDescriptiveStats(variable: string): Promise<TableResult> {
    const path = this.options.baseurl + `quantiles?var=${variable}&type=split`;

    const response = await firstValueFrom(
      this.httpService.get(path, {
        headers: {
          cookie: this.req['req'].headers['cookie'],
        },
      }),
    );

    const title = variable.replace(/\./g, ' ').trim();
    const data = { ...response.data, title };
    return transformToTable.evaluate(data);
  }

  async createExperiment(
    data: ExperimentCreateInput,
    isTransient: boolean,
  ): Promise<Experiment> {
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
            async (variable) => await this.getHistogram(variable),
          ),
        );
        break;
      }
      case 'DESCRIPTIVE_STATS': {
        expResult.results = await Promise.all<TableResult>(
          [...data.variables, ...data.coVariables].map(
            async (variable) => await this.getDescriptiveStats(variable),
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
    throw new Error('Method not implemented.');
  }

  removeExperiment(id: string): PartialExperiment | Promise<PartialExperiment> {
    throw new Error('Method not implemented.');
  }

  editExperient(
    id: string,
    expriment: ExperimentEditInput,
  ): Experiment | Promise<Experiment> {
    throw new Error('Method not implemented.');
  }

  async getDomains(): Promise<Domain[]> {
    const path = this.options.baseurl + 'start';

    const response = await firstValueFrom(
      this.httpService.get(path, {
        auth: { username: 'guest', password: 'guest123' },
      }),
    );

    if (response.headers && response.headers['set-cookie']) {
      const cookies = response.headers['set-cookie'] as string[];
      cookies.forEach((cookie) => {
        const [key, value] = cookie.split(/={1}/);
        this.req.res.cookie(key, value, {
          httpOnly: true,
          //sameSite: 'none',
        });
      });
    }

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
    throw new Error('Method not implemented.');
  }

  getExperimentREST(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  deleteExperiment(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  editExperimentREST(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  startExperimentTransient(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  startExperiment(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  getExperiments(): string {
    return '[]';
  }

  getAlgorithmsREST(): string {
    return '[]';
  }
}
