import { NgClass } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { LogoBoxComponent } from "@component/logo-box.component";
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '@core/services/cart/cart.service';
import { CheckoutService } from '@core/services/checkout/checkout.service';

@Component({
  selector: 'app-signin',
  imports: [LogoBoxComponent, RouterLink,ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _AuthService = inject(AuthService)
  private readonly _CartService = inject(CartService)
  private readonly _CheckoutService = inject(CheckoutService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _Router = inject(Router)

  token = this._CartService.token
  cartId = this._CartService.cartId

  loginForm:FormGroup = this._FormBuilder.group({
    username:[null],
    password:[null]
  })

  submitLogin():void{
    let data = this.loginForm.value

    this._AuthService.login(data).subscribe({
      next:(res)=>{
        localStorage.setItem('xprsToken', res.token)
        this.token.set(localStorage.getItem('xprsToken'))
        localStorage.setItem('userCartId', '0')
        this.cartId.set(localStorage.getItem('userCartId'))

        this.getUserCart(this.cartId)
        this.getUserInfo()

        this._ToastrService.success('Login Successfully!')
        this._Router.navigate(['/home'])
      },
      error:(err)=>{
        this._ToastrService.error(err.error.username[0])
      }
    })
  }

  getUserCart(cartId:any):void{
    this._CartService.getCartCount(cartId).subscribe({
      next:(res)=>{
        this._CartService.cartCount.set(res.cartproduct.length);
        this._CartService.cartProducts.set(res.cartproduct);
        this._CartService.subTotal.set(res.total);
      }
    })
  }

  getUserInfo():void{
    if(this.token()){
      this._CheckoutService.getInfo().subscribe({
        next:(res)=>{
          localStorage.setItem('userId', res.id )
          localStorage.setItem('fullName', res.firstname + ' ' +res.lastname )
          localStorage.setItem('userEmail', res.email )
          localStorage.setItem('userPhone', res.phone )
        }
      })
    }
  }
}
