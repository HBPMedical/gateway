import { HttpService } from "@nestjs/axios";
import { Observable } from "rxjs";
import { IEngineOptions, IEngineService } from "src/engine/engine.interfaces";

export default class DataShieldService implements IEngineService {
    constructor(private readonly options: IEngineOptions, private readonly httpService: HttpService) { }
    
    getExperiments(): Observable<string> {
        throw new Error("Method not implemented.");
    }

    getAlgorithms(): Observable<string> {
        throw new Error("Method not implemented.");
    }

    demo(): string {
        return "datashield";
    }
}