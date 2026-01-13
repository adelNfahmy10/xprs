import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Inject,
  inject,
  OnInit,
  Output,
} from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { changetheme } from '@store/layout/layout-action'
import { getLayoutColor } from '@store/layout/layout-selector'
import { SimplebarAngularModule } from 'simplebar-angular'
import { notificationsData } from './data'
import { DOCUMENT } from '@angular/common'
import { logout } from '@store/authentication/authentication.actions'
import { FormsModule } from '@angular/forms'
import { CategoryService } from '@core/services/category/category.service'
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs'

type FullScreenTypes = {
  requestFullscreen?: () => Promise<void>
  mozRequestFullScreen?: () => Promise<void>
  mozCancelFullScreen?: () => Promise<void>
  msExitFullscreen?: () => Promise<void>
  webkitExitFullscreen?: () => Promise<void>
  mozFullScreenElement?: Element
  msFullscreenElement?: Element
  webkitFullscreenElement?: Element
  msRequestFullscreen?: () => Promise<void>
  mozRequestFullscreen?: () => Promise<void>
  webkitRequestFullscreen?: () => Promise<void>
}

@Component({
    selector: 'app-topbar',
    imports: [SimplebarAngularModule, NgbDropdownModule, FormsModule, RouterLink],
    templateUrl: './topbar.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TopbarComponent{
  private readonly _CategoryService = inject(CategoryService)
  private readonly _Router = inject(Router)

  searchItem: string = '';
  searchResults: any[] = [];

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {

  this.searchSubject
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(value =>
        this._CategoryService.getProducts(
          value,
          [], [], [], [], [], [], '',
          '-id',
          9,
          1,
          '0',
          '10000',
          '', '', '', '', '', '', '', '', '', '', ''
        )
      ),
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (res) => {
        this.searchResults = res.results;
      }
    });
  }

  onSearchChange(): void {
    const value = this.searchItem.trim();

    if (!value) {
      this.searchResults = [];
      return;
    }

    this.searchSubject.next(value);
  }

  getSearchResult():void{
    this._CategoryService.getProducts(
      this.searchItem, // search
      [], // categories
      [], // subcategories
      [], // brands
      [], // graphicscard
      [], // processors
      [], // ram
      '', // storage
      '-id', // sort
      9, // page_size
      1, // page
      '0', // price_low
      '10000', // price_heigh
      '', // top_offer
      '', // trending
      '', // top_selling
      '', // quickly_30
      '', // magazine
      '', // black_friday
      '', // just_arrived
      '', // specialoffer1
      '', // specialoffer2
      '', // specialoffer3
      ''  // shoppingcategory_id
    ).subscribe({
      next:(res)=>{
        this.searchResults = res.results
      }
    })
  }

  goToProduct(itemId:any):void{
    this._Router.navigate(['/product/' + itemId])
    this.searchResults = []
    this.searchItem = ''
  }

  closeSearch():void{
    this.searchResults = []
    this.searchItem = ''
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  notificationList = notificationsData
  element!: FullScreenTypes

  @Output() settingsButtonClicked = new EventEmitter()
  @Output() mobileMenuButtonClicked = new EventEmitter()

  router = inject(Router)
  store = inject(Store)

  constructor(@Inject(DOCUMENT) private document: Document & FullScreenTypes) {
    this.element = this.document.documentElement as FullScreenTypes
  }

  settingMenu() {
    this.settingsButtonClicked.emit()
  }

  toggleMobileMenu() {
    this.mobileMenuButtonClicked.emit()
  }

  changeTheme() {
    const color = document.documentElement.getAttribute('data-bs-theme')
    if (color == 'light') {
      this.store.dispatch(changetheme({ color: 'dark' }))
    } else {
      this.store.dispatch(changetheme({ color: 'light' }))
    }
    this.store.select(getLayoutColor).subscribe((color) => {
      document.documentElement.setAttribute('data-bs-theme', color)
    })
  }

  fullscreen() {
    document.body.classList.toggle('fullscreen-enable')
    if (
      !document.fullscreenElement &&
      !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen()
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen()
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen()
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen()
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen()
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen()
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen()
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen()
      }
    }
  }

  logout() {
    this.store.dispatch(logout())
  }
}
