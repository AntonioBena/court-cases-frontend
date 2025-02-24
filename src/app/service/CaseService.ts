import { HttpClient, HttpParams } from "@angular/common/http";
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

  public getAllCases(page: number, size: number): Observable<CourtCaseDto[]>{
    let params = new HttpParams()
    .set("page", page)
    .set('size', size);
      return this.http.get<CourtCaseDto[]>(`${this.baseUrl}`, {params});
    }

    public filterCases(page: number, size: number, isDesc: boolean, caseLabel: string, courtName: string): Observable<CourtCaseDto[]>{
      let params = new HttpParams()
      .set("page", page)
      .set('size', size)
      .set('isDesc', isDesc)
      .set('caseLabel', caseLabel)
      .set('courtName', courtName);
        return this.http.get<CourtCaseDto[]>(`${this.baseUrl}/by-filter`, {params});
      }

    public createCase(newCase: CaseRequest): Observable<any>{
      return this.http.post<any>(`${this.baseUrl}/create`, newCase);
    }

    public updateCase(newCase: CaseRequest): Observable<any>{
      return this.http.post<any>(`${this.baseUrl}/update`, newCase);
    }

}
