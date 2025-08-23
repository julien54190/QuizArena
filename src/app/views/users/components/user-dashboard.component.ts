import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../../../interfaces/user';

interface Badge { name: string; icon: string; hint?: string; }

@Component({
  selector: 'app-user-dashboard',
	imports: [CommonModule],
	template: `
		<main class="home-container" role="main" aria-labelledby="dashboard-title">
			<div class="home-content p-10">
				<header class="text-center mb-20">
					<h1 id="dashboard-title" class="text-xlg text-bold mb-10">Tableau de bord</h1>
					<p class="text-sm" aria-live="polite">Bienvenue dans votre espace personnel, {{ currentUser()?.firstName }} !</p>
				</header>

				<!-- Statistiques -->
				<section class="mt-20 card card-shadow" role="region" aria-labelledby="stats-title">
					<h2 id="stats-title" class="sr-only">Statistiques personnelles</h2>
					<div class="flex flex-wrap gap-16" role="list" aria-label="Statistiques de l'utilisateur">
						<article class="card w-full field text-center card-white card-hover" role="listitem" tabindex="0">
							<div class="text-lg text-bold" aria-label="Nombre de quiz joués" aria-describedby="quiz-joues-desc">{{ currentUser()?.totalPlays || 0 }}</div>
							<div id="quiz-joues-desc" class="text-sm">Quiz joués</div>
						</article>
						<article class="card w-full field text-center card-white card-hover" role="listitem" tabindex="0">
							<div class="text-lg text-bold" aria-label="Score moyen" aria-describedby="score-moyen-desc">{{ currentUser()?.averageScore || 0 }}%</div>
							<div id="score-moyen-desc" class="text-sm">Score moyen</div>
						</article>
						<article class="card w-full field text-center card-white card-hover" role="listitem" tabindex="0">
							<div class="text-lg text-bold" aria-label="Nombre de quiz créés" aria-describedby="quiz-crees-desc">{{ currentUser()?.quizzesCreated || 0 }}</div>
							<div id="quiz-crees-desc" class="text-sm">Quiz créés</div>
						</article>
						<article class="card w-full field text-center card-white card-hover" role="listitem" tabindex="0">
							<div class="text-lg text-bold" aria-label="Plan actuel" aria-describedby="plan-actuel-desc">{{ currentUser()?.plan || 'Gratuit' }}</div>
							<div id="plan-actuel-desc" class="text-sm">Plan actuel</div>
						</article>
					</div>
				</section>

				<!-- Actions rapides -->
				<section class="mt-20" role="region" aria-labelledby="actions-title">
					<h2 id="actions-title" class="text-lg text-bold mb-20 text-center">Actions rapides</h2>
					<div class="flex flex-wrap gap-16" role="list" aria-label="Actions rapides disponibles">
						<button
							(click)="navigateTo('creer-quiz')"
							(keydown.enter)="navigateTo('creer-quiz')"
							(keydown.space)="navigateTo('creer-quiz')"
							class="card card-white card-hover text-center flex flex-col justify-content-between"
							aria-label="Créer un quiz"
							aria-describedby="creer-quiz-desc"
							role="listitem"
							tabindex="0">
							<div class="text-primary text-lg" aria-hidden="true">
								<i class="fas fa-plus-circle"></i>
							</div>
							<div>
								<h3 class="text-semibold mb-10">Créer un quiz</h3>
								<p id="creer-quiz-desc" class="text-sm">Créez votre propre quiz et partagez-le avec la communauté</p>
							</div>
						</button>

						<button
							(click)="navigateTo('statistiques')"
							(keydown.enter)="navigateTo('statistiques')"
							(keydown.space)="navigateTo('statistiques')"
							class="card card-white card-hover text-center flex flex-col justify-content-between"
							aria-label="Voir mes statistiques"
							aria-describedby="stats-desc"
							role="listitem"
							tabindex="0">
							<div class="text-primary text-lg" aria-hidden="true">
								<i class="fas fa-chart-line"></i>
							</div>
							<div>
								<h3 class="text-semibold mb-10">Voir mes stats</h3>
								<p id="stats-desc" class="text-sm">Analysez vos performances et votre progression</p>
							</div>
						</button>

						<button
							(click)="navigateTo('profil')"
							(keydown.enter)="navigateTo('profil')"
							(keydown.space)="navigateTo('profil')"
							class="card card-white card-hover text-center flex flex-col justify-content-between"
							aria-label="Modifier mon profil"
							aria-describedby="profil-desc"
							role="listitem"
							tabindex="0">
							<div class="text-primary text-lg" aria-hidden="true">
								<i class="fas fa-user-edit"></i>
							</div>
							<div>
								<h3 class="text-semibold mb-10">Modifier mon profil</h3>
								<p id="profil-desc" class="text-sm">Mettez à jour vos informations personnelles</p>
							</div>
						</button>

						<button
							(click)="navigateTo('abonnement')"
							(keydown.enter)="navigateTo('abonnement')"
							(keydown.space)="navigateTo('abonnement')"
							class="card card-white card-hover text-center flex flex-col justify-content-between"
							aria-label="Gérer l'abonnement"
							aria-describedby="abonnement-desc"
							role="listitem"
							tabindex="0">
							<div class="text-primary text-lg" aria-hidden="true">
								<i class="fas fa-credit-card"></i>
							</div>
							<div>
								<h3 class="text-semibold mb-10">Gérer l'abonnement</h3>
								<p id="abonnement-desc" class="text-sm">Passez à un plan supérieur pour plus de fonctionnalités</p>
							</div>
						</button>
					</div>
				</section>

				<!-- Expérience -->
				<section class="mt-20 card card-shadow" role="region" aria-labelledby="experience-title">
					<div class="flex justify-content-between align-items-center mb-20">
						<h2 id="experience-title" class="text-lg text-bold">Mon expérience</h2>
						<span class="badge-info" aria-label="Niveau actuel">{{ level() }}</span>
					</div>
					<div
						class="experience-bar"
						role="progressbar"
						aria-valuemin="0"
						[attr.aria-valuenow]="xpPercent()"
						aria-valuemax="100"
						[attr.aria-valuetext]="'Progression: ' + xpPercent() + '%. ' + currentXp() + ' points d experience sur ' + nextLevelXp() + ' requis pour le niveau suivant.'"
						aria-labelledby="experience-title">
						<div class="experience-fill" [style.width.%]="xpPercent()" aria-hidden="true"></div>
					</div>
					<div class="flex justify-content-between mt-10" aria-live="polite">
						<span class="text-sm">XP: {{ currentXp() }} / {{ nextLevelXp() }}</span>
						<span class="text-sm">Reste: {{ nextLevelXp() - currentXp() }} XP</span>
					</div>
				</section>

				<!-- Badges -->
				<section class="mt-20" role="region" aria-labelledby="badges-title">
					<h2 id="badges-title" class="sr-only">Badges et récompenses</h2>
					<div class="flex flex-wrap gap-16">
						<div class="card card-white flex-1" role="region" aria-labelledby="badges-unlocked-title">
							<h3 id="badges-unlocked-title" class="text-lg text-bold mb-20">Badges gagnés</h3>
							<div class="flex flex-wrap gap-12" role="list" aria-label="Badges débloqués">
								<div
									*ngFor="let b of badgesUnlocked(); trackBy: trackByBadge"
									class="badge-chip badge-chip--unlocked"
									[title]="getUnlockedBadgeTitle(b)"
									role="listitem"
									tabindex="0"
									[attr.aria-label]="'Badge débloqué: ' + b.name"
									[attr.aria-describedby]="'badge-desc-' + b.name">
									<i [class]="b.icon" aria-hidden="true"></i>
									<span class="text-sm">{{ b.name }}</span>
									<span id="badge-desc-{{ b.name }}" class="sr-only">{{ b.hint || 'Badge obtenu grâce à vos performances' }}</span>
								</div>
							</div>
						</div>
						<div class="card card-white flex-1" role="region" aria-labelledby="badges-locked-title">
							<h3 id="badges-locked-title" class="text-lg text-bold mb-20">À débloquer</h3>
							<div class="flex flex-wrap gap-12" role="list" aria-label="Badges à débloquer">
								<div
									*ngFor="let b of badgesLocked(); trackBy: trackByBadge"
									class="badge-chip badge-chip--locked"
									[title]="getLockedBadgeTitle(b)"
									role="listitem"
									tabindex="0"
									[attr.aria-label]="'Badge à débloquer: ' + b.name"
									[attr.aria-describedby]="'badge-locked-desc-' + b.name">
									<i [class]="b.icon" aria-hidden="true"></i>
									<span class="text-sm">{{ b.name }}</span>
									<span id="badge-locked-desc-{{ b.name }}" class="sr-only">{{ b.hint || 'Atteignez l\'objectif indiqué pour débloquer ce badge' }}</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- Activité récente -->
				<section class="mt-20 card card-shadow" role="region" aria-labelledby="activity-title">
					<h2 id="activity-title" class="text-lg text-bold mb-20">Activité récente</h2>
					<div class="activity-list" role="list" aria-label="Activités récentes">
						<div
							*ngFor="let activity of recentActivities(); trackBy: trackByActivity"
							class="flex align-items-center gap-16 p-25 activity-item"
							role="listitem"
							tabindex="0">
							<div class="flex align-items-center justify-content-center activity-icon" aria-hidden="true">
								<i [class]="activity.icon"></i>
							</div>
							<div class="activity-content">
								<p class="activity-text">{{ activity.text }}</p>
								<time class="activity-time text-sm" [attr.datetime]="getActivityDateTime(activity.time)">{{ activity.time }}</time>
							</div>
						</div>
					</div>
				</section>
			</div>
		</main>
	`,
	styles: [`
		:host { display: block; }

		@media (max-width: 768px) {
			.flex-wrap {
				flex-direction: column;
			}

			.gap-16 {
				gap: 12px;
			}

			.badge-info {
				text-align: center;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				min-width: 60px;
			}
		}
	`]
})
export class UserDashboardComponent {
  private router = inject(Router);

