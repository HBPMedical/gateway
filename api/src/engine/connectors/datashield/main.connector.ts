import { HttpService } from "@nestjs/axios";
import { IEngineOptions, IEngineService } from "src/engine/engine.interface";

export default class DataShieldService implements IEngineService {
    constructor(private readonly options: IEngineOptions, private readonly httpService: HttpService) { }

    demo(): string {
        return "datashield";
    }
}