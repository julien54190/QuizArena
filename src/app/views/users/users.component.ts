import { Component } from '@angular/core';
import { SideBarComponent } from "./shared/side-bar.component";

@Component({
  selector: 'app-users',
  imports: [SideBarComponent],
  template: `
    <app-side-bar></app-side-bar>
  `,
  styles: ``
})
export class UsersComponent {

}
