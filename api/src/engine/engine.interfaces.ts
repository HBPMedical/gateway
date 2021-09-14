import { Request } from 'express';
import { Observable } from 'rxjs';

export interface IEngineOptions {
  type: string;
  baseurl: string;
}

export interface IEngineService {
  demo(): string;

  getAlgorithms(request: Request): Observable<string>;

  getExperiments(request: Request): Observable<string>;

  getExperiment(uuid: string): Observable<string>;

  deleteExperiment(uuid: string, request: Request): Observable<string>;

  editExperiment(uuid: string, request: Request): Observable<string>;

  startExperimentTransient(request: Request): Observable<string>;

  startExperiment(request: Request): Observable<string>;

  getActiveUser(request: Request): Observable<string>;

  editActiveUser(request: Request): Observable<string>;
}
