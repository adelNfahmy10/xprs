import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { SwiperDirective } from '@component/swiper-directive.component';
import { CategoryService } from '@core/services/category/category.service';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';
import { FormsModule } from "@angular/forms";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop',
  imports: [SwiperDirective, FormsModule, RouterLink],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ShopComponent implements OnInit{
  private readonly _CategoryService = inject(CategoryService)

  allCategories:any[] = []
  filteredCategories: any[] = []
  searchCate: string = ''

  ngOnInit(): void {
    this.getAllCategories()
  }

  getAllCategories():void{
    this._CategoryService.getAllCategories().subscribe({
      next:(res)=>{
        this.allCategories = res
        this.filteredCategories = res // البداية بدون فلترة
      }
    })
  }

  filterCategories(): void {
    const search = this.searchCate.toLowerCase().trim()

    if (!search) {
      this.filteredCategories = this.allCategories
      return
    }

    this.filteredCategories = this.allCategories.filter(cat =>
      cat.name.toLowerCase().includes(search)
    )
  }


  // Categories Silder Config
  swiperPaginationCategories: SwiperOptions = {
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
