import { CommonModule } from '@angular/common';
import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { IUser } from '../../../interfaces/user';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, FormsModule],
  template: `

		<main class="home-container" role="main" aria-labelledby="profile-title">
			<div class="home-content p-10">
				<header class="text-center mb-20">
					<h1 id="profile-title" class="text-xlg text-bold mb-10">Mon profil</h1>
					<p class="text-sm" aria-live="polite">Gérez vos informations personnelles et vos préférences</p>
				</header>

				<section class="mt-20 card card-shadow" role="region" aria-labelledby="personal-title">
					<h2 id="personal-title" class="text-lg text-bold mb-20">Informations personnelles</h2>
					<div class="flex flex-wrap gap-16">
						<div class="field">
							<label for="firstName" class="sr-only">Prénom</label>
							<input
								id="firstName"
								class="w-full p-12"
								autocomplete="given-name"
								type="text"
								[ngModel]="user().firstName"
								(ngModelChange)="updateUser('firstName', $event)"
							>
						</div>
						<div class="field">
							<label for="lastName" class="sr-only">Nom</label>
							<input
								id="lastName"
								class="w-full p-12"
								autocomplete="family-name"
								type="text"
								[ngModel]="user().lastName"
								(ngModelChange)="updateUser('lastName', $event)"
							>
						</div>
						<div class="field">
							<label for="username" class="sr-only">Nom d'utilisateur</label>
							<input
								id="username"
								class="w-full p-12"
								autocomplete="username"
								type="text"
								[ngModel]="user().username"
								(ngModelChange)="updateUser('username', $event)"
							>
						</div>
						<div class="field">
							<label for="email" class="sr-only">Email</label>
							<input
								id="email"
								class="w-full p-12"
								autocomplete="email"
								type="email"
								[ngModel]="user().email"
								(ngModelChange)="updateUser('email', $event)"
							>
						</div>
					</div>
				</section>

				<section class="mt-20 card card-shadow" role="region" aria-labelledby="status-title">
					<h2 id="status-title" class="text-lg text-bold mb-20">Statut du compte</h2>
					<div class="flex flex-wrap gap-16" role="list" aria-label="Informations de statut du compte">
						<div class="card w-full field text-center card-white card-hover" role="listitem" tabindex="0" aria-labelledby="status-label" aria-describedby="status-value">
							<div id="status-value" class="text-lg text-bold">{{ user().status }}</div>
							<div id="status-label" class="text-sm">Statut</div>
						</div>
						<div class="card w-full field text-center card-white card-hover" role="listitem" tabindex="0" aria-labelledby="plan-label" aria-describedby="plan-value">
							<div id="plan-value" class="text-lg text-bold">{{ user().plan }}</div>
							<div id="plan-label" class="text-sm">Plan</div>
						</div>
						<div class="card w-full field text-center card-white card-hover" role="listitem" tabindex="0" aria-labelledby="role-label" aria-describedby="role-value">
							<div id="role-value" class="text-lg text-bold">{{ user().role }}</div>
							<div id="role-label" class="text-sm">Rôle</div>
						</div>
					</div>
				</section>

				<section class="mt-20" role="region" aria-labelledby="actions-title">
					<h2 id="actions-title" class="text-lg text-bold mb-20 text-center">Actions du compte</h2>
					<div class="flex flex-wrap gap-16 justify-content-center" role="list" aria-label="Actions disponibles pour le compte">
						<button class="btn btn-primary py-12 px-24 flex align-items-center gap-12" (click)="saveProfile()" role="listitem" aria-label="Enregistrer les modifications">
							<i class="fas fa-save" aria-hidden="true"></i>
							<span class="text-semibold">Enregistrer les modifications</span>
						</button>
						<button class="btn btn-outline-primary py-12 px-24 flex align-items-center gap-12" (click)="changePassword()" role="listitem" aria-label="Changer le mot de passe">
							<i class="fas fa-key" aria-hidden="true"></i>
							<span class="text-semibold">Changer le mot de passe</span>
						</button>
						<button class="btn btn-outline-primary py-12 px-24 flex align-items-center gap-12" (click)="exportData()" role="listitem" aria-label="Exporter mes données">
							<i class="fas fa-download" aria-hidden="true"></i>
							<span class="text-semibold">Exporter mes données</span>
						</button>
						<button class="btn btn-danger py-12 px-24 flex align-items-center gap-12" (click)="deleteAccount()" role="listitem" aria-label="Supprimer mon compte">
							<i class="fas fa-trash" aria-hidden="true"></i>
							<span class="text-semibold">Supprimer mon compte</span>
						</button>
					</div>
				</section>
			</div>
				</main>
	`,
})
export class UserProfileComponent implements OnInit, OnDestroy {
	private seo = inject(SeoService);
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

	ngOnInit(): void {
		const currentUser = this.user();
		this.seo.updateSEO({
			title: `Mon profil - ${currentUser.firstName} ${currentUser.lastName} | QuizArena`,
			description: `Gérez vos informations personnelles, votre plan (${currentUser.plan}) et vos préférences sur QuizArena.`,
			keywords: 'profil utilisateur, paramètres, compte, sécurité, préférences'
		});
	}

	ngOnDestroy(): void {
		this.seo.resetToDefault();
	}

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
