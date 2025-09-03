import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { UserLayoutComponent } from '../shared/user-layout.component';
import { IUser } from '../../../interfaces/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, UserLayoutComponent,FormsModule],
  template: `
    <app-user-layout>

		<div>
			<header>
				<h1>Mon profil</h1>
				<p>Gérez vos informations personnelles et vos préférences</p>
			</header>

			<div>
				<div>
					<h2>Informations personnelles</h2>
					<div>
						<div>
							<input
								type="text"
								[ngModel]="user().firstName"
								(ngModelChange)="updateUser('firstName', $event)"
							>
						</div>

						<div>
							<input
								type="text"
								[ngModel]="user().lastName"
								(ngModelChange)="updateUser('lastName', $event)"
							>
						</div>

						<div>
							<input
								type="text"
								[ngModel]="user().username"
								(ngModelChange)="updateUser('username', $event)"
							>
						</div>

						<div>
							<input
								type="email"
								[ngModel]="user().email"
								(ngModelChange)="updateUser('email', $event)"
							>
						</div>
					</div>
				</div>

				<div>
					<h2>Statut du compte</h2>
					<div>
						<div>
							<div>
								<h3>Statut</h3>
								<p>{{ user().status }}</p>
							</div>
						</div>

						<div>
							<div>
								<h3>Plan</h3>
								<p>{{ user().plan }}</p>
							</div>
						</div>

						<div>
							<div>
								<h3>Rôle</h3>
								<p>{{ user().role }}</p>
							</div>
						</div>
					</div>
				</div>

				<div>
					<h2>Actions du compte</h2>
					<div>
						<button (click)="saveProfile()">
							Enregistrer les modifications
						</button>

						<button (click)="changePassword()">
							Changer le mot de passe
						</button>

						<button (click)="exportData()">
							Exporter mes données
						</button>

						<button (click)="deleteAccount()">
							Supprimer mon compte
						</button>
					</div>
				</div>
			</div>
		</div>
    </app-user-layout>
  `,
})
export class UserProfileComponent {
	user = signal<IUser>({
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

	updateUser(property: keyof IUser, value: any) {
		this.user.update(current => ({
			...current,
			[property]: value
		}));
	}

	saveProfile() {
		// Logique pour sauvegarder le profil
		console.log('Profil sauvegardé:', this.user());
		alert('Profil sauvegardé avec succès !');
	}

	changePassword() {
		// Logique pour changer le mot de passe
		alert('Fonctionnalité de changement de mot de passe à implémenter');
	}

	exportData() {
		// Logique pour exporter les données
		alert('Export de vos données en cours...');
	}

	deleteAccount() {
		if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
			// Logique pour supprimer le compte
			alert('Compte supprimé avec succès');
		}
	}
}
