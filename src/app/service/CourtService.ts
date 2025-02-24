import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CourtDto } from "../models/CourtDto";
import { CourtRequest } from '../models/requests/CourtRequest';

@Injectable({
  providedIn: 'root'
})
export class CourtService{
  private baseUrl = '';

  constructor(private http: HttpClient){
  }

  public getAllCourts(): Observable<CourtDto[]>{
    return this.http.get<CourtDto[]>(`${this.baseUrl}`);
  }

  public createCourt(courtRequest: CourtRequest): Observable<CourtDto>{
    return this.http.post<CourtDto>(`${this.baseUrl}/create`, courtRequest);
  }

  public updateCourt(courtRequest: CourtRequest): Observable<CourtDto>{
    return this.http.put<CourtDto>(`${this.baseUrl}/update`, courtRequest);
  }
}
