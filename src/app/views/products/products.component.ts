import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@core/services/product/product.service';
import { NgbCollapse } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, NgbCollapse],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductsComponent implements OnInit{
  private readonly _ProductService = inject(ProductService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _ToastrService = inject(ToastrService)

  productData:any;
  productSlug:any;

  productImages: { src: string; alt: string }[] = [];
  mainIndex = 0;

  get mainImage() {
    return this.productImages[this.mainIndex];
  }

  ngOnInit(): void {
    this.getProductBySlug();
    this.getMessageInstallment()
    this.insuranceTerms()
  }

  getProductBySlug(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        this.productSlug = params.get('slug');
        this._ProductService.getProductDetails(this.productSlug).subscribe({
          next: (res) => {
            this.productData = res;
            this.productImages = [
              { src: this.productData.picture1, alt: this.productData.picture1_alt },
              { src: this.productData.picture2, alt: this.productData.picture2_alt },
              { src: this.productData.picture3, alt: this.productData.picture3_alt },
              { src: this.productData.picture4, alt: this.productData.picture4_alt },
              { src: this.productData.picture5, alt: this.productData.picture5_alt },
            ].filter(img => img.src);

            this.mainIndex = 0;

            // autoplay every 3 seconds
            setInterval(() => {
              this.nextImage();
            }, 6000);
          },
        });

        this.getBanksInstallment(this.productSlug)

      },
    });
  }

  changeMain(index: number) {
    this.mainIndex = index;
  }
  nextImage() {
    this.mainIndex = (this.mainIndex + 1) % this.productImages.length;
  }
  prevImage() {
    this.mainIndex = (this.mainIndex - 1 + this.productImages.length) % this.productImages.length;
  }

  notify_checked = false;
  out_of_stock = true;
  userEmail:string = ''
  token = localStorage.getItem('token')

  notifyMe(event: Event) {
    let userEmail = localStorage.getItem('userEmail')
    const input = event.target as HTMLInputElement;
    this.notify_checked = input.checked;

    if (this.notify_checked) {
      let data = {
        product: this.productSlug,
        email: userEmail
      }
      if(this.token){
        this._ProductService.notify(data).subscribe({
          next:(res)=>{
            this._ToastrService.success('Notification registered')
          }
        });
      } else{
        let data = {
          product: this.productSlug,
          email: this.userEmail
        }
        this._ProductService.notify(data).subscribe({
          next:(res)=>{
            this._ToastrService.success('Notification registered')
          }
        });
      }
    }
  }

  quantity: number = 1; // القيمة الافتراضية
  increaseQuantity() {
    this.quantity += 1;
  }
  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }


  // حالة كل collapse
  openSection: 'fullPrice' | 'installments' | 'payLater' | 'preOrder' | null = null;
  banksInstallment: any = [];
  filtered_banks: any = [];

  toggleSection(section: 'fullPrice' | 'installments' | 'payLater' | 'preOrder') {
    if (this.openSection === section) {
      this.openSection = null; // اغلق اذا كان مفتوح
    } else {
      this.openSection = section; // افتح القسم الجديد
    }
  }

  installmentMsg:string = ''
  bank: any = 'cib';
  getMessageInstallment():void{
    this._ProductService.messageInstallment().subscribe({
      next:(res)=>{
        this.installmentMsg = res.message
      }
    })
  }

  insurance_terms:any
  insuranceTerms() {
    this._ProductService.insuranceTerms().subscribe({
      next:(res)=>{
        this.insurance_terms = res.data;
        console.log(this.insurance_terms);
      }
    })
  }

  getBanksInstallment(id:any):void {
    this._ProductService.installment(id).subscribe({
      next:(res)=>{
        this.banksInstallment = res;
        for (let index = 0; index < this.banksInstallment.length; index++) {
          const element = this.banksInstallment[index];
          this.filtered_banks.push(element.bank);
        }

        console.log(this.filtered_banks);


        this.filtered_banks = this.filtered_banks.filter(
          (tag:any, index:any, array:any) =>
            array.findIndex((t:any) => t.id == tag.id) == index
        );

        console.log(this.filtered_banks);


        for ( let banksInstallment_index = 0; banksInstallment_index < this.banksInstallment.length; banksInstallment_index++) {
          const banksInstallment_element = this.banksInstallment[banksInstallment_index];
          for ( let filtered_banks_index = 0; filtered_banks_index < this.filtered_banks.length; filtered_banks_index++ ) {
            const filtered_banks_element =
              this.filtered_banks[filtered_banks_index];
            if (
              banksInstallment_element.bank.id == filtered_banks_element.id
            ) {
              if (filtered_banks_element.months) {
                filtered_banks_element.months.push(banksInstallment_element);
              } else {
                filtered_banks_element.months = [banksInstallment_element];
              }
            }
          }
        }
      }
    });
  }


  install:any;
  interest: any = 0;
  down = 0;
  downPrice: any;
  oldDownPrice: any;
  payment_type: any;
  product_property_id: any;
  choosePaymentType(val:any) {
    this.install = null;
    this.bank = null;
    this.payment_type = val;
  }
  calculate(down:any, install:any, bank:any, interest:any) {
    this.install = install;
    this.interest = interest;
    if (down) {
      if (down.length == undefined) {
        down = '0';
      } else if (down.length == 0) {
        down = '0';
      }
    } else {
      down = '0';
    }
    if (this.product_property_id) {
      this._ProductService.getInstallments(this.product_property_id,install,down,bank,this.interest).subscribe(
          (res: any) => {
            this.downPrice = res.monthly_payment;
            /*
              if (this.product.old_price) {
                this.productDetailsPro.getInstallementWithPrice(bank, this.product.old_price, install, down, this.interest).subscribe((ress: any) => {
                  this.oldDownPrice = ress.monthly_payment;
                  this.spinner.hide();
                }, err => {
                  this.spinner.hide();
                });
              } else {
                this.spinner.hide();
              }
            */

          }
        );
    } else {
      this._ProductService.getAccInstallments(this.productData.id, install, down, bank, this.interest).subscribe(
          (res: any) => {
            this.downPrice = res.monthly_payment;

            /*
              // Remove this case of display installment price in case old price

              if (this.product.old_price) {
                this.productDetailsPro.getInstallementWithPrice(bank, this.product.old_price, install, down, this.interest).subscribe((ress: any) => {
                  this.oldDownPrice = ress.monthly_payment;
                  this.spinner.hide();
                }, err => {
                  this.spinner.hide();
                });
              } else {
                this.spinner.hide();
              }
            */
          }
        );
    }
  }

  addToCart():void{
    console.log('cart');

  }
}
