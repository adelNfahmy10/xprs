import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '@core/environment/enviroment';
import { Observable, tap } from 'rxjs';
import { CartService } from '../cart/cart.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly _HttpClient = inject(HttpClient)
  private readonly _CartService = inject(CartService)

  shippingValue: WritableSignal<number> = signal(0);
  cartId = this._CartService.cartId

  constructor(){
    this.getShippingValue().subscribe()
  }

  getShippingValue():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}shipping-value/`).pipe(
      tap((res: any) => {
        this.shippingValue.set(res[0].shipping);
      })
    );
  }

  hiddingPayment():Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}hidden-payment-methods/`)
  }

  addOrder(body:any):Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}orders/`, body);
  }

  checkPromocode(code:any):Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}promo-codes/?from_mobile=0&code=${code}&cart=${this.cartId()}`);
  }

}
