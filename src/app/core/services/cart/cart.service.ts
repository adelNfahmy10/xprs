import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@core/environment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly _HttpClient = inject(HttpClient)

  getCart(cartId:any):Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}carts/${cartId}/`);
  }

  addCart():Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}carts/`, {})
  }

  addCartProduct(body:any):Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}cartproducts/?product_page=true`, body);
  }

  deleteCart(id:any):Observable<any> {
    return this._HttpClient.delete(`${environment.baseUrl}cartproducts/${id}/`);
  }
}
