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
  <div>
    <!-- Menu latéral -->
    <aside>
      <div>
        <div>
          <div>
            <i class="fas fa-user"></i>
          </div>
          <div>
            <h3>{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</h3>
            <p>{{ currentUser()?.role }}</p>
          </div>
        </div>
      </div>

      <nav>
        <ul>
          <li>
            <a routerLink="tableau-de-bord" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="fas fa-tachometer-alt"></i>
              <span>Tableau de bord</span>
            </a>
          </li>
          <li>
            <a routerLink="profil" routerLinkActive="active">
              <i class="fas fa-user-edit"></i>
              <span>Mon profil</span>
            </a>
          </li>
          <li>
            <a routerLink="statistiques" routerLinkActive="active">
              <i class="fas fa-chart-bar"></i>
              <span>Mes statistiques</span>
            </a>
          </li>
          <li>
            <a routerLink="creer-quiz" routerLinkActive="active">
              <i class="fas fa-plus-circle"></i>
              <span>Créer un quiz</span>
            </a>
          </li>
          <li>
            <a routerLink="abonnement" routerLinkActive="active">
              <i class="fas fa-credit-card"></i>
              <span>Mon abonnement</span>
            </a>
          </li>
          <li>
            <a routerLink="parametres" routerLinkActive="active">
              <i class="fas fa-cog"></i>
              <span>Paramètres</span>
            </a>
          </li>
        </ul>
      </nav>

      <div>
        <button  (click)="logout()">
          <i class="fas fa-sign-out-alt"></i>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  `,
  styles: ``
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
