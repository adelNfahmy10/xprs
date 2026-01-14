import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@core/environment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly _HttpClient = inject(HttpClient)

  getFavorites():Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}users/me/favorites/`);
  }

  addFavorites(id:any):Observable<any> {
    return this._HttpClient.put(`${environment.baseUrl}users/me/favorites/`, { product_id: id });
  }

  deleteFavorites(id:any):Observable<any> {
    return this._HttpClient.delete(`${environment.baseUrl}users/me/favorites/${id}/`);
  }
}
