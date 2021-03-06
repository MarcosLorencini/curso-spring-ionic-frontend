import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";
import { EstadoDTO } from "../../models/estado.dto";


@Injectable()//para ser injetado em outras classes
export class EstadoService {

    constructor(public http: HttpClient) {
    }
    //busca os estados
    findAll() : Observable<EstadoDTO[]> {
        return this.http.get<EstadoDTO[]>(`${API_CONFIG.baseUrl}/estados`);
    }

}