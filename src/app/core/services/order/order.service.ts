import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@core/environment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly _HttpClient = inject(HttpClient)

  getOrders():Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}orders/`);
  }

  cancelOrder(orderId:any, body:any):Observable<any> {
    // let data = { 'status': status, reason_for_cancelation: reason };
    return this._HttpClient.put(`${environment.baseUrl}orders/${orderId}/`, body)
  }

  shippingInstruction() {
    return this._HttpClient.get(`${environment.baseUrl}shipping-and-delivery-instructions/`)
  }

}
