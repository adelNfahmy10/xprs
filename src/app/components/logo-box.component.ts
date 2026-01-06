import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
    selector: 'app-logo-box',
    imports: [RouterLink, CommonModule],
    template: `
    <div [class]="className">
      <a routerLink="/" class="logo-dark">
        @if (size) {
          <img src="assets/images/global-image/favicon-logo.png" style="margin: 0 -7px;" class="logo-sm" alt="logo sm" />
          <img
            src="assets/images/home-image/logo.avif"
            class="logo-lg"
            alt="logo dark"
          />
        } @else {
          <img src="assets/images/home-image/logo.avif" height="32" alt="logo dark" />
        }
      </a>

      <a routerLink="/" class="logo-light">
        @if (size) {
          <img src="assets/images/global-image/favicon-logo.png" style="margin: 0 -7px;" class="logo-sm" alt="logo sm" />
          <img
            src="assets/images/home-image/logo.avif"
            class="logo-lg"
            alt="logo light"
          />
        } @else {
          <img
            src="assets/images/home-image/logo.avif"
            height="32"
            alt="logo light"
          />
        }
      </a>
    </div>
  `
})
export class LogoBoxComponent {
  @Input() className: string = ''
  @Input() size: boolean = false
}
