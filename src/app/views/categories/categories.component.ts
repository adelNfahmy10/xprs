import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NouisliderComponent } from "ng2-nouislider";
import { NgbCollapseModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CategoryService } from '@core/services/category/category.service';
import { ActivatedRoute } from '@angular/router';
import Choices from 'choices.js';

@Component({
  selector: 'app-categories',
  imports: [NouisliderComponent, FormsModule, CommonModule, NgbPaginationModule, NgbCollapseModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit{
  private readonly _CategoryService = inject(CategoryService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)

  productsCategory:any;
  catergoryBrands:any[] = []
  categoriesProduct:any[] = []
  ramsProduct:any[] = []
  storageProduct:any[] = []
  processorsProduct:any[] = []
  graphicsCardsproduct:any[] = []
  categoryId!: string;
  totalProducts = 0;
  page = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.getAllProductsCategory()
  }

  choicesInstance!: Choices;
  isCollapsedCategories = false
  isCollapsedRams = false
  isCollapsedStorage = false
  isCollapsedProcessors = false
  isCollapsedGraphics = false

  selectedCategories: string[] = [];
  selectedSubCategories: string[] = [];
  selectedBrands: string[] = [];
  selectedRams: string[] = [];
  selectedStorage: string[] = [];
  selectedProcessors: string[] = [];
  selectedGraphics: string[] = [];
  someRange = [6000, 100000]
  rangeConfig = {
    start: [6000, 100000],
    step: 1,
    margin: 0,
    connect: true,
    behaviour: 'tap-drag',
    range: {
      min: 0,
      max: 120000,
    },
  }

  getAllProductsCategory(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (param) => {
        this.categoryId = param.get('id')!;

        this._CategoryService.getProductsCategory('',[this.categoryId],[],'-id',this.pageSize, this.page).subscribe({
          next: (res) => {
            this.productsCategory = res.results;
            this.catergoryBrands = res.related_brands;
            this.categoriesProduct = res.releated_categoreis;
            this.ramsProduct = res.related_Rams;
            this.storageProduct = res.related_storages;
            this.processorsProduct = res.related_Processors;
            this.graphicsCardsproduct = res.related_GraphicsCards;
            this.totalProducts = res.count

            setTimeout(() => {
              const element = document.getElementById('choices-multiple-remove-button') as HTMLSelectElement;

              if (!element) return;

              if (this.choicesInstance) {
                this.choicesInstance.destroy();
              }

              this.choicesInstance = new Choices(element, {
                searchEnabled: false,
                removeItemButton: true,
                placeholder: true,
                placeholderValue: 'Select Brands'
              });
            });
          }
        });
      }
    });
  }

  // Category, Subcategory Select Options
  onSubCategoryChange(event: any, catId: any) {
    const subId = event.target.value;

    if (event.target.checked) {
      // اضيف الـ categoryId لو مش موجود بالفعل
      if (!this.selectedCategories.includes(catId)) {
        this.selectedCategories.push(catId);
      }
      // اضيف الـ subcategory
      this.selectedSubCategories.push(subId);
    } else {
      // شيل الـ subcategory
      this.selectedSubCategories = this.selectedSubCategories.filter(x => x !== subId);

      // لو مافيش أي subcategory متبقي لنفس الـ category، شيل الـ category
      const hasOtherSub = this.categoriesProduct
        .find(c => c.id === catId)
        ?.cat_subcategories.some((sc:any) => this.selectedSubCategories.includes(sc.id));
      if (!hasOtherSub) {
        this.selectedCategories = this.selectedCategories.filter(x => x !== catId);
      }
    }
  }

  // Brands Select Options
  getSelectedBrands():any {
    return this.choicesInstance.getValue(true);
  }

  // Rams Select Options
  onRamsChange(event: any) {
  const value = event.target.value;
    if (event.target.checked) {
      this.selectedRams.push(value);
    } else {
      this.selectedRams = this.selectedRams.filter(x => x !== value);
    }
  }

  // Storage Select Options
  onStorageChange(event: any) {
  const value = event.target.value;
    if (event.target.checked) {
      this.selectedStorage.push(value);
    } else {
      this.selectedStorage = this.selectedStorage.filter(x => x !== value);
    }
  }

  // Processor Select Options
  onProcessorChange(event: any) {
  const value = event.target.value;
    if (event.target.checked) {
      this.selectedProcessors.push(value);
    } else {
      this.selectedProcessors = this.selectedProcessors.filter(x => x !== value);
    }
  }

  // Graphics Select Options
  onGraphicChange(event: any) {
  const value = event.target.value;
    if (event.target.checked) {
      this.selectedGraphics.push(value);
    } else {
      this.selectedGraphics = this.selectedGraphics.filter(x => x !== value);
    }
  }

  // Filter Categories
  filterProducts() {
    const brands = this.getSelectedBrands(); // Brands from Choices.js

    this._CategoryService.getProducts(
      '', // search
      this.selectedCategories.length ? this.selectedCategories : [this.categoryId], // categories
      this.selectedSubCategories, // subcategories
      brands, // brands
      this.selectedGraphics, // graphicscard
      this.selectedProcessors, // processors
      this.selectedRams, // ram
      this.selectedStorage, // storage
      '-id', // sort
      this.pageSize, // page_size
      this.page, // page
      this.someRange[0].toString(), // price_low
      this.someRange[1].toString(), // price_heigh
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
      next: (res) => {
        this.productsCategory = res.results;
        this.totalProducts = res.count || res.results.length;
      },
      error: (err) => console.error(err)
    });
  }


}
