import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLayoutComponent } from '../shared/user-layout.component';

@Component({
	selector: 'app-user-subscription',
	standalone: true,
	imports: [CommonModule, UserLayoutComponent],
	template: `
		<app-user-layout>
			<div>
				<header>
					<h1>Mon abonnement</h1>
					<p>Gérez votre plan et vos avantages</p>
				</header>

				<div>
					<div>
						<div>
							<h2>Plan actuel : {{ currentPlan() }}</h2>
							<span>{{ currentPlan() }}</span>
						</div>
						<div>
							<ul>
								@for (feature of getCurrentPlanFeatures(); track feature) {
									<li>
										<i class="fas fa-check"></i>
										{{ feature }}
									</li>
								}
							</ul>
						</div>
					</div>
				</div>

				<div>
					<h2>Plans disponibles</h2>
					<div>
						<div [class]="currentPlan() === 'Gratuit' ? 'active' : ''">
							<div>
								<h3>Gratuit</h3>
								<p>0€/mois</p>
							</div>
							<div>
								<ul>
									<li><i class="fas fa-check"></i> 5 quiz par jour</li>
									<li><i class="fas fa-check"></i> Accès aux quiz publics</li>
									<li><i class="fas fa-check"></i> Statistiques de base</li>
									<li><i class="fas fa-times"></i> Quiz personnalisés</li>
									<li><i class="fas fa-times"></i> Support prioritaire</li>
								</ul>
							</div>
							<button [disabled]="currentPlan() === 'Gratuit'">
								{{ currentPlan() === 'Gratuit' ? 'Plan actuel' : 'Choisir' }}
							</button>
						</div>

						<div [class]="currentPlan() === 'Étudiant' ? 'active' : ''">
							<div>
								<h3>Étudiant</h3>
								<p>4.99€/mois</p>
							</div>
							<div>
								<ul>
									<li><i class="fas fa-check"></i> Quiz illimités</li>
									<li><i class="fas fa-check"></i> Accès aux quiz publics</li>
									<li><i class="fas fa-check"></i> Statistiques avancées</li>
									<li><i class="fas fa-check"></i> Quiz personnalisés</li>
									<li><i class="fas fa-times"></i> Support prioritaire</li>
								</ul>
							</div>
							<button [disabled]="currentPlan() === 'Étudiant'">
								{{ currentPlan() === 'Étudiant' ? 'Plan actuel' : 'Choisir' }}
							</button>
						</div>

						<div [class]="currentPlan() === 'Entreprise' ? 'active' : ''">
							<div>
								<h3>Entreprise</h3>
								<p>9.99€/mois</p>
							</div>
							<div>
								<ul>
									<li><i class="fas fa-check"></i> Quiz illimités</li>
									<li><i class="fas fa-check"></i> Accès aux quiz publics</li>
									<li><i class="fas fa-check"></i> Statistiques avancées</li>
									<li><i class="fas fa-check"></i> Quiz personnalisés</li>
									<li><i class="fas fa-check"></i> Support prioritaire</li>
								</ul>
							</div>
							<button [disabled]="currentPlan() === 'Entreprise'">
								{{ currentPlan() === 'Entreprise' ? 'Plan actuel' : 'Choisir' }}
							</button>
						</div>
					</div>
				</div>

				<div>
					<h2>Facturation</h2>
					<div>
						<div>
							<p><strong>Prochaine facturation :</strong> 15 janvier 2024</p>
							<p><strong>Montant :</strong> {{ getPlanPrice() }}</p>
							<p><strong>Méthode de paiement :</strong> Carte Visa ****1234</p>
						</div>
						<div>
							<button>Modifier le paiement</button>
							<button>Télécharger les factures</button>
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
