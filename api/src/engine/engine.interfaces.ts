import { Observable } from "rxjs";

export interface IEngineOptions {
    type: string;
    baseurl: string;
}

export interface IEngineService {
    demo(): string;

    getAlgorithms(): Observable<string>;
}