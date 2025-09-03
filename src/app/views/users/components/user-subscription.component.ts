import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLayoutComponent } from '../shared/user-layout.component';

@Component({
	selector: 'app-user-subscription',
	standalone: true,
	imports: [CommonModule, UserLayoutComponent],
	template: `
		<app-user-layout>
			<div class="home-container">
				<div class="home-content p-10" role="main" aria-labelledby="subscription-title">
					<header class="text-center mb-20">
						<h1 id="subscription-title" class="text-xlg text-bold text-primary mb-10">Mon abonnement</h1>
						<p class="text-lg text-gray-700">Gérez votre plan et vos avantages</p>
					</header>

					<div class="mb-20" role="region" aria-labelledby="current-plan-title">
						<div class="card card-shadow card-white">
							<div class="flex justify-content-between align-items-center mb-20">
								<h2 id="current-plan-title" class="text-lg text-bold">Plan actuel : {{ currentPlan() }}</h2>
								<span class="badge-info">{{ currentPlan() }}</span>
							</div>
							<div>
								<ul class="flex flex-col gap-12" role="list" aria-label="Avantages du plan actuel">
									@for (feature of getCurrentPlanFeatures(); track feature) {
										<li class="flex align-items-center gap-12" role="listitem">
											<i class="fas fa-check text-success" aria-hidden="true"></i>
											<span>{{ feature }}</span>
										</li>
									}
								</ul>
							</div>
						</div>
					</div>

					<div class="mb-20" role="region" aria-labelledby="plans-title">
						<h2 id="plans-title" class="text-lg text-bold mb-20">Plans disponibles</h2>
						<div class="flex flex-wrap gap-16 justify-content-between">
							<div class="card card-white card-hover" [class]="currentPlan() === 'Gratuit' ? 'card-shadow' : ''" role="article" aria-labelledby="plan-free-title">
								<div class="text-center mb-20">
									<h3 id="plan-free-title" class="text-lg text-bold mb-10">Gratuit</h3>
									<p class="text-xlg text-bold text-primary">0€/mois</p>
								</div>
								<div class="mb-20">
									<ul class="flex flex-col gap-8" role="list" aria-label="Avantages du plan Gratuit">
										<li class="flex align-items-center gap-8" role="listitem"><i class="fas fa-check text-success" aria-hidden="true"></i> 5 quiz par jour</li>
										<li class="flex align-items-center gap-8" role="listitem"><i class="fas fa-check text-success" aria-hidden="true"></i> Accès aux quiz publics</li>
										<li class="flex align-items-center gap-8" role="listitem"><i class="fas fa-check text-success" aria-hidden="true"></i> Statistiques de base</li>
										<li class="flex align-items-center gap-8" role="listitem"><i class="fas fa-times text-danger" aria-hidden="true"></i> Quiz personnalisés</li>
										<li class="flex align-items-center gap-8" role="listitem"><i class="fas fa-times text-danger" aria-hidden="true"></i> Support prioritaire</li>
									</ul>
								</div>
								<button class="btn btn-outline-primary w-full" [disabled]="currentPlan() === 'Gratuit'" [attr.aria-disabled]="currentPlan() === 'Gratuit'" aria-label="Choisir le plan Gratuit">
									{{ currentPlan() === 'Gratuit' ? 'Plan actuel' : 'Choisir' }}
								</button>
							</div>

							<div class="card card-white card-hover" [class]="currentPlan() === 'Étudiant' ? 'card-shadow' : ''" role="article" aria-labelledby="plan-student-title">
								<div class="text-center mb-20">
									<h3 id="plan-student-title" class="text-lg text-bold mb-10">Étudiant</h3>
									<p class="text-xlg text-bold text-primary">4.99€/mois</p>
								</div>
								<div class="mb-20">
									<ul class="flex flex-col gap-8" role="list" aria-label="Avantages du plan Étudiant">
										<li class="flex align-items-center gap-8" role="listitem"><i class="fas fa-check text-success" aria-hidden="true"></i> Quiz illimités</li>
										<li class="flex align-items-center gap-8" role="listitem"><i class="fas fa-check text-success" aria-hidden="true"></i> Accès aux quiz publics</li>
										<li class="flex align-items-center gap-8" role="listitem"><i class="fas fa-check text-success" aria-hidden="true"></i> Statistiques avancées</li>
										<li class="flex align-items-center gap-8" role="listitem"><i class="fas fa-check text-success" aria-hidden="true"></i> Quiz personnalisés</li>
										<li class="flex align-items-center gap-8" role="listitem"><i class="fas fa-times text-danger" aria-hidden="true"></i> Support prioritaire</li>
									</ul>
								</div>
								<button class="btn btn-primary w-full" [disabled]="currentPlan() === 'Étudiant'" [attr.aria-disabled]="currentPlan() === 'Étudiant'" aria-label="Choisir le plan Étudiant">
									{{ currentPlan() === 'Étudiant' ? 'Plan actuel' : 'Choisir' }}
								</button>
							</div>

							<div class="card card-white card-hover" [class]="currentPlan() === 'Entreprise' ? 'card-shadow' : ''" role="article" aria-labelledby="plan-business-title">
								<div class="text-center mb-20">
									<h3 id="plan-business-title" class="text-lg text-bold mb-10">Entreprise</h3>
									<p class="text-xlg text-bold text-primary">9.99€/mois</p>
								</div>
								<div class="mb-20">
									<ul class="flex flex-col gap-8" role="list" aria-label="Avantages du plan Entreprise">
										<li class="flex align-items-center gap-8" role="listitem"><i class="fas fa-check text-success" aria-hidden="true"></i> Quiz illimités</li>
										<li class="flex align-items-center gap-8" role="listitem"><i class="fas fa-check text-success" aria-hidden="true"></i> Accès aux quiz publics</li>
										<li class="flex align-items-center gap-8" role="listitem"><i class="fas fa-check text-success" aria-hidden="true"></i> Statistiques avancées</li>
										<li class="flex align-items-center gap-8" role="listitem"><i class="fas fa-check text-success" aria-hidden="true"></i> Quiz personnalisés</li>
										<li class="flex align-items-center gap-8" role="listitem"><i class="fas fa-check text-success" aria-hidden="true"></i> Support prioritaire</li>
									</ul>
								</div>
								<button class="btn btn-primary w-full" [disabled]="currentPlan() === 'Entreprise'" [attr.aria-disabled]="currentPlan() === 'Entreprise'" aria-label="Choisir le plan Entreprise">
									{{ currentPlan() === 'Entreprise' ? 'Plan actuel' : 'Choisir' }}
								</button>
							</div>
						</div>
					</div>

					<div role="region" aria-labelledby="billing-title">
						<h2 id="billing-title" class="text-lg text-bold mb-20">Facturation</h2>
						<div class="card card-white card-shadow">
							<div class="flex justify-content-between align-items-center xs-flex-col xs-w-full">
								<div class="flex flex-col gap-8">
									<p><strong>Prochaine facturation :</strong> 15 janvier 2024</p>
									<p><strong>Montant :</strong> {{ getPlanPrice() }}</p>
									<p><strong>Méthode de paiement :</strong> Carte Visa ****1234</p>
								</div>
								<div class="flex gap-12 xs-flex-col">
									<button class="btn btn-outline-primary" aria-label="Modifier le moyen de paiement">Modifier le paiement</button>
									<button class="btn btn-outline-primary" aria-label="Télécharger les factures">Télécharger les factures</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</app-user-layout>
	`
})
export class UserSubscriptionComponent {
	currentPlan = signal('Gratuit');

	getPlanClass(): string {
		const plan = this.currentPlan().toLowerCase();
		return plan === 'gratuit' ? 'gratuit' : plan === 'étudiant' ? 'etudiant' : 'entreprise';
	}

	getCurrentPlanFeatures(): string[] {
		switch (this.currentPlan()) {
			case 'Gratuit':
				return ['5 quiz par jour', 'Accès aux quiz publics', 'Statistiques de base'];
			case 'Étudiant':
				return ['Quiz illimités', 'Accès aux quiz publics', 'Statistiques avancées', 'Quiz personnalisés'];
			case 'Entreprise':
				return ['Quiz illimités', 'Accès aux quiz publics', 'Statistiques avancées', 'Quiz personnalisés', 'Support prioritaire'];
			default:
				return [];
		}
	}

	getPlanPrice(): string {
		switch (this.currentPlan()) {
			case 'Gratuit':
				return '0€/mois';
			case 'Étudiant':
				return '4.99€/mois';
			case 'Entreprise':
				return '9.99€/mois';
			default:
				return '0€/mois';
		}
	}
}
