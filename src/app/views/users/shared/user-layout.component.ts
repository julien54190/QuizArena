import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from './side-bar.component';

@Component({
  selector: 'app-user-layout',
  imports: [CommonModule, SideBarComponent],
  template: `
    <div class="flex">
      <app-side-bar></app-side-bar>
      <main class="flex-1 home-container p-10">
        <ng-content></ng-content>
      </main>
    </div>
  `,
  styles: ``
})
export class UserLayoutComponent {
}
