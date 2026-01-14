import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { CartService } from '@core/services/cart/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent{
  private readonly _CartService = inject(CartService)

  cartCount = this._CartService.cartCount
  cartProducts = this._CartService.cartProducts
  totalAmount = this._CartService.cartProducts
  cartId = this._CartService.cartId

  constructor(){
    effect(()=>{
      console.log(this.cartProducts());
      console.log(this.cartCount());
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
}
