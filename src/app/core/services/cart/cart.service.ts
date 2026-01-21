import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, OnInit, signal, WritableSignal } from '@angular/core';
import { environment } from '@core/environment/enviroment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly _HttpClient = inject(HttpClient)

  cartCount: WritableSignal<number> = signal(0);
  cartProducts: WritableSignal<any[]> = signal([]);
  subTotal: WritableSignal<number> = signal(0);
  token: WritableSignal<string | null> = signal(localStorage.getItem('xprsToken'));

  // ✅ cartId لازم Signal
  cartId = localStorage.getItem('userCartId') ? signal<string | null>(localStorage.getItem('userCartId')) : signal<string | null>(localStorage.getItem('xprsCartId'))

  constructor() {
    effect(() => {
      const id = this.cartId();

      if (!id) return;

      this.getCartCount(id).subscribe();
    });
  }

  getCartCount(cartId: string) {
    return this._HttpClient.get(`${environment.baseUrl}carts/${cartId}/`).pipe(
      tap((res: any) => {
        this.cartCount.set(res.cartproduct.length);
        this.cartProducts.set(res.cartproduct);
        this.subTotal.set(res.total);
        this.token.set(localStorage.getItem('xprsToken'));
      })
    );
  }

  updateCartProduct(body:any):Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}cartproducts/`, body);
  }

  setCartId(id: string) {
    localStorage.setItem('xprsCartId', id);
    this.cartId.set(id);
  }

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
