import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './components/footer.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, FooterComponent,RouterOutlet],
  template: `
    <app-header></app-header>
    <main id="main-content" class="flex-1">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
    `

    ,

styles:`
    :host {
      display:flex;
      flex-direction: column;
      min-height: 100vh;
    }`
})
export class AppComponent {
  title = 'QuizArena';
}
