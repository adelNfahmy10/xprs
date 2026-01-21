import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@core/environment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalPolicyService {
  private readonly _HttpClient = inject(HttpClient)

  getAbout():Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}about-us/`)
  }
}
