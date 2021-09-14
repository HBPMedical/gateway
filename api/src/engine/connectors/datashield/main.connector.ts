import { HttpService } from "@nestjs/axios";
import { Request } from "express";
import { Observable } from "rxjs";
import { IEngineOptions, IEngineService } from "src/engine/engine.interfaces";

export default class DataShieldService implements IEngineService {
    constructor(private readonly options: IEngineOptions, private readonly httpService: HttpService) { }

    demo(): string {
        return "datashield";
    }
    
    getExperiment(uuid: string): Observable<string> {
        throw new Error("Method not implemented.");
    }

    deleteExperiment(uuid: string, request: Request): Observable<string> {
        throw new Error("Method not implemented.");
    }

    editExperiment(uuid: string, request: Request): Observable<string> {
        throw new Error("Method not implemented.");
    }

    startExperimentTransient(request: Request): Observable<string> {
        throw new Error("Method not implemented.");
    }

    startExperiment(request: Request): Observable<string> {
        throw new Error("Method not implemented.");
    }
    
    getExperiments(): Observable<string> {
        throw new Error("Method not implemented.");
    }

    getAlgorithms(): Observable<string> {
        throw new Error("Method not implemented.");
    }
}