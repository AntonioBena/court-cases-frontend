import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CourtDto } from "../models/CourtDto";
import { CourtCaseDto } from "../models/CourtCaseDto";
import { CaseRequest } from "../models/requests/CaseRequest";

@Injectable({
  providedIn: 'root'
})
export class CaseService{

  private baseUrl = 'http://localhost:8080/api/v1/case';

    constructor(private http: HttpClient){
    }

  public getAllCases(fetchSize: number): Observable<CourtCaseDto[]>{
      //return this.http.get<any[]>(`${this.baseUrl}`); //TODO not implemented in backend yet
      return this.http.get<CourtCaseDto[]>('http://localhost:8080/api/v1/case?size=' + fetchSize);
    }

    public createCase(newCase: CaseRequest): Observable<any>{
      return this.http.post<any>(`${this.baseUrl}/create`, newCase);
    }




}
