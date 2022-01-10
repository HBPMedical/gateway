import { firstValueFrom, Observable } from 'rxjs';
import { IEngineOptions, IEngineService } from 'src/engine/engine.interfaces';
import { Domain } from 'src/engine/models/domain.model';
import { ExperimentCreateInput } from 'src/engine/models/experiment/input/experiment-create.input';
import {
  Experiment,
  PartialExperiment,
} from 'src/engine/models/experiment/experiment.model';
import { ListExperiments } from 'src/engine/models/experiment/list-experiments.model';
import { ExperimentEditInput } from 'src/engine/models/experiment/input/experiment-edit.input';
import { Algorithm } from 'src/engine/models/experiment/algorithm.model';
import { ENGINE_MODULE_OPTIONS } from 'src/engine/engine.constants';
import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { transformToDomains } from './transformations';

export default class DataShieldService implements IEngineService {
  constructor(
    @Inject(ENGINE_MODULE_OPTIONS) private readonly options: IEngineOptions,
    private readonly httpService: HttpService,
    @Inject(REQUEST) private readonly req: Request,
  ) {}

  logout(): void {
    throw new Error('Method not implemented.');
  }

  getAlgorithms(): Algorithm[] | Promise<Algorithm[]> {
    throw new Error('Method not implemented.');
  }

  createExperiment(
    data: ExperimentCreateInput,
    isTransient: boolean,
  ): Experiment | Promise<Experiment> {
    throw new Error('Method not implemented.');
  }

  listExperiments(
    page: number,
    name: string,
  ): ListExperiments | Promise<ListExperiments> {
    throw new Error('Method not implemented.');
  }

  getExperiment(uuid: string): Experiment | Promise<Experiment> {
    throw new Error('Method not implemented.');
  }

  removeExperiment(
    uuid: string,
  ): PartialExperiment | Promise<PartialExperiment> {
    throw new Error('Method not implemented.');
  }

  editExperient(
    uuid: string,
    expriment: ExperimentEditInput,
  ): Experiment | Promise<Experiment> {
    throw new Error('Method not implemented.');
  }

  async getDomains(): Promise<Domain[]> {
    const path = this.options.baseurl + 'start';

    const data = await firstValueFrom(
      this.httpService.get(path, {
        auth: { username: 'guest', password: 'guest123' },
      }),
    );
    return [transformToDomains.evaluate(data.data)];
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
