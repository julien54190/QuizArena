import { Component } from '@angular/core';
import { SideBarComponent } from "./shared/side-bar.component";
import { UserDashboardComponent } from "./components/user-dashboard.component";

@Component({
  selector: 'app-users',
  imports: [SideBarComponent, UserDashboardComponent],
  template: `
  <div class="flex">
    <app-side-bar></app-side-bar>
    <main class="flex-1">
      <app-user-dashboard></app-user-dashboard>
    </main>
  </div>

  `,
  styles: ``
})
export class UsersComponent {

}
