import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@core/environment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private readonly _HttpClient = inject(HttpClient)

  getHomeData():Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}home/`);
  }

  getBrands():Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}brands/`);
  }

  headerBannerHome():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}homepage-header-banner/`);
  }

  extraBannerHome():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}homepage-extra-banner/`);
  }

  getCategories():Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}categories/`);
  }

  getOffersPopup():Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}page_popup/`);
  }

  getShopCategories():Observable<any>{
    return this._HttpClient.get(`${this._HttpClient}Shoppingcategories/`)
  }
}
