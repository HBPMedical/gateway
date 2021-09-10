import { HttpService } from "@nestjs/axios";
import { IEngineOptions, IEngineService } from "src/engine/engine.interfaces";

export default class ExaremeService implements IEngineService {
    constructor(private readonly options: IEngineOptions, private readonly httpService: HttpService) { }

    demo(): string {
        return "exareme"
    }
}