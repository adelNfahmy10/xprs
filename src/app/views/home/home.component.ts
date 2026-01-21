import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { Autoplay, EffectCreative, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';
import { SwiperDirective } from '@component/swiper-directive.component'
import { HomeService } from '@core/services/home/home.service';
import { RouterLink } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { propertyData } from '@views/property/data';
import { CartService } from '@core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  imports: [SwiperDirective, RouterLink, NgClass, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})

export class HomeComponent implements OnInit{
  private readonly _HomeService = inject(HomeService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _CartService = inject(CartService)

  propertyList = propertyData
  homeData:any = {}
  homeSlider:any[] = []
  brands:any[] = []
  specialEssentials:any = {}
  specialOffers:any = {}
  specialSelling:any = {}
  categories:any[] = []
  allFavoriteItems:any[] = []
  cart:any[] = []
  cartId = this._CartService.cartId

  ngOnInit(): void {
    this.getHomeData()
    this.getAllBrands()
    this.getAllCategories()
    this.getAllCart()
    const storedFav = localStorage.getItem('myFavProduct');
    if (storedFav) {
      this.allFavoriteItems = JSON.parse(storedFav);
    }
  }

  getHomeData():void{
    this._HomeService.getHomeData().subscribe({
      next:(res)=>{
        this.homeData = res
        this.homeSlider = res.slider
        this.specialOffers = res.specialsection1.SpecialOffer_content[0]
        this.specialEssentials = res.specialsection2.SpecialOffer_content[0]
        this.specialSelling = res.specialsection3.SpecialOffer_content[0]
      }
    })
  }

  getAllCategories():void{
    this._HomeService.getCategories().subscribe({
      next:(res)=>{
        this.categories = res
      }
    })
  }

  getAllBrands():void{
    this._HomeService.getBrands().subscribe({
      next:(res)=>{
        this.brands = res
      }
    })
  }

  // حفظ العناصر اللي عليها animation
  fadeItems: Set<number> = new Set();
  // للتحقق إذا العنصر موجود في المفضلة
  isFavorite(item: any): boolean {
    return this.allFavoriteItems.some(fav => fav.id === item.id);
  }
  // إضافة / إزالة من المفضلة
  addToFavorite(item: any): void {
    const index = this.allFavoriteItems.findIndex(fav => fav.id === item.id);

    if (index === -1) {
      // لو مش موجود أضفه
      this.allFavoriteItems.push(item);
      this._ToastrService.success('Product added to favorites successfully');
      // تشغيل animation
      this.fadeItems.add(item.id);
      setTimeout(() => this.fadeItems.delete(item.id), 1000); // مدة الfade CSS

    } else {
      // لو موجود، ممكن نعمل toggle ونحذفه (اختياري)
      this.allFavoriteItems.splice(index, 1);
      this._ToastrService.warning('Product removed from favorites successfully');
    }

    // تحديث localStorage
    localStorage.setItem('myFavProduct', JSON.stringify(this.allFavoriteItems));
  }
  showFadeAnimation(item: any): boolean {
    return this.fadeItems.has(item.id);
  }

  isCart(item: any): boolean {
    return this.cart.some(
      cartItem => cartItem.product?.id === item.id
    );
  }

  addToCart(item:any):void{
    const cartItem = this.getCartItem(item);

    // 🟥 لو موجود → احذف
    if (cartItem) {
      this._CartService.deleteCart(cartItem.id).subscribe({
        next: (res) => {
          this.getAllCart();
          this._ToastrService.warning('Product removed from cart successfully');
        }
      });
      return;
    }

    const data = {
      product: item.id,
      cart: this.cartId() == '0' ? +this.cartId()! : this.cartId(),
      quantity: item.quantity || 1,
      product_property: null,
      card: null,
      branded_page_product: null,
      insurance: null
    };

    this._CartService.addCartProduct(data).subscribe({
      next: () => {
        this.getAllCart();
        this._ToastrService.success('Product added to cart successfully');
      }
    });
  }

  getCartItem(item: any) {
    return this.cart.find(
      cartItem => cartItem.product?.id === item.id
    );
  }

  getAllCart():void{
    if(this.cartId()){
      this._CartService.getCart(this.cartId()).subscribe({
        next:(res)=>{
          this.cart = res?.cartproduct || [];
          this._CartService.cartCount.set(res.cartproduct.length)
          this._CartService.cartProducts.set(res.cartproduct)
        }
      })
    }
  }

  // Home Silder Config
  swiperCreativeEffect: SwiperOptions = {
    modules: [Autoplay, Pagination, EffectCreative, Navigation],
    loop: true,
    // grabCursor: true,
    effect: 'creative',
    creativeEffect: {
      prev: {
        shadow: true,
        translate: [0, 0, -400],
      },
      next: {
        translate: ['100%', 0, 0],
      },
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    pagination: {
      el: '#creative-pagination',
      clickable: true,
    },

    navigation: {
      nextEl: '.creative-next',
      prevEl: '.creative-prev',
    },

  }

  // Categories Silder Config
  swiperPaginationCategory: SwiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    loop: true,

    slidesPerView: 6,
    spaceBetween: 15,

    speed:600,
    grabCursor: true,

    breakpoints: {
      0: {
        slidesPerView: 2,
      },
      567: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 4,
      },
      1200: {
        slidesPerView: 6,
      },
    },

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    pagination: {
      clickable: true,
      el: '#category-pagination',
    },

    navigation: {
      nextEl: '.category-next',
      prevEl: '.category-prev',
    },
  }

  // Brands Silder Config
  swiperPaginationBrands: SwiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    loop: true,

    slidesPerView: 8,
    spaceBetween: 10,

    speed:600,
    grabCursor: true,

    breakpoints: {
      0: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 6,
      },
      1200: {
        slidesPerView: 8,
      },
    },

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    pagination: {
      clickable: true,
      el: '#brand-pagination',
    },
    navigation: {
      nextEl: '.brand-next',
      prevEl: '.brand-prev',
    },
  }

  // Special Offers Silder Config
  swiperPaginationOffers: SwiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    loop: true,

    slidesPerView: 8,
    spaceBetween: 10,

    speed:600,
    grabCursor: true,

    breakpoints: {
      0: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 5,
      },
    },

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    pagination: {
      clickable: true,
      el: '#offer-pagination',
    },
    navigation: {
      nextEl: '.offer-next',
      prevEl: '.offer-prev',
    },
  }

  // Special Essentials Silder Config
  swiperPaginationEssentials: SwiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    loop: true,

    slidesPerView: 8,
    spaceBetween: 10,

    speed:600,
    grabCursor: true,

    breakpoints: {
      0: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 5,
      },
    },

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    pagination: {
      clickable: true,
      el: '#essentials-pagination',
    },
    navigation: {
      nextEl: '.essentials-next',
      prevEl: '.essentials-prev',
    },
  }

}
