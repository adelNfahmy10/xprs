import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '@core/services/order/order.service';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { orderData } from '@views/apps/orders/dat';

@Component({
  selector: 'app-order',
  imports: [NgbDropdownModule, NgbPaginationModule, CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit{
  private readonly _OrderService = inject(OrderService)
  orderList = orderData
  allOrders:any[] = []

  ngOnInit(): void {
    this.getAllOrders()
  }

  getAllOrders():void{
    this._OrderService.getOrders().subscribe({
      next:(res)=>{
        this.allOrders = res
        console.log(this.allOrders);
      }
    })
  }



}
