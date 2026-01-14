import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '@core/services/favorite/favorite.service';

@Component({
  selector: 'app-favorite',
  imports: [NgClass, RouterLink,CommonModule],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit{
  private readonly _FavoriteService = inject(FavoriteService)

  allFavorites: any[] = [];

  ngOnInit(): void {
    const storedFav = localStorage.getItem('myFavProduct');
    this.allFavorites = storedFav ? JSON.parse(storedFav) : [];
    console.log(this.allFavorites);
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

  // Favorites Must Be Auth
  // getAllFavorites():void{
  //   this._FavoriteService.getFavorites().subscribe({
  //     next:(res)=>{
  //       this.allFavorites = res
  //     }
  //   })
  // }


}
