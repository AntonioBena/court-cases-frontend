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


      // public createDecision(caseLabel: string, decision: DecisionDto): Observable<DecisionDto> {
      //   let params = new HttpParams().set("caseLabel", caseLabel);

      //   return this.http.post<DecisionDto>(`${this.baseUrl}/create`, decision, { params });
      // }


//     public ResponseEntity<PageResponse<CourtCaseDto>> getCases(
//       @RequestParam(name = "page", defaultValue = "0", required = false) int page,
//       @RequestParam(name = "size", defaultValue = "10", required = false) int size
// ) {
//   return ResponseEntity.ok(courtCaseService.getAllDisplayableCases(page, size));
// }

    public createCase(newCase: CaseRequest): Observable<any>{
      return this.http.post<any>(`${this.baseUrl}/create`, newCase);
    }

    public updateCase(newCase: CaseRequest): Observable<any>{
      return this.http.post<any>(`${this.baseUrl}/update`, newCase);
    }




}