	currentUser = signal<IUser | null>({
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

	recentActivities = signal([
		{ icon: 'fas fa-gamepad', text: 'Vous avez terminé le quiz "Culture Générale" avec un score de 85%', time: 'Il y a 2 heures' },
		{ icon: 'fas fa-plus-circle', text: 'Vous avez créé un nouveau quiz "Histoire de France"', time: 'Il y a 1 jour' },
		{ icon: 'fas fa-trophy', text: 'Félicitations ! Vous avez débloqué le badge "Quiz Master"', time: 'Il y a 3 jours' },
		{ icon: 'fas fa-chart-line', text: 'Votre score moyen a augmenté de 5% ce mois-ci', time: 'Il y a 1 semaine' }
	]);

	// Expérience
	level = signal(7);
	currentXp = signal(3400);
	nextLevelXp = signal(4000);
	xpPercent = signal(Math.min(100, Math.round((this.currentXp() / this.nextLevelXp()) * 100)));

	// Badges
	badgesUnlocked = signal<Badge[]>([
		{ name: 'Quiz Master', icon: 'fas fa-trophy', hint: 'Gagner 10 quiz au total' },
		{ name: 'Rapide', icon: 'fas fa-bolt', hint: 'Terminer un quiz en moins de 2 minutes' },
		{ name: 'Stratège', icon: 'fas fa-chess-knight', hint: 'Réussir 5 quiz d\'affilée' },
		{ name: 'Endurant', icon: 'fas fa-heart', hint: 'Jouer 50 quiz' }
	]);

	badgesLocked = signal<Badge[]>([
		{ name: 'Collectionneur', icon: 'fas fa-certificate', hint: 'Débloquer 10 badges' },
		{ name: 'Champion', icon: 'fas fa-medal', hint: 'Atteindre un score moyen de 90%' },
		{ name: 'Incassable', icon: 'fas fa-shield-alt', hint: 'Ne jamais abandonner un quiz pendant 7 jours' },
		{ name: 'Érudit', icon: 'fas fa-graduation-cap', hint: 'Réussir 20 quiz difficiles' }
	]);

	getUnlockedBadgeTitle(b: Badge): string {
		return `Débloqué: ${b.name} — ${b.hint ?? 'Badge obtenu grâce à vos performances'}`;
	}

	getLockedBadgeTitle(b: Badge): string {
		return `À débloquer: ${b.name} — ${b.hint ?? 'Atteignez l\'objectif indiqué pour débloquer ce badge'}`;
	}

	// Fonctions pour l'accessibilité
	trackByBadge(index: number, badge: Badge): string {
		return badge.name;
	}

	trackByActivity(index: number, activity: any): string {
		return activity.text + activity.time;
	}

	getActivityDateTime(timeString: string): string {
		// Convertit les descriptions de temps en dates ISO pour l'accessibilité
		const now = new Date();
		if (timeString.includes('heures')) {
			const hours = parseInt(timeString.match(/(\d+)/)?.[1] || '0');
			now.setHours(now.getHours() - hours);
		} else if (timeString.includes('jour')) {
			const days = parseInt(timeString.match(/(\d+)/)?.[1] || '0');
			now.setDate(now.getDate() - days);
		} else if (timeString.includes('semaine')) {
			const weeks = parseInt(timeString.match(/(\d+)/)?.[1] || '0');
			now.setDate(now.getDate() - (weeks * 7));
		}
		return now.toISOString();
	}

	navigateTo(route: string) {
		this.router.navigate([`/tableau-de-bord/${route}`]);
	}
}


