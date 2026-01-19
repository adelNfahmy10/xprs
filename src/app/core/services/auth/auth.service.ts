import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@core/environment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _HttpClient = inject(HttpClient)

  login(body:any):Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}users/login/`, body);
  }


  register(body:any):Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}users/me/?from_website=true/`, body);
  }
}
