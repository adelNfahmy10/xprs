import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { Autoplay, EffectCreative, Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';
import { SwiperDirective } from '@component/swiper-directive.component'
import { HomeService } from '@core/services/home/home.service';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { propertyData } from '@views/property/data';

@Component({
  selector: 'app-home',
  imports: [SwiperDirective, RouterLink, NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})

export class HomeComponent implements OnInit{
  private readonly _HomeService = inject(HomeService)
  propertyList = propertyData
  homeData:any = {}
  homeSlider:any[] = []
  brands:any[] = []
  specialOffer:any = {}
  categories:any[] = []

  ngOnInit(): void {
    this.getHomeData()
    this.getAllBrands()
    this.getAllCategories()
  }

  getHomeData():void{
    this._HomeService.getHomeData().subscribe({
      next:(res)=>{
        this.homeData = res
        this.homeSlider = res.slider
        this.specialOffer = res.specialsection2.SpecialOffer_content[0]
        console.log('Offers : ', this.specialOffer);

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

  // Home Silder Config
  swiperCreativeEffect: SwiperOptions = {
    modules: [Autoplay, Pagination, EffectCreative],
    loop: true,
    grabCursor: true,
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
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '#creative-pagination',
      clickable: true,
    },
  }

  // Categories Silder Config
  swiperPagination: SwiperOptions = {
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
      768: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 6,
      },
    },

    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    pagination: {
      clickable: true,
      el: '#basic-pagination',
    },
    navigation: {
      nextEl: '.basic-next',
      prevEl: '.basic-prev',
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
        slidesPerView: 4,
      },
      768: {
        slidesPerView: 4,
      },
      1200: {
        slidesPerView: 8,
      },
    },

    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    pagination: {
      clickable: true,
      el: '#basic-pagination',
    },
    navigation: {
      nextEl: '.basic-next',
      prevEl: '.basic-prev',
    },
  }

  // Special Offer Silder Config
  swiperPaginationOffer: SwiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    loop: true,

    slidesPerView: 4,
    spaceBetween: 20,

    speed:600,
    grabCursor: true,

    breakpoints: {
      0: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 4,
      },
    },

    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    pagination: {
      clickable: true,
      el: '#basic-pagination',
    },
    navigation: {
      nextEl: '.basic-next',
      prevEl: '.basic-prev',
    },
  }

}
