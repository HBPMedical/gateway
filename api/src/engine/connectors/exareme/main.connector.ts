import { HttpService } from "@nestjs/axios";
import { Request, response } from "express";
import { map, Observable } from "rxjs";
import { IEngineOptions, IEngineService } from "src/engine/engine.interfaces";

export default class ExaremeService implements IEngineService {
    constructor(private readonly options: IEngineOptions, private readonly httpService: HttpService) { }

    demo(): string {
        return "exareme"
    }

    getExperiment(uuid: string): Observable<string> {
        const path = this.options.baseurl + `experiments/${uuid}`;

        return this.httpService.get<string>(path).pipe(
            map(response => response.data)
        );
    }

    deleteExperiment(uuid: string, request: Request): Observable<string> {
        const path = this.options.baseurl + `experiments/${uuid}`;
        //request.query

        return this.httpService.delete(path).pipe(
            map(response => response.data)
        )
    }

    editExperiment(uuid: string, request: Request): Observable<string> {
        const path = this.options.baseurl + `experiments/${uuid}`;

        throw new Error("Method not implemented.");
    }

    startExperimentTransient(request: Request): Observable<string> {
        const path = this.options.baseurl + "experiments";

        throw new Error("Method not implemented.");
    }

    startExperiment(request: Request): Observable<string> {
        const path = this.options.baseurl + "experiments/transient";

        throw new Error("Method not implemented.");
    }

    getExperiments(): Observable<string> {
        const path = this.options.baseurl + "experiments";

        return this.httpService.get<string>(path).pipe(
            map(response => response.data)
        );
    }

    getAlgorithms(): Observable<string> {
        const path = this.options.baseurl + "algorithms";
        
        return this.httpService.get<string>(path).pipe(
            map(response => response.data)
        );
    }
}