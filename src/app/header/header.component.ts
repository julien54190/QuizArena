import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderMenuComponent } from './components/header-menu.component';

@Component({
  selector: 'app-header',
  imports: [RouterLinkActive, RouterLink, HeaderMenuComponent],
  template: `
    <header role="banner">
      <div class="flex align-items-center justify-content-between gap-16 px-12 py-6">
        <a class="flex align-items-center gap-12" routerLink="accueil">
          <img src="/assets/img/logo.png" alt="Logo" class="logo"/>
          <span class="text-lg text-bold">QuizAréna</span>
        </a>
        <nav class="flex align-items-center gap-16 xs-hide">
          <ul class="flex align-items-center gap-12">
            <li><a routerLink="/accueil"  routerLinkActive="active-link">Accueil</a></li>
            <li><a routerLink="/jouer"  routerLinkActive="active-link">Jouer</a></li>
            <li><a routerLink="tableau-de-bord"  routerLinkActive="active-link">Mon espace</a></li>
            <li><a routerLink="/admin/tableau-de-bord"  routerLinkActive="active-link">Admin</a></li>
            <li><a class="btn btn-outline-primary" routerLink="/connexion" routerLinkActive="active-link">Connexion</a></li>
            <li><a class="btn btn-primary" routerLink="/inscription" routerLinkActive="active-link">Inscription</a></li>
          </ul>
        </nav>
        <app-header-menu class="hide xs-show"></app-header-menu>
      </div>
    </header>
  `,
  styles: `
    :host { display: block; width: 100%; }

    header {
      background-color: var(--light);
      color: var(--dark);
      border-bottom: var(--border);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    li a:hover {
      background-color: var(--dark);
      border-radius: var(--radius);
      color: white;
    }


`
})
export class HeaderComponent {

}
