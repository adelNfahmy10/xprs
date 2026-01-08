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

  getProductsCategory(
    search: string = '',
    categories: string[] = [],
    brands: string[] = [],
    sort: string = '-id',
    page_size: number = 10,
    page: number = 1,
    price_low: string = '',
    price_heigh: string = '',
    top_offer: string = '',
    trending: string = '',
    top_selling: string = '',
    just_arrived: string = '',
    specialoffer1: string = '',
    specialoffer2: string = '',
    specialoffer3: string = ''
  ): Observable<any> {

    return this._HttpClient.get(
      `${environment.baseUrl}products/?search=${search}&price_low=${price_low}&price_heigh=${price_heigh}&sort=${sort}&categories=${categories.join(',')}&brands=${brands.join(',')}&top_offer=${top_offer}&trending=${trending}&top_selling=${top_selling}&just_arrived=${just_arrived}&specialoffer1=${specialoffer1}&specialoffer2=${specialoffer2}&specialoffer3=${specialoffer3}&page_size=${page_size}&page=${page}&is_website=true`
    );
  }

  getProducts(
    search: string = '',
    categories: string[] = [],
    subcategories: string[] = [],
    brands: string[] = [],
    graphicscard: string[] = [],
    processors: string[] = [],
    ram: string[] = [],
    storage: string[] = [],
    sort: string = '-id',
    page_size: number = 10,
    page: number = 1,
    price_low: string = '',
    price_heigh: string = '',
    top_offer: string = '',
    trending: string = '',
    top_selling: string = '',
    quickly_30: string = '',
    magazine: string = '',
    black_friday: string = '',
    just_arrived: string = '',
    specialoffer1: string = '',
    specialoffer2: string = '',
    specialoffer3: string = '',
    shoppingcategory_id: string = ''
  ): Observable<any> {

   return this._HttpClient.get(`${environment.baseUrl}products/?search=${search}&price_low=${price_low}&price_heigh=${price_heigh}&sort=${sort}&categories=${categories.join(',')}&sub_categories=${subcategories.join(',')}&brands=${brands.join(',')}&graphicscard=${graphicscard.join(',')}&processors=${processors.join(',')}&ram=${ram.join(',')}&storage=${storage.join(',')}&top_offer=${top_offer}&trending=${trending}&top_selling=${top_selling}&quickly_30=${quickly_30}&magazine=${magazine}&black_friday=${black_friday}&just_arrived=${just_arrived}&specialoffer1=${specialoffer1}&specialoffer2=${specialoffer2}&specialoffer3=${specialoffer3}&shoppingcategory_id=${shoppingcategory_id}&page_size=${page_size}&page=${page}&is_website=true`);
  }
}
