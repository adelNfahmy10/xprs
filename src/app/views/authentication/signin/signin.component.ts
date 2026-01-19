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
  userData:any

  loginForm:FormGroup = this._FormBuilder.group({
    username:[null],
    password:[null]
  })

  submitLogin():void{
    let data = this.loginForm.value

    this._AuthService.login(data).subscribe({
      next:(res)=>{
        console.log(res);
        localStorage.setItem('xprsToken', res.token)
        this._ToastrService.success('Login Successfully!')
        this.token.set(localStorage.getItem('xprsToken'))
        this.getUserInfo()
        this._Router.navigate(['/home'])
      },
      error:(err)=>{
        this._ToastrService.error(err.error.username[0])
      }
    })
  }

  getUserInfo():void{
    this._CheckoutService.getInfo(this.token()).subscribe({
      next:(res)=>{
        if(this.token()){
          this.userData = res;
          localStorage.setItem('userId', res.id )
          localStorage.setItem('fullName', res.firstname + res.lastname )
          localStorage.setItem('email', res.email )
          localStorage.setItem('phone', res.phone )
          localStorage.setItem('userCartId', res.cartId )
        }
      }
    })
  }


}
