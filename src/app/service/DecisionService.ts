
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CourtDto } from "../models/CourtDto";
import { CourtRequest } from '../models/requests/CourtRequest';
import { DecisionDto } from "../models/DecisionDto";

@Injectable({
  providedIn: 'root'
})
export class DecisionService{

  constructor(private http: HttpClient){

  }

  private baseUrl = 'http://localhost:8080/api/v1/decision';

  public createDecision(caseLabel: string, decision: DecisionDto): Observable<DecisionDto> {
    let params = new HttpParams().set("caseLabel", caseLabel);

    return this.http.post<DecisionDto>(`${this.baseUrl}/create`, decision, { params });
  }

}
