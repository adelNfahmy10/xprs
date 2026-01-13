import { CommonModule } from '@angular/common'
import { Component, inject, type OnInit } from '@angular/core'
import { MENU_ITEMS, type MenuItemType } from '@common/menu-meta'
import { SimplebarAngularModule } from 'simplebar-angular'
import { NgbCollapseModule, type NgbCollapse } from '@ng-bootstrap/ng-bootstrap'
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router'
import { basePath } from '@common/constants'
import { Store } from '@ngrx/store'
import { findAllParent, findMenuItem } from '@core/helper/utils'
import { LogoBoxComponent } from '@component/logo-box.component'
import { changesidebarsize } from '@store/layout/layout-action'
import { getSidebarsize } from '@store/layout/layout-selector'
import { CategoryService } from '@core/services/category/category.service'

@Component({
    selector: 'app-sidebar',
    imports: [
        SimplebarAngularModule,
        CommonModule,
        NgbCollapseModule,
        RouterModule,
        LogoBoxComponent,
    ],
    templateUrl: './sidebar.component.html',
    styles: ``
})
export class SidebarComponent implements OnInit {
  private readonly _CategoryService = inject(CategoryService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)

  allCategories:any[] = []
  categoryId:string | null = null
  subCategoryId:string | null = null
  menuItems: MenuItemType[] = []
  activeMenuItems: string[] = []

  router = inject(Router)
  trimmedURL = this.router.url?.replaceAll(
    basePath !== '' ? basePath + '/' : '',
    '/'
  )

  store = inject(Store)

  constructor() {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.trimmedURL = this.router.url?.replaceAll(
          basePath !== '' ? basePath + '/' : '',
          '/'
        )
        this._activateMenu()
        setTimeout(() => {
          this.scrollToActive()
        }, 200)
      }
    })
  }

  ngOnInit(): void {
    this.initMenu()
    this.getAllCategories()
  }

  getAllCategories():void{
    this._CategoryService.getAllCategories().subscribe({
      next:(res)=>{
        this.allCategories = res
        this.buildMenuFromCategories()
      }
    })
  }

  buildMenuFromCategories(): void {
    this.menuItems = [
      {
        key: 'menu',
        label: 'MENU',
        isTitle: true,
      },
      ...this.allCategories.map(cat => {
        const hasSub = cat.cat_subcategories && cat.cat_subcategories.length > 0;

        if (hasSub) {
          // لو فيها subcategories
          return {
            key: cat.seo_slug,
            label: cat.name,
            icon: 'ri-product-hunt-line',
            collapsed: true,
            children: cat.cat_subcategories.map((sub: any) => ({
              key: sub.seo_slug,
              label: sub.name,
              url: `/category/${cat.id}/${sub.id}`,
              parentKey: cat.seo_slug,
            })),
          };
        } else {
          // لو مفيهاش subcategories
          return {
            key: cat.seo_slug,
            label: cat.name,
            icon: cat.icon || 'ri-product-hunt-line',
            url: `/category/${cat.id}`, // URL مباشر للـ Category
          };
        }
      }),
    ];

  }

  initMenu(): void {
    this.menuItems =  JSON.parse(JSON.stringify(MENU_ITEMS))
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this._activateMenu()
    })
    setTimeout(() => {
      this.scrollToActive()
    }, 200)
  }

  hasSubmenu(menu: MenuItemType): boolean {
    return menu.children ? true : false
  }

  scrollToActive(): void {
    const activatedItem = document.querySelector('.nav-item li a.active')
    if (activatedItem) {
      const simplebarContent = document.querySelector(
        '.main-nav .simplebar-content-wrapper'
      )
      if (simplebarContent) {
        const activatedItemRect = activatedItem.getBoundingClientRect()
        const simplebarContentRect = simplebarContent.getBoundingClientRect()
        const activatedItemOffsetTop =
          activatedItemRect.top + simplebarContent.scrollTop
        const centerOffset =
          activatedItemOffsetTop -
          simplebarContentRect.top -
          simplebarContent.clientHeight / 2 +
          activatedItemRect.height / 2
        this.scrollTo(simplebarContent, centerOffset, 600)
      }
    }
  }

  easeInOutQuad(t: number, b: number, c: number, d: number): number {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  }

  scrollTo(element: Element, to: number, duration: number): void {
    const start = element.scrollTop
    const change = to - start
    const increment = 20
    let currentTime = 0

    const animateScroll = () => {
      currentTime += increment
      const val = this.easeInOutQuad(currentTime, start, change, duration)
      element.scrollTop = val
      if (currentTime < duration) {
        setTimeout(animateScroll, increment)
      }
    }
    animateScroll()
  }

  _activateMenu(): void {
    const div = document.querySelector('.navbar-nav')

    let matchingMenuItem = null

    if (div) {
      let items: any = div.getElementsByClassName('nav-link-ref')
      for (let i = 0; i < items.length; ++i) {
        if (
          this.trimmedURL === items[i].pathname ||
          (this.trimmedURL.startsWith('/invoice/') &&
            items[i].pathname === '/invoice/RB6985') ||
          (this.trimmedURL.startsWith('/ecommerce/product/') &&
            items[i].pathname === '/ecommerce/product/1')
        ) {
          matchingMenuItem = items[i]
          break
        }
      }

      if (matchingMenuItem) {
        const mid = matchingMenuItem.getAttribute('aria-controls')
        const activeMt = findMenuItem(this.menuItems, mid)

        if (activeMt) {
          const matchingObjs = [
            activeMt['key'],
            ...findAllParent(this.menuItems, activeMt),
          ]

          this.activeMenuItems = matchingObjs
          this.menuItems.forEach((menu: MenuItemType) => {
            menu.collapsed = !matchingObjs.includes(menu.key!)
          })
        }
      }
    }
  }

  /**
   * toggles open menu
   * @param menuItem clicked menuitem
   * @param collapse collpase instance
   */
  toggleMenuItem(menuItem: MenuItemType, collapse: NgbCollapse): void {
    collapse.toggle()
    let openMenuItems: string[]
    if (!menuItem.collapsed) {
      openMenuItems = [
        menuItem['key'],
        ...findAllParent(this.menuItems, menuItem),
      ]
      this.menuItems.forEach((menu: MenuItemType) => {
        if (!openMenuItems.includes(menu.key!)) {
          menu.collapsed = true
        }
      })
    }
  }

  changeMenuSize() {
    let size = document.documentElement.getAttribute('data-menu-size')
    if (size == 'sm-hover') {
      size = 'sm-hover-active'
    } else {
      size = 'sm-hover'
    }
    this.store.dispatch(changesidebarsize({ size }))
    this.store.select(getSidebarsize).subscribe((size) => {
      document.documentElement.setAttribute('data-menu-size', size)
    })
  }
}
