import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { Autoplay, EffectCreative, EffectFade, Navigation, Pagination } from 'swiper/modules';
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
  specialEssentials:any = {}
  specialOffers:any = {}
  specialSelling:any = {}
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
        this.specialOffers = res.specialsection1.SpecialOffer_content[0]
        this.specialEssentials = res.specialsection2.SpecialOffer_content[0]
        this.specialSelling = res.specialsection3.SpecialOffer_content[0]
        console.log(this.specialSelling);
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

  // Home Silder Config
  swiperfadeEffect: SwiperOptions = {
    modules: [Pagination, Autoplay, EffectFade],
    loop: true,
    effect: 'fade',
    speed: 1200,

    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    pagination: {
      clickable: true,
      el: '#effect-pagination',
    },
  };

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

  // Special Essentials Silder Config
  swiperPaginationEssentials: SwiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    loop: true,

    slidesPerView: 5,
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
