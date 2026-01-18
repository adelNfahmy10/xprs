import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core'
import { currentYear } from '../../common/constants'
import { CategoryService } from '@core/services/category/category.service'
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
    selector: 'app-footer',
    imports: [NgbCollapseModule],
    templateUrl: './footer.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FooterComponent implements OnInit {
  private readonly _CategoryService = inject(CategoryService)
  year = currentYear
  allCategories:any[] = []
  isCollapsed = true;
  stage = 1; // 1 | 2 | 3

  showMore() {
    if (this.stage < 3) {
      this.stage++;
    }
  }

  showLess() {
    if (this.stage > 1) {
      this.stage--;
    }
  }


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
