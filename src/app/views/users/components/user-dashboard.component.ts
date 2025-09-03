import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-user-dashboard',
	imports: [CommonModule],
	template: `
		<main class="home-container" role="main" aria-labelledby="dashboard-title">
			<div class="home-content p-10">
				<header class="text-center mb-20">
					<h1 id="dashboard-title" class="text-xlg text-bold mb-10">Tableau de bord</h1>
					<p class="text-sm" aria-live="polite">Bienvenue dans votre espace personnel, {{ dashboardService.currentUser()?.firstName }} !</p>
				</header>

				<!-- Statistiques -->
				<section class="mt-20 card card-shadow" role="region" aria-labelledby="stats-title">
					<h2 id="stats-title" class="sr-only">Statistiques personnelles</h2>
					<div class="flex flex-wrap gap-16" role="list" aria-label="Statistiques de l'utilisateur">
						<article class="card w-full field text-center card-white card-hover" role="listitem" tabindex="0">
							<div class="text-lg text-bold" aria-label="Nombre de quiz joués" aria-describedby="quiz-joues-desc">{{ dashboardService.userStats()?.totalPlays || 0 }}</div>
							<div id="quiz-joues-desc" class="text-sm">Quiz joués</div>
						</article>
						<article class="card w-full field text-center card-white card-hover" role="listitem" tabindex="0">
							<div class="text-lg text-bold" aria-label="Score moyen" aria-describedby="score-moyen-desc">{{ dashboardService.userStats()?.averageScore || 0 }}%</div>
							<div id="score-moyen-desc" class="text-sm">Score moyen</div>
						</article>
						<article class="card w-full field text-center card-white card-hover" role="listitem" tabindex="0">
							<div class="text-lg text-bold" aria-label="Nombre de quiz créés" aria-describedby="quiz-crees-desc">{{ dashboardService.userStats()?.quizzesCreated || 0 }}</div>
							<div id="quiz-crees-desc" class="text-sm">Quiz créés</div>
						</article>
						<article class="card w-full field text-center card-white card-hover" role="listitem" tabindex="0">
							<div class="text-lg text-bold" aria-label="Plan actuel" aria-describedby="plan-actuel-desc">{{ dashboardService.userStats()?.plan || 'Gratuit' }}</div>
							<div id="plan-actuel-desc" class="text-sm">Plan actuel</div>
						</article>
					</div>
				</section>

				<!-- Actions rapides -->
				<section class="mt-20" role="region" aria-labelledby="actions-title">
					<h2 id="actions-title" class="text-lg text-bold mb-20 text-center">Actions rapides</h2>
					<div class="flex flex-wrap gap-16 justify-content-center  " role="list" aria-label="Actions rapides disponibles">
						@for (action of dashboardService.availableActions(); track dashboardService.trackByAction($index, action)) {
							<button
								(click)="navigateTo(action.route)"
								(keydown.enter)="navigateTo(action.route)"
								(keydown.space)="navigateTo(action.route)"
								class="card card-white card-hover text-center flex flex-col justify-content-between"
								[attr.aria-label]="action.title"
								[attr.aria-describedby]="'action-desc-' + action.id"
								role="listitem"
								tabindex="0">
								<div class="text-primary text-lg" aria-hidden="true">
									<i [class]="action.icon"></i>
								</div>
								<div>
									<h3 class="text-semibold mb-10">{{ action.title }}</h3>
									<p [id]="'action-desc-' + action.id" class="text-sm">{{ action.description }}</p>
								</div>
							</button>
						}
					</div>
				</section>

				<!-- Expérience -->
				<section class="mt-20 card card-shadow" role="region" aria-labelledby="experience-title">
					<div class="flex justify-content-between align-items-center mb-20">
						<h2 id="experience-title" class="text-lg text-bold">Mon expérience</h2>
						<span class="badge-info" aria-label="Niveau actuel">Niveau: {{ dashboardService.userExperience()?.level || 1 }}</span>
					</div>
					<div
						class="experience-bar"
						role="progressbar"
						aria-valuemin="0"
						[attr.aria-valuenow]="dashboardService.userExperience()?.xpPercent || 0"
						aria-valuemax="100"
						[attr.aria-valuetext]="'Progression: ' + (dashboardService.userExperience()?.xpPercent || 0) + '%. ' + (dashboardService.userExperience()?.currentXp || 0) + ' points d experience sur ' + (dashboardService.userExperience()?.nextLevelXp || 0) + ' requis pour le niveau suivant.'"
						aria-labelledby="experience-title">
						<div class="experience-fill" [style.width.%]="dashboardService.userExperience()?.xpPercent || 0" aria-hidden="true"></div>
					</div>
					<div class="flex justify-content-between mt-10" aria-live="polite">
						<span class="text-sm">XP: {{ dashboardService.userExperience()?.currentXp || 0 }} / {{ dashboardService.userExperience()?.nextLevelXp || 0 }}</span>
						<span class="text-sm">Reste: {{ (dashboardService.userExperience()?.nextLevelXp || 0) - (dashboardService.userExperience()?.currentXp || 0) }} XP</span>
					</div>
				</section>

				<!-- Badges -->
				<section class="mt-20" role="region" aria-labelledby="badges-title">
					<h2 id="badges-title" class="sr-only">Badges et récompenses</h2>
					<div class="flex flex-wrap gap-16">
						<div class="card card-white flex-1" role="region" aria-labelledby="badges-unlocked-title">
							<h3 id="badges-unlocked-title" class="text-lg text-bold mb-20">Badges gagnés</h3>
							<div class="flex flex-wrap gap-12" role="list" aria-label="Badges débloqués">
								@for (badge of dashboardService.unlockedBadges(); track dashboardService.trackByBadge($index, badge)) {
									<div
										class="badge-chip badge-chip--unlocked"
										[title]="dashboardService.getBadgeTitle(badge)"
										role="listitem"
										tabindex="0"
										[attr.aria-label]="'Badge débloqué: ' + badge.name"
										[attr.aria-describedby]="'badge-desc-' + badge.id">
										<i [class]="badge.icon" aria-hidden="true"></i>
										<span class="text-sm">{{ badge.name }}</span>
										<span [id]="'badge-desc-' + badge.id" class="sr-only">{{ badge.hint || 'Badge obtenu grâce à vos performances' }}</span>
									</div>
								}
							</div>
						</div>
						<div class="card card-white flex-1" role="region" aria-labelledby="badges-locked-title">
							<h3 id="badges-locked-title" class="text-lg text-bold mb-20">À débloquer</h3>
							<div class="flex flex-wrap gap-12" role="list" aria-label="Badges à débloquer">
								@for (badge of dashboardService.lockedBadges(); track dashboardService.trackByBadge($index, badge)) {
									<div
										class="badge-chip badge-chip--locked"
										[title]="dashboardService.getBadgeTitle(badge)"
										role="listitem"
										tabindex="0"
										[attr.aria-label]="'Badge à débloquer: ' + badge.name"
										[attr.aria-describedby]="'badge-locked-desc-' + badge.id">
										<i [class]="badge.icon" aria-hidden="true"></i>
										<span class="text-sm">{{ badge.name }}</span>
										<span [id]="'badge-locked-desc-' + badge.id" class="sr-only">{{ badge.hint || 'Atteignez l\'objectif indiqué pour débloquer ce badge' }}</span>
									</div>
								}
							</div>
						</div>
					</div>
				</section>

				<!-- Activité récente -->
				<section class="mt-20 card card-shadow" role="region" aria-labelledby="activity-title">
					<h2 id="activity-title" class="text-lg text-bold mb-20">Activité récente</h2>
					<div class="activity-list" role="list" aria-label="Activités récentes">
						@for (activity of dashboardService.activities(); track dashboardService.trackByActivity($index, activity)) {
							<div
								class="flex align-items-center gap-16 p-25 activity-item"
								role="listitem"
								tabindex="0">
								<div class="flex align-items-center justify-content-center activity-icon" aria-hidden="true">
									<i [class]="activity.icon"></i>
								</div>
								<div class="activity-content">
									<p class="activity-text">{{ activity.text }}</p>
									<time class="activity-time text-sm" [attr.datetime]="dashboardService.getActivityDateTime(activity.time)">{{ activity.time }}</time>
								</div>
							</div>
						}
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
  protected dashboardService = inject(DashboardService);

	navigateTo(route: string) {
		this.router.navigate([`/tableau-de-bord/${route}`]);
	}
}


