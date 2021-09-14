import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import { map, Observable } from 'rxjs';
import { IEngineOptions, IEngineService } from 'src/engine/engine.interfaces';

export default class ExaremeService implements IEngineService {
  constructor(
    private readonly options: IEngineOptions,
    private readonly httpService: HttpService,
  ) {}

  demo(): string {
    return 'exareme';
  }

  getActiveUser(): Observable<string> {
    const path = this.options.baseurl + 'activeUser';

    return this.httpService
      .get<string>(path)
      .pipe(map((response) => response.data));
  }

  editActiveUser(request: Request): Observable<string> {
    const path = this.options.baseurl + 'activeUser/agreeNDA';

    return this.httpService
      .post<string>(path, request.body)
      .pipe(map((response) => response.data));
  }

  getExperiment(uuid: string): Observable<string> {
    const path = this.options.baseurl + `experiments/${uuid}`;

    return this.httpService
      .get<string>(path)
      .pipe(map((response) => response.data));
  }

  deleteExperiment(uuid: string): Observable<string> {
    const path = this.options.baseurl + `experiments/${uuid}`;

    return this.httpService.delete(path).pipe(map((response) => response.data));
  }

  editExperiment(uuid: string, request: Request): Observable<string> {
    const path = this.options.baseurl + `experiments/${uuid}`;

    return this.httpService
      .post(path, request.body)
      .pipe(map((response) => response.data));
  }

  startExperimentTransient(request: Request): Observable<string> {
    const path = this.options.baseurl + 'experiments/transient';

    return this.httpService
      .post(path, request.body)
      .pipe(map((response) => response.data));
  }

  startExperiment(request: Request): Observable<string> {
    const path = this.options.baseurl + 'experiments';

    return this.httpService
      .post(path, request.body)
      .pipe(map((response) => response.data));
  }

  getExperiments(): Observable<string> {
    const path = this.options.baseurl + 'experiments';

    return this.httpService
      .get<string>(path)
      .pipe(map((response) => response.data));
  }

  getAlgorithms(): Observable<string> {
    const path = this.options.baseurl + 'algorithms';

    return this.httpService
      .get<string>(path)
      .pipe(map((response) => response.data));
  }
}
