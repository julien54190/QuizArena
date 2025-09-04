import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-header-menu',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <button (click)="toggleMenu()"><i class="fa-solid fa-bars" style="color: var(--primary);"></i></button>
    @if (show()) {
      <ul>
        @for (link of navigation; track $index) {
          <li (click)="show.set(false)" [class.mb-20]="!$last">
            <a [routerLink]="link.path" routerLinkActive="active-link">{{ link.name }}</a>
          </li>
        }
    </ul>
    }
  `,
  styles: `
  :host { margin-left: auto; }
  button{
    padding: 16px;
    font-size: 24px;
    border: none;
    background-color: inherit;
    color: var(--primary);
  }
  ul {
    position: absolute;
    top: 64px;
    right: 12px;
    color: var(--text-color);
    background-color: white;
    padding: 16px;
    border: var(--border);
    border-radius: var(--radius);
  }
  li a { border-radius: var(--radius); }
  li a:hover, li a:focus { background-color: var(--dark); color: white; }
  `
})
export class HeaderMenuComponent {
  show = signal(false);
  navigation = [
    {
      path: '/accueil',
      name: 'Accueil',
    },
  {
    path: '/jouer',
    name: 'jouer',
  },
  {
    path: 'users/tableau-de-bord',
    name: 'Mon espace',
  },
  {
    path: '/admin/tableau-de-bord',
    name: 'Admin',
  },
  {
    path: 'auth/connexion',
    name: 'Connexion',
  },
  {
    path: 'auth/inscription',
    name: 'Inscription',
  }
  ]

  toggleMenu() {
    this.show.update(value => !value);
  }
}
