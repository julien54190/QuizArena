import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from "./shared/side-bar.component";
import { SideBarMobileComponent } from "./shared/components/side-bar-mobile.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [CommonModule, SideBarComponent, SideBarMobileComponent, RouterOutlet],
  template: `
    <app-side-bar-mobile></app-side-bar-mobile>
    <div class="flex">
      <app-side-bar></app-side-bar>
      <main class="flex-1 home-container p-10">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: ``
})
export class UsersComponent {

}
