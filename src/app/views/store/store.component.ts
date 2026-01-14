import { Component, inject, OnInit } from '@angular/core';
import { StoreService } from '@core/services/store/store.service';

@Component({
  selector: 'app-store',
  imports: [],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent implements OnInit{
  private readonly _StoreService = inject(StoreService)

  allStores:any[] = []

  ngOnInit(): void {
    this.getAllStores()
  }

  getAllStores():void{
    this._StoreService.getStores().subscribe({
      next:(res)=>{
        this.allStores = res
        console.log(this.allStores);
      }
    })
  }
}
