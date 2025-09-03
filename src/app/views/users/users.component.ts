import { Component } from '@angular/core';
import { UserLayoutComponent } from "./shared/user-layout.component";
import { UserDashboardComponent } from "./components/user-dashboard.component";

@Component({
  selector: 'app-users',
  imports: [UserLayoutComponent, UserDashboardComponent],
  template: `
    <app-user-layout>
      <app-user-dashboard></app-user-dashboard>
    </app-user-layout>
  `,
  styles: ``
})
export class UsersComponent {

}
