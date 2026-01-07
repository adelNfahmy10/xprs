import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@core/environment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly _HttpClient = inject(HttpClient)

  getAllCategories():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}categories/`)
  }
}
