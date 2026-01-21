import { Component, inject, OnInit } from '@angular/core';
import { GlobalPolicyService } from '@core/services/global-policy/global-policy.service';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit{
  private readonly _GlobalPolicyService = inject(GlobalPolicyService)

  aboutData:any[] = []

  ngOnInit(): void {
    this.getAboutData()
  }


  getAboutData():void{
    this._GlobalPolicyService.getAbout().subscribe({
      next:(res)=>{
        this.aboutData = res
        console.log(this.aboutData);
      }
    })
  }


}
