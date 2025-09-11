import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSideBarComponent } from './shared/admin-side-bar.component';
import { AdminSideBarMobileComponent } from './shared/components/admin-side-bar-mobile.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, AdminSideBarComponent, AdminSideBarMobileComponent, RouterOutlet],
  template: `
    <app-admin-side-bar-mobile></app-admin-side-bar-mobile>
    <div class="flex">
      <app-admin-side-bar></app-admin-side-bar>
      <main class="flex-1 home-container p-10">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: ``
})
export class AdminComponent {

}
