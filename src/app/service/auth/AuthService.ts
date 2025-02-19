import { Injectable } from "@angular/core";
import { RegistrationRequest } from "../../models/requests/RegistrationRequest";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { AuthenticationRequest } from "../../models/requests/AuthenticationRequest";

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  private baseUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient){
    }

    public register(registrationRequest: RegistrationRequest): Observable<any>{
      return this.http.post<any>(`${this.baseUrl}/register`, registrationRequest);
    }

    public login(authenticationRequest: AuthenticationRequest): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}/authenticate`, authenticationRequest);
    }

}
