import { Component, inject } from '@angular/core';
import { LogoBoxComponent } from "@component/logo-box.component";
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { AuthService } from '@core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  imports: [LogoBoxComponent, RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _AuthService = inject(AuthService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _Router = inject(Router)

  registerForm:FormGroup = this._FormBuilder.group({
    firstname: [null],
    lastname: [null],
    email: [null],
    phone: [null],
    password: [null],
    repassword: [null],
  })


  submitRegister():void{
    let data = this.registerForm.value

    this._AuthService.register(data).subscribe({
      next:(res)=>{
        // localStorage.setItem('xprsToken', res.token)
        this._ToastrService.success(res.details)
        this._Router.navigate(['/login'])
      },
      error:(err)=>{
        this._ToastrService.error(err.error.details)
      }
    })
  }
}
