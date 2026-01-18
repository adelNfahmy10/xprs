import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '@core/services/cart/cart.service';
import { CheckoutService } from '@core/services/checkout/checkout.service';
import { switchMap } from 'rxjs';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent{
  private readonly _CartService = inject(CartService)
  private readonly _CheckoutService = inject(CheckoutService)

  cartCount = this._CartService.cartCount
  cartProducts = this._CartService.cartProducts
  subTotal = this._CartService.subTotal
  shippingValue = this._CheckoutService.shippingValue
  cartId = this._CartService.cartId

  constructor(){
    effect(()=>{
      // console.log(this.cartProducts());
      // console.log(this.cartCount());
      // console.log(this.shippingValue());
    })
  }

  getAllCart():void{
    if(this.cartId){
      this._CartService.getCart(this.cartId()).subscribe({
        next:(res)=>{
          this._CartService.cartCount.set(res.cartproduct.length)
          this._CartService.cartProducts.set(res.cartproduct)
        }
      })
    }
  }

  deleteProductInCart(productId:any):void{
    this._CartService.deleteCart(productId).subscribe({
      next:(res)=>{
        this.getAllCart()
      }
    })
  }

  quantity: number = 1; // القيمة الافتراضية
  increaseQuantity(item:any) {
    this.quantity += 1;
    this.updateProductCount(item)
  }
  decreaseQuantity(item:any) {
    if (this.quantity > 1) {
      this.quantity -= 1;
      this.updateProductCount(item)
    }
  }

  updateProductCount(item:any):void{
    let data = {
      cart: this.cartId(),
      product: item.id,
      product_property: item.product_property,
      quantity: this.quantity
    }


    this._CartService.updateCartProduct(data).pipe(
      switchMap(() => this._CartService.getCartCount(this.cartId()!))
    ).subscribe({
      next: (res) => {
        // console.log(res);
      },
      error: (err) => {
        this.quantity = 1
      }
    });
  }
}
