import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './components/footer.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <div class="flex-auto flex flex-col"></div>
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
