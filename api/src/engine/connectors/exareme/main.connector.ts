import { HttpService } from "@nestjs/axios";
import { map, Observable } from "rxjs";
import { IEngineOptions, IEngineService } from "src/engine/engine.interfaces";

export default class ExaremeService implements IEngineService {
    constructor(private readonly options: IEngineOptions, private readonly httpService: HttpService) { }

    getAlgorithms(): Observable<string> {
        const path = this.options.baseurl + "algorithms";
        
        return this.httpService.get<string>(path).pipe(
            map(response => response.data)
        );
    }

    demo(): string {
        return "exareme"
    }
}