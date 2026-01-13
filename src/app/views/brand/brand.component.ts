import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SwiperDirective } from '@component/swiper-directive.component';
import { CategoryService } from '@core/services/category/category.service';
import { HomeService } from '@core/services/home/home.service';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-brand',
  imports: [FormsModule, RouterLink, SwiperDirective],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class BrandComponent {
  private readonly _HomeService = inject(HomeService)

  allBrands:any[] = []
  filteredBrands: any[] = []
  searchCate: string = ''

  ngOnInit(): void {
    this.getAllBrands()
  }

  getAllBrands():void{
    this._HomeService.getBrands().subscribe({
      next:(res)=>{
        this.allBrands = res
        this.filteredBrands = res
      }
    })
  }

  filterBrands(): void {
    const search = this.searchCate.toLowerCase().trim()

    if (!search) {
      this.filteredBrands = this.allBrands
      return
    }

    this.filteredBrands = this.allBrands.filter(cat =>
      cat.name.toLowerCase().includes(search)
    )
  }


  // Brands Silder Config
  swiperPaginationBrands: SwiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    loop: true,

    slidesPerView: 6,
    spaceBetween: 5,

    speed:600,

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
