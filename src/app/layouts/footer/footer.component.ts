import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core'
import { currentYear } from '../../common/constants'
import { CategoryService } from '@core/services/category/category.service'

@Component({
    selector: 'app-footer',
    imports: [],
    templateUrl: './footer.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FooterComponent implements OnInit {
  private readonly _CategoryService = inject(CategoryService)
  year = currentYear

  allCategories:any[] = []

  ngOnInit(): void {
    this.getAllCategories()
  }

  getAllCategories():void{
    this._CategoryService.getAllCategories().subscribe({
      next:(res)=>{
        this.allCategories = res
      }
    })
  }

}
