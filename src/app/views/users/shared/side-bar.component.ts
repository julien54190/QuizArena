import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, RouterModule],
  template: `
      <aside class="flex flex-col h-screen sidebar" role="complementary" aria-label="Menu de navigation utilisateur">
        <div class="p-25 sidebar-header">
          <div class="flex align-items-center gap-16">
            <div class="flex justify-content-center align-items-center avatar" role="img">
              <img [src]="currentUser()?.avatar" alt="Avatar de {{ currentUser()?.firstName }} {{ currentUser()?.lastName }}">
            </div>
            <div class="text-semibold">
              <h3 id="user-name">{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</h3>
              <p id="user-role">{{ currentUser()?.role }}</p>
            </div>
          </div>
        </div>

        <nav class="flex-1 py-24" role="navigation" aria-labelledby="user-name">
          <ul role="list">
            <li role="listitem">
              <a routerLink="/users/tableau-de-bord"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{exact: true}"
                  class="flex align-items-center gap-12 py-12 px-24 nav-link"
                  aria-label="Aller au tableau de bord">
                <i class="fas fa-tachometer-alt" aria-hidden="true"></i>
                <span>Tableau de bord</span>
              </a>
            </li>
            <li role="listitem">
              <a routerLink="/users/profil"
                  routerLinkActive="active"
                  class="flex align-items-center gap-12 py-12 px-24 nav-link"
                  aria-label="Gérer mon profil">
                <i class="fas fa-user-edit" aria-hidden="true"></i>
                <span>Mon profil</span>
              </a>
            </li>
            <li role="listitem">
              <a routerLink="/users/statistiques"
                  routerLinkActive="active"
                  class="flex align-items-center gap-12 py-12 px-24 nav-link"
                  aria-label="Voir mes statistiques">
                <i class="fas fa-chart-bar" aria-hidden="true"></i>
                <span>Mes statistiques</span>
              </a>
            </li>
            <li role="listitem">
              <a routerLink="/users/creer-quiz"
                  routerLinkActive="active"
                  class="flex align-items-center gap-12 py-12 px-24 nav-link"
                  aria-label="Créer un nouveau quiz">
                <i class="fas fa-plus-circle" aria-hidden="true"></i>
                <span>Créer un quiz</span>
              </a>
            </li>
            <li role="listitem">
              <a routerLink="/users/abonnement"
                  routerLinkActive="active"
                  class="flex align-items-center gap-12 py-12 px-24 nav-link"
                  aria-label="Gérer mon abonnement">
                <i class="fas fa-credit-card" aria-hidden="true"></i>
                <span>Mon abonnement</span>
              </a>
            </li>
            <li role="listitem">
              <a routerLink="/users/parametres"
                  routerLinkActive="active"
                  class="flex align-items-center gap-12 py-12 px-24 nav-link"
                  aria-label="Accéder aux paramètres">
                <i class="fas fa-cog" aria-hidden="true"></i>
                <span>Paramètres</span>
              </a>
            </li>
          </ul>
        </nav>

        <div class="p-25 sidebar-footer">
          <button (click)="logout()"
                  class="btn btn-danger flex align-items-center gap-12 w-full"
                  aria-label="Se déconnecter">
            <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
  `,
  styles: [`
    @media (max-width: 920px) {
      :host { display: none; }
    }
  `]
})
export class SideBarComponent {
  private userService = inject(UserService);
	private router = inject(Router);

	currentUser = signal<IUser | null>(null);

	constructor() {
		// Simuler un utilisateur connecté pour le moment
		this.currentUser.set({
			id: 1,
			firstName: 'Jean',
			lastName: 'Dupont',
			username: 'jeandupont',
      avatar:'https://mockmind-api.uifaces.co/content/human/80.jpg',
			email: 'jean.dupont@email.com',
			role: 'user',
			status: 'active',
			plan: 'gratuit',
			quizzesCreated: 5,
			totalPlays: 42,
			averageScore: 78
		});
	}

	logout() {
		// Logique de déconnexion
		this.router.navigate(['/accueil']);
	}
}
