import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '@core/services/order/order.service';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { orderData } from '@views/apps/orders/dat';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-order',
  imports: [NgbDropdownModule, NgbPaginationModule, CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit{
  private readonly _OrderService = inject(OrderService)

  allOrders:any[] = []
  shippingData:any
  shippingCheck:boolean = false

  ngOnInit(): void {
    this.getAllOrders()
    this.getAllShipping()
  }

  getAllOrders():void{
    this._OrderService.getOrders().subscribe({
      next:(res)=>{
        this.allOrders = res
      }
    })
  }

  showShipping(check:boolean):void{
    this.shippingCheck = check
  }

  getAllShipping():void{
    this._OrderService.shippingInstruction().subscribe({
      next:(res)=>{
        this.shippingData = res
      }
    })
  }

  cancelResone:string = ''
  cancelOrder(order:any):void{
    let data = {
      status : order.status,
      reason_for_cancelation: this.cancelResone
    };
    this._OrderService.cancelOrder(order.id, data)
  }
}
