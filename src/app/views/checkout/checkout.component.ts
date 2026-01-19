import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive';
import { CartService } from '@core/services/cart/cart.service';
import { CheckoutService } from '@core/services/checkout/checkout.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, SelectFormInputDirective, ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit{
  private readonly _CartService = inject(CartService)
  private readonly _CheckoutService = inject(CheckoutService)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _Router = inject(Router)

  cities: string[] = [
    "10Th Of Ramadan City", "15 Of May City", "Abasya", "Abo Rawash", "ABOU SOMBO",
    "Abu Zaabal", "Agouza", "Ain Shams", "Al Arish", "Al Haram", "Al Mahala", "Al Marg", "Al Matarya",
    "Al Menofiah", "Al Monib", "Al Nobariah", "Al Obour City", "AL Qanater", "Al Shorouk", "Al Tour City",
    "Al Wahat", "Al Waraq", "Alex Desert Rd.", "Alexandria", "Assiut", "Aswan", "Atfeah", "Attaba", "Awaied-Ras Souda",
    "Badr City", "Badrashin", "Bahtem", "Bani Swif", "Bargiel", "Beigam", "Belbis", "Belqas",
    "Benha ", "Berkeit Sabb", "Bolak El Dakrour", "Borg Al Arab City", "Cairo Suez Desert Rd",
    "Cornish El Nile", "Dahab City", "Dahshour", "Damanhour", "Dar El Salam", "Desouk", "Dokki ", "Down Town", "Dumiatta",
    "Ein Al Sukhna", "El Ayat", "EL GOUNA", "El Hawamdiah", "EL Korimat", "El Maadi", "El Marg", "El Qantara Sharq",
    "EL rehab", "El Saf", "El Salam City", "EL SAWAH", "El Wadi El Gadid", "El Zeitoun", "Fayid",
    "Fayoum", "Garden City", "Ghamrah", "Giza", "Hadayek El Qobah", "Heliopolis", "Helwan", "High Dam",
    "Hurghada", "Imbaba", "Inshas", "Ismailia", "Kafr Al Sheikh", "Kaha ", "Kasr El Einy", "Katamiah",
    "Khanka", "Luxour", "Maadi", "Madinaty", "Manial El Rodah", "Mansheyt Naser", "Mansoura", "Marabella",
    "Maraqia", "Marinah", "Marsa Alam", "Marsa Matrouh", "Meet Ghamr", "Menia City", "Mohandiseen", "Mokattam",
    "Moustorod", "Nag Hamadi", "Nasr City", "New Cairo", "New Capital City", "New Salhia", "Nuwibaa", "October City",
    "Omranya", "Port Said", "Qalioub", "Qaliubia", "Qena", "Quesna", "Rafah", "Ramsis", "RAS GHAREB",
    "Ras Seidr", "Ras Shoqeir", "Sadat City", "Safaga", "Saqara", "Sedi Kreir", "Sharm El Sheikh", "Shebin El Koum",
    "Shubra", "Shubra El Kheima", "Siwa", "sohag City", "Suez", "Taba City", "Tanta", "Tebin", "Torah", "Toshka", "Wadi El Natroun", "Zakazik", "Zamalek"
  ];
  hearAboutUs:string[] = [
    "WhatsApp",
    "Facebook",
    "instgram",
    "Tiktok",
    "Call Center",
    "Live chat",
    "Website"
  ]
  token = this._CartService.token
  cartProducts = this._CartService.cartProducts
  cartCount = this._CartService.cartCount
  subTotal = this._CartService.subTotal
  shippingValue = this._CheckoutService.shippingValue
  cartId = this._CartService.cartId
  step:number = 1

  ngOnInit(): void {
    this.getAllCart()
    this.hiddingPaymentMethod()
    this.getUserInfo()
  }

  getAllCart():void{
    if(this.cartId){
      this._CartService.getCart(this.cartId()).subscribe({
        next:(res)=>{
          this._CartService.cartCount.set(res.cartproduct.length)
          this._CartService.cartProducts.set(res.cartproduct)
          this._CartService.subTotal.set(res.total)
        }
      })
    }
  }

  payments_arr = [
    { code: 1, is_allowed: true, name: "Cash on delivery", image: 'assets/imgs/icons/cash.png' },
    { code: 206, is_allowed: true, name: "Banque Misr, CIB and NBE 24 months (Payment Link will be sent via SMS)", image: 'assets/imgs/Paymob logo.png' },
    { code: 0, is_allowed: true, name: "Credit Card on delivery", image: 'assets/imgs/icons/cdel.png' },
    { code: 2, is_allowed: true, name: "Online Payment", image: 'assets/imgs/icons/visa.png' },

    { code: 5, is_allowed: true, name: '6 months', month_name: '6 months' },
    { code: 5, is_allowed: true, name: "NBE Installment", image: 'assets/imgs/icons/BanksLogos-07.png' },
    { code: 50, is_allowed: true, name: '12 months', month_name: '12 months' },
    { code: 51, is_allowed: true, name: '18 months', month_name: '18 months' },
    { code: 71, is_allowed: true, name: '36 months', month_name: '36 months' },

    { code: 40, is_allowed: true, name: '6 months', month_name: '6 months' },
    { code: 40, is_allowed: true, name: "Mashreq Installment", image: 'assets/imgs/icons/mashrq.png' },
    { code: 54, is_allowed: true, name: '12 months', month_name: '12 months' },
    { code: 55, is_allowed: true, name: '18 months', month_name: '18 months' },

    { code: 41, is_allowed: true, name: '6 months', month_name: '6 months' },
    { code: 41, is_allowed: true, name: "CIB Installment", image: 'assets/imgs/icons/cib.png' },
    { code: 52, is_allowed: true, name: '12 months', month_name: '12 months' },
    { code: 53, is_allowed: true, name: '18 months', month_name: '18 months' },
    { code: 70, is_allowed: true, name: '36 months', month_name: '36 months' },

    { code: 42, is_allowed: true, name: '6 months', month_name: '6 months' },
    { code: 42, is_allowed: true, name: "MISR Installment", image: 'assets/imgs/icons/misr.png' },
    { code: 60, is_allowed: true, name: '12 months', month_name: '12 months' },
    { code: 61, is_allowed: true, name: '18 months', month_name: '18 months' },

    { code: 43, is_allowed: true, name: '6 months', month_name: '6 months' },
    { code: 43, is_allowed: true, name: "Banque du cairo Installment", image: 'assets/imgs/icons/cairo.png' },
    { code: 58, is_allowed: true, name: '12 months', month_name: '12 months' },

    { code: 44, is_allowed: true, name: '6 months', month_name: '6 months' },
    { code: 44, is_allowed: true, name: "Audi Installment", image: 'assets/imgs/icons/audi.png' },
    { code: 56, is_allowed: true, name: '12 months', month_name: '12 months' },
    { code: 57, is_allowed: true, name: '18 months', month_name: '18 months' },
    // { code: 206, is_allowed: true, name: "valU 6m 0% interest 0% downpaymet (Payment Link will be sent via SMS)", image: 'assets/imgs/icons/BanksLogos-05.png' },
    { code: 100, is_allowed: true, name: "valU", image: 'assets/imgs/icons/BanksLogos-05.png' },
    { code: 101, is_allowed: true, name: "FawryPay", image: "assets/imgs/icons/fawry_logo.jpg" },
    { code: 200, is_allowed: true, name: "PremiumCard", image: 'assets/imgs/icons/BanksLogos-09.png' },
    { code: 201, is_allowed: true, name: "Orange", image: 'assets/imgs/icons/orange.png' },
    { code: 202, is_allowed: true, name: "Contact Shopping", image: 'assets/imgs/icons/contact_shopping.png' },
    { code: 203, is_allowed: true, name: "Souhoola", image: 'assets/imgs/icons/souhoola.png' },
    { code: 204, is_allowed: true, name: "Sympl", image: 'assets/imgs/icons/sympl.png' },
    { code: 211, is_allowed: true, name: "Shahry", image: 'assets/imgs/icons/Shahry-Egypt-61447-1613559116-1.png' },
    { code: 213, is_allowed: true, name: "Forsa", image: 'assets/imgs/icons/forsa-logo-05.png' },
    { code: 215, is_allowed: true, name: "Vodafone", image: 'assets/imgs/icons/vodafone_cash.jpeg' }
  ];
  payments_arr_avail: any[] = [];
  months_nbe_arr: any[] = [];
  months_mashreq_arr: any[] = [];
  months_cib_arr: any[] = [];
  months_misr_arr: any[] = [];
  months_cairo_arr: any[] = [];
  months_audi_arr: any[] = [];
  cashOnDlivery: any[] = [];

  readonly BANK_MONTHS_MAP: Record<string, number[]> = {
    nbe: [5, 50, 51, 71],
    mashreq: [40, 54, 55],
    cib: [41, 52, 53, 70],
    misr: [42, 60, 61],
    cairo: [43, 58],
    audi: [44, 56, 57],
  };

  private pushUnique(arr: any[], item: any) {
    if (!arr.some(el => el.code === item.code)) {
      arr.push(item);
    }
  }

  private addToBankArray(code: number, payment: any) {
    if (this.BANK_MONTHS_MAP['nbe'].includes(code)) {
      this.pushUnique(this.months_nbe_arr, payment);
    }

    if (this.BANK_MONTHS_MAP['mashreq'].includes(code)) {
      this.pushUnique(this.months_mashreq_arr, payment);
    }

    if (this.BANK_MONTHS_MAP['cib'].includes(code)) {
      this.pushUnique(this.months_cib_arr, payment);
    }

    if (this.BANK_MONTHS_MAP['misr'].includes(code)) {
      this.pushUnique(this.months_misr_arr, payment);
    }

    if (this.BANK_MONTHS_MAP['cairo'].includes(code)) {
      this.pushUnique(this.months_cairo_arr, payment);
    }

    if (this.BANK_MONTHS_MAP['audi'].includes(code)) {
      this.pushUnique(this.months_audi_arr, payment);
    }
  }

  // hidding pament method end-point
  hiddingPaymentMethod() {
    this._CheckoutService.hiddingPayment().subscribe((res: any[]) => {
      if (!res?.length) return;

      /** 1️⃣ Remove hidden methods */
      let visiblePayments = [...this.payments_arr];
      res.forEach(hidden =>
        visiblePayments = visiblePayments.filter(p => p.code !== +hidden.code)
      );

      /** 2️⃣ Loop cart products */
      this.cartProducts().forEach(cartItem => {
        if (!cartItem?.product?.payment_methods?.length) return;

        cartItem.product.payment_methods.forEach((productMethod: any) => {

          visiblePayments.forEach(payment => {
            if (+payment.code !== +productMethod.code) return;
            if (!payment.is_allowed) return;

            /** sync is_allowed */
            payment.is_allowed = productMethod.is_allowed;
            if (!payment.is_allowed) return;

            /** banks months */
            this.addToBankArray(payment.code, payment);

            /** Cash On Delivery */
            if (payment.code === 1) {
              this.pushUnique(this.cashOnDlivery, payment);
            }
          });

        });
      });

      /** 3️⃣ Final available payments */
      this.payments_arr_avail = visiblePayments.filter(p => p.is_allowed);
    });
  }

  nextStep(step:any):void{
    this.step = step
  }

  showBilingAddress:boolean = true
  toggleBilingAddress():void{
    this.showBilingAddress = !this.showBilingAddress
    console.log(this.showBilingAddress);

    if (!this.showBilingAddress) {
      this.checkoutForm.patchValue({
        _billing_address: this.checkoutForm.get('_address')?.value,
        _biling_city: this.checkoutForm.get('_city')?.value
      });
    }
  }

  promoCode:string | number = ''
  paymentMethod:any = {}

  getUserInfo():void{
    this._CheckoutService.getInfo(this.token()).subscribe({
      next:(res)=>{
        console.log(res);
      }
    })
  }

  checkoutForm:FormGroup = this._FormBuilder.group({
    wafer_cookies: [''],
    wasla_cookies: [''],
    cart: [''],
    code: [''],
    _name: [''],
    _email: [''],
    _phone: [''],
    promotion: [''],
    _address: [''],
    _city: [''],
    _billing_address: [''],
    _biling_city:[''],
    hear: [''],
    payment_method: [''],
    preorder_branch: [''],
    from_mobile: false,
    R2P: false,
    QR_code: false,
    orange_account_number: ['']
  })

  submitCheckout():void{
    let data = this.checkoutForm.value
    data.cart = this.cartId()
    data.code = this.promoCode
    data.hear = ''
    this.paymentMethod = data.payment_method

    this._CheckoutService.addOrder(data).subscribe({
      next:(res)=>{
        localStorage.setItem('order_id', res.order.id);
        if (this.paymentMethod == 0 || this.paymentMethod == 1 || this.paymentMethod == 206) {
          if (this.paymentMethod == 206) {
            this._ToastrService.success('One of our team will contact you shortly')
            console.log('One of our team will contact you shortly');
          } else {
            this._ToastrService.success('Order placed successfully!')
            console.log('Order placed successfully!');
          }

          const token = localStorage.getItem('xprsToken');
          if (token) {
            this._Router.navigate(['/profile/orders']);
          } else {
            this._Router.navigate(['/home']);
          }
          this.getAllCart()
        }
      }
    })
  }

}
