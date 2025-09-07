import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderMenuComponent } from './components/header-menu.component';

@Component({
  selector: 'app-header',
  imports: [RouterLinkActive, RouterLink, HeaderMenuComponent],
  template: `
    <header role="banner">
      <div class="flex align-items-center justify-content-between gap-16 px-12 py-6">
        <a class="flex align-items-center gap-12" routerLink="accueil" aria-label="Retour à l'accueil - QuizAréna">
          <img src="/assets/img/logo.png" alt="Logo QuizAréna" class="logo"/>
          <span class="text-lg text-bold">QuizAréna</span>
        </a>
        <nav class="flex align-items-center gap-16 xs-hide" aria-label="Navigation principale">
          <ul class="flex align-items-center gap-12" role="list">
            <li role="listitem"><a routerLink="/accueil" routerLinkActive="active-link" aria-label="Aller à la page d'accueil">Accueil</a></li>
            <li role="listitem"><a routerLink="/jouer" routerLinkActive="active-link" aria-label="Commencer à jouer">Jouer</a></li>
            <li role="listitem"><a routerLink="users/tableau-de-bord" routerLinkActive="active-link" aria-label="Accéder à mon espace personnel">Mon espace</a></li>
            <li role="listitem"><a routerLink="/admin/tableau-de-bord" routerLinkActive="active-link" aria-label="Accéder à l'administration">Admin</a></li>
            <li role="listitem"><a class="btn btn-outline-primary" routerLink="auth/connexion" routerLinkActive="active-link" aria-label="Se connecter">Connexion</a></li>
            <li role="listitem"><a class="btn btn-primary" routerLink="auth/inscription" routerLinkActive="active-link" aria-label="Créer un compte">Inscription</a></li>
          </ul>
        </nav>
        <app-header-menu class="hide xs-show" aria-label="Menu de navigation mobile"></app-header-menu>
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

    li a:focus {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }

  `
})
export class HeaderComponent {

}
