import { Request } from "express";
import { Observable } from "rxjs";

export interface IEngineOptions {
    type: string;
    baseurl: string;
}

export interface IEngineService {
    demo(): string;

    getAlgorithms(request: Request): Observable<string>;

    getExperiments(request: Request): Observable<string>;
}