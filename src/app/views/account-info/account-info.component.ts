import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { CheckoutService } from '@core/services/checkout/checkout.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FavoriteComponent } from "@views/favorite/favorite.component";
import { OrderComponent } from "@views/order/order.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account-info',
  imports: [NgbNavModule, FavoriteComponent, OrderComponent, ReactiveFormsModule],
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.scss'
})
export class AccountInfoComponent implements OnInit{
  private readonly _AuthService = inject(AuthService)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _CheckoutService = inject(CheckoutService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _Router = inject(Router)

  userData:any
  fullName:string | null = localStorage.getItem('fullName')
  userEmail:string | null = localStorage.getItem('userEmail')
  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  currentYear = new Date().getFullYear();
  years: number[] = Array.from(
    { length: this.currentYear - 1950 + 1 },
    (_, i) => this.currentYear - i
  );
  gender:string[] = ['male','female']


  ngOnInit(): void {
    this.getUserInfo()
  }

  getUserInfo():void{
    this._CheckoutService.getInfo().subscribe({
      next:(res)=>{
        this.userData = res
        this.patchUserData()
      }
    })
  }

  // افترض userData.dob = "2007-10-17"
  patchUserData(): void {
    if (!this.userData) return;

    this.updateUserForm.patchValue({
      ...this.userData,
    });

    if (this.userData.dob) {
      const [year, month, day] = this.userData.dob.split('-');

      // نضمن رقمين
      this.daySelected = String(Number(day));
      this.monthSelected = String(Number(month));
      this.yearSelected = year;
    }
  }

  logout():void {
    localStorage.removeItem('xprsToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('fullName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userPhone')
    this._Router.navigateByUrl('/home').then(() => {
      window.location.reload();
    });
  }

  updateUserForm:FormGroup = this._FormBuilder.group({
    firstname:[null],
    lastname:[null],
    phone:[null],
    dob:[null],
    gender:[null]
  })

  daySelected: string = '';
  monthSelected: string = '';
  yearSelected: string = '';

  selectDay(event: Event): void {
    this.daySelected = (event.target as HTMLSelectElement).value;
  }

  selectMonth(event: Event): void {
    this.monthSelected = (event.target as HTMLSelectElement).value;
  }

  selectYear(event: Event): void {
    this.yearSelected = (event.target as HTMLSelectElement).value;
  }

  submitUpdateUser():void{
    let data = { ...this.updateUserForm.value };

    if (!this.daySelected || !this.monthSelected || !this.yearSelected) {
      return;
    }

    const day = this.daySelected.padStart(2, '0');
    const month = this.monthSelected.padStart(2, '0');

    data.dob = `${this.yearSelected}-${month}-${day}`;

    this._AuthService.updateUser(data).subscribe({
      next: (res) => {
        this.updateUserForm.reset();
        this.daySelected = '';
        this.monthSelected = '';
        this.yearSelected = '';
        this.getUserInfo()

        this._ToastrService.success('Update Data Is Successfully');
      },
      error: (err) => {
        this._ToastrService.error(err.error.details)
      }
    });
  }

  changePasswordForm:FormGroup = this._FormBuilder.group({
    old_password:[null],
    new_password1:[null],
    new_password2:[null],
  })

  submitChangePassword():void{
    let data = this.changePasswordForm.value

    this._AuthService.changePassword(data).subscribe({
      next:(res)=>{
        console.log(res);
        this.changePasswordForm.reset();
        this._ToastrService.success('Change Password Is Successfully');
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }


}

