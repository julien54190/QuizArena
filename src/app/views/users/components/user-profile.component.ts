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

		<main class="home-container">
			<div class="home-content p-10">
				<header class="text-center mb-20">
					<h1 class="text-xlg text-bold mb-10">Mon profil</h1>
					<p class="text-sm">Gérez vos informations personnelles et vos préférences</p>
				</header>

				<section class="mt-20 card card-shadow">
					<h2 class="text-lg text-bold mb-20">Informations personnelles</h2>
					<div class="flex flex-wrap gap-16">
						<div class="field">
							<input
								class="w-full p-12"
								type="text"
								[ngModel]="user().firstName"
								(ngModelChange)="updateUser('firstName', $event)"
							>
						</div>
						<div class="field">
							<input
								class="w-full p-12"
								type="text"
								[ngModel]="user().lastName"
								(ngModelChange)="updateUser('lastName', $event)"
							>
						</div>
						<div class="field">
							<input
								class="w-full p-12"
								type="text"
								[ngModel]="user().username"
								(ngModelChange)="updateUser('username', $event)"
							>
						</div>
						<div class="field">
							<input
								class="w-full p-12"
								type="email"
								[ngModel]="user().email"
								(ngModelChange)="updateUser('email', $event)"
							>
						</div>
					</div>
				</section>

				<section class="mt-20 card card-shadow">
					<h2 class="text-lg text-bold mb-20">Statut du compte</h2>
					<div class="flex flex-wrap gap-16" role="list">
						<div class="card w-full field text-center card-white card-hover" role="listitem">
							<div class="text-lg text-bold">{{ user().status }}</div>
							<div class="text-sm">Statut</div>
						</div>
						<div class="card w-full field text-center card-white card-hover" role="listitem">
							<div class="text-lg text-bold">{{ user().plan }}</div>
							<div class="text-sm">Plan</div>
						</div>
						<div class="card w-full field text-center card-white card-hover" role="listitem">
							<div class="text-lg text-bold">{{ user().role }}</div>
							<div class="text-sm">Rôle</div>
						</div>
					</div>
				</section>

				<section class="mt-20">
					<h2 class="text-lg text-bold mb-20 text-center">Actions du compte</h2>
					<div class="flex flex-wrap gap-16 justify-content-center">
						<button class="btn btn-primary py-12 px-24 flex align-items-center gap-12" (click)="saveProfile()">
							<i class="fas fa-save"></i>
							<span class="text-semibold">Enregistrer les modifications</span>
						</button>
						<button class="btn btn-outline-primary py-12 px-24 flex align-items-center gap-12" (click)="changePassword()">
							<i class="fas fa-key"></i>
							<span class="text-semibold">Changer le mot de passe</span>
						</button>
						<button class="btn btn-outline-primary py-12 px-24 flex align-items-center gap-12" (click)="exportData()">
							<i class="fas fa-download"></i>
							<span class="text-semibold">Exporter mes données</span>
						</button>
						<button class="btn btn-danger py-12 px-24 flex align-items-center gap-12" (click)="deleteAccount()">
							<i class="fas fa-trash"></i>
							<span class="text-semibold">Supprimer mon compte</span>
						</button>
					</div>
				</section>
			</div>
		</main>
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
