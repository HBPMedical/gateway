import { AxiosResponse } from "axios";
import { Observable } from "rxjs";

export interface IEngineOptions {
    type: string;
}

export interface IEngineService {
    demo(): string;
}