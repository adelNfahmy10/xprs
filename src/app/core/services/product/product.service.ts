import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@core/environment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly _HttpClient = inject(HttpClient)

  getProductDetails(slug:any):Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}products/${slug}/?is_website=true`);
  }

  messageInstallment():Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}installment-message/`);
  }

  installment(id:any):Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}bank-installments/?product_id=${id}`);
  }

  getInstallments(product_property_id:any, months:any, downpayment:any, bank:any, interest:any):Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}installment-calculator/?action=calculate_bank_installment&interest=${interest}&bank=${bank}&product_property_id=${product_property_id}&months=${months}&downpayment=${downpayment}`);
  }

  insuranceTerms():Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}insurance-terms/`);
  }

  getAccInstallments(product_id:any, months:any, downpayment:any, bank:any, interest:any):Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}installment-calculator/?action=calculate_bank_installment&interest=${interest}&bank=${bank}&product_id=${product_id}&months=${months}&downpayment=${downpayment}`);
  }

  notify(body:any):Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}in-stock-email/?is_website=true`, body);
  }


}
