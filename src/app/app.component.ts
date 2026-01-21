import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal, ViewChild, WritableSignal, type OnInit } from '@angular/core'
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
  type Event,
} from '@angular/router'
import { TitleService } from '@core/services/title.service'
import { NgwWowService } from 'ngx-wow'
import {
  NgProgressComponent,
  NgProgressModule,
  type NgProgressRef,
} from 'ngx-progressbar'
import { NgxSpinnerComponent } from 'ngx-spinner'
import { CartService } from '@core/services/cart/cart.service'


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NgProgressModule, NgxSpinnerComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit{
  private readonly _CartService = inject(CartService)

  progressRef!: NgProgressRef
  @ViewChild(NgProgressComponent) progressBar!: NgProgressComponent

  private titleService = inject(TitleService)
  private router = inject(Router)
  private _NgxWowService = inject(NgwWowService)

  token = this._CartService.token
  cartId = this._CartService.cartId


  constructor() {
    this.router.events.subscribe((event: Event) => {
      this.checkRouteChange(event)
    })
    this._NgxWowService.init()
  }

  ngOnInit(): void {
    this.titleService.init()
    if(!this.cartId() && !this.token()){
      this.addCart()
    }
  }

  addCart():void{
    this._CartService.addCart().subscribe({
      next:(res)=>{
        if(!this.token()){
          localStorage.setItem('xprsCartId', res.id)
        }
      }
    })
  }

  checkRouteChange(routerEvent: Event) {
    if (routerEvent instanceof NavigationStart) {
      this.progressBar.start()
    }
    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      setTimeout(() => {
        this.progressBar.complete()
      }, 200)
    }
  }
}
