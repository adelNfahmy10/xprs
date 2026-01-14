import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NouisliderComponent } from "ng2-nouislider";
import { NgbCollapseModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CategoryService } from '@core/services/category/category.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Choices from 'choices.js';
import { CartService } from '@core/services/cart/cart.service';

@Component({
  selector: 'app-categories',
  imports: [NouisliderComponent, FormsModule, CommonModule, NgbPaginationModule, NgbCollapseModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit{
  private readonly _CategoryService = inject(CategoryService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _CartService = inject(CartService)

  productsCategory:any;
  catergoryBrands:any[] = []
  categoriesProduct:any[] = []
  ramsProduct:any[] = []
  storageProduct:any[] = []
  processorsProduct:any[] = []
  graphicsCardsproduct:any[] = []
  categoryId!: string;
  subCategoryId!: string;
  brandId!: string;
  totalProducts = 0;
  page = 1;
  pageSize = 9;

  ngOnInit(): void {
    this.getAllProductsCategory()
    this.getAllCart()
    const storedFav = localStorage.getItem('myFavProduct');
    if (storedFav) {
      this.allFavoriteItems = JSON.parse(storedFav);
    }
  }

  choicesInstance!: Choices;
  isCollapsedCategories = true
  isCollapsedBrands = true
  isCollapsedRams = true
  isCollapsedStorage = true
  isCollapsedProcessors = true
  isCollapsedGraphics = true

  selectedCategories: string[] = [];
  selectedSubCategories: string[] = [];
  selectedBrands: string[] = [];
  selectedRams: string[] = [];
  selectedStorage: string = '';
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
        this.subCategoryId = param.get('subId')!;
        this.brandId = param.get('brandId')!;
        console.log(this.categoryId);
        console.log(this.subCategoryId);
        console.log(this.brandId);

        if(!this.subCategoryId && !this.brandId){
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
        } else if(this.subCategoryId) {
          this._CategoryService.getProducts(
            '', // search
            [this.categoryId], // categories
            [this.subCategoryId], // subcategories
            [], // brands
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
        } else if(this.brandId){
          this._CategoryService.getProducts(
            '', // search
            [this.categoryId], // categories
            [this.subCategoryId], // subcategories
            [this.brandId], // brands
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
  onBrandsChange(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedBrands.push(value);
    } else {
      this.selectedBrands = this.selectedBrands.filter(x => x !== value);
    }
  }

  // Brands Select Options
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
      this.selectedStorage = value
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
    this._CategoryService.getProducts(
      '', // search
      this.selectedCategories.length ? this.selectedCategories : [this.categoryId], // categories
      this.selectedSubCategories, // subcategories
      this.selectedBrands, // brands
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


  allFavoriteItems:any[] = []
  cart:any[] = []
  cartId:string | null = localStorage.getItem('xprsCartId')
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
    } else {
      // لو موجود، ممكن نعمل toggle ونحذفه (اختياري)
      this.allFavoriteItems.splice(index, 1);
    }

    // تحديث localStorage
    localStorage.setItem('myFavProduct', JSON.stringify(this.allFavoriteItems));
    console.log(this.allFavoriteItems);
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
        }
      });
      return;
    }

    const data = {
      product: item.id,
      cart: this.cartId,
      quantity: item.quantity || 1,
      product_property: null,
      card: null,
      branded_page_product: null,
      insurance: null
    };

    this._CartService.addCartProduct(data).subscribe({
      next: () => {
        this.getAllCart();
      }
    });
  }

  getCartItem(item: any) {
    return this.cart.find(
      cartItem => cartItem.product?.id === item.id
    );
  }

  getAllCart():void{
    if(this.cartId){
      this._CartService.getCart(this.cartId).subscribe({
        next:(res)=>{
          this.cart = res?.cartproduct || [];
          this._CartService.cartCount.set(res.cartproduct.length)
          this._CartService.cartProducts.set(res.cartproduct)
        }
      })
    }
  }


}
