import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '@core/services/cart/cart.service';
import { FavoriteService } from '@core/services/favorite/favorite.service';

@Component({
  selector: 'app-favorite',
  imports: [NgClass, RouterLink,CommonModule],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit{
  private readonly _FavoriteService = inject(FavoriteService)
    private readonly _CartService = inject(CartService)

  allFavorites: any[] = [];
  cart:any[] = []
  cartId:string | null = localStorage.getItem('xprsCartId')

  ngOnInit(): void {
    this.getAllCart()
    const storedFav = localStorage.getItem('myFavProduct');
    if (storedFav) {
      this.allFavorites = JSON.parse(storedFav);
    }
  }

  // للتحقق إذا العنصر موجود في المفضلة
  isFavorite(item: any): boolean {
    return this.allFavorites.some(fav => fav.id === item.id);
  }

  // إضافة / إزالة من المفضلة مباشرة من صفحة favorites
  toggleFavorite(item: any): void {
    const index = this.allFavorites.findIndex(fav => fav.id === item.id);

    if (index === -1) {
      this.allFavorites.push(item);
    } else {
      this.allFavorites.splice(index, 1); // لو موجود نشيله
    }

    // تحديث localStorage
    localStorage.setItem('myFavProduct', JSON.stringify(this.allFavorites));
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

  // Favorites Must Be Auth
  // getAllFavorites():void{
  //   this._FavoriteService.getFavorites().subscribe({
  //     next:(res)=>{
  //       this.allFavorites = res
  //     }
  //   })
  // }


}
