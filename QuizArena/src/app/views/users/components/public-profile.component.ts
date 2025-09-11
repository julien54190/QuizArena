import { CommonModule } from '@angular/common';
import { Component, inject, Input, computed, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PublicProfileService } from '../../../services/public-profile.service';

@Component({
  selector: 'app-public-profile',
	imports: [CommonModule],
	template: `
		<main class="home-container" role="main" aria-labelledby="profile-title">
			<div class="home-content p-10">
				<header class="text-center mb-20">
					<div class="flex align-items-center justify-content-center gap-16 mb-10">
						<button
							(click)="goBack()"
							class="btn btn-outline-primary"
							aria-label="Retour">
							<i class="fas fa-arrow-left"></i>
						</button>
						<h1 id="profile-title" class="text-xlg text-bold">Profil de {{ profile()?.firstName }} {{ profile()?.lastName }}</h1>
					</div>
					<p class="text-sm" aria-live="polite">
						{{ '@' + profile()?.username }} • {{ profile()?.experience?.levelTitle }}
					</p>
				</header>

				<!-- Statistiques -->
				<section class="mt-20 card card-shadow" role="region" aria-labelledby="stats-title">
					<h2 id="stats-title" class="sr-only">Statistiques de {{ profile()?.firstName }}</h2>
					<div class="flex flex-wrap gap-16" role="list" aria-label="Statistiques de l'utilisateur">
						<article class="card w-full field text-center card-white card-hover" role="listitem" tabindex="0">
							<div class="text-lg text-bold" aria-label="Nombre de quiz joués" aria-describedby="quiz-joues-desc">{{ profile()?.stats?.totalPlays || 0 }}</div>
							<div id="quiz-joues-desc" class="text-sm">Quiz joués</div>
						</article>
						<article class="card w-full field text-center card-white card-hover" role="listitem" tabindex="0">
							<div class="text-lg text-bold" aria-label="Score moyen" aria-describedby="score-moyen-desc">{{ profile()?.stats?.averageScore || 0 }}%</div>
							<div id="score-moyen-desc" class="text-sm">Score moyen</div>
						</article>
						<article class="card w-full field text-center card-white card-hover" role="listitem" tabindex="0">
							<div class="text-lg text-bold" aria-label="Nombre de quiz créés" aria-describedby="quiz-crees-desc">{{ profile()?.stats?.quizzesCreated || 0 }}</div>
							<div id="quiz-crees-desc" class="text-sm">Quiz créés</div>
						</article>
						<article class="card w-full field text-center card-white card-hover" role="listitem" tabindex="0">
							<div class="text-lg text-bold" aria-label="Plan actuel" aria-describedby="plan-actuel-desc">{{ profile()?.stats?.plan || 'Gratuit' }}</div>
							<div id="plan-actuel-desc" class="text-sm">Plan actuel</div>
						</article>
					</div>
				</section>

				<!-- Expérience -->
				<section class="mt-20 card card-shadow" role="region" aria-labelledby="experience-title">
					<div class="flex justify-content-between align-items-center mb-20">
						<h2 id="experience-title" class="text-lg text-bold">Expérience</h2>
						<span class="badge-info" aria-label="Niveau actuel">niveau: {{ profile()?.experience?.level || 1 }}</span>
					</div>
					<div
						class="experience-bar"
						role="progressbar"
						aria-valuemin="0"
						[attr.aria-valuenow]="profile()?.experience?.xpPercent || 0"
						aria-valuemax="100"
						[attr.aria-valuetext]="'Progression: ' + (profile()?.experience?.xpPercent || 0) + '%. ' + (profile()?.experience?.currentXp || 0) + ' points d experience sur ' + (profile()?.experience?.nextLevelXp || 0) + ' requis pour le niveau suivant.'"
						aria-labelledby="experience-title">
						<div class="experience-fill" [style.width.%]="profile()?.experience?.xpPercent || 0" aria-hidden="true"></div>
					</div>
					<div class="flex justify-content-between mt-10" aria-live="polite">
						<span class="text-sm">XP: {{ profile()?.experience?.currentXp || 0 }} / {{ profile()?.experience?.nextLevelXp || 0 }}</span>
						<span class="text-sm">Reste: {{ (profile()?.experience?.nextLevelXp || 0) - (profile()?.experience?.currentXp || 0) }} XP</span>
					</div>
				</section>

				<!-- Badges -->
				<section class="mt-20" role="region" aria-labelledby="badges-title">
					<h2 id="badges-title" class="text-lg text-bold mb-20">Badges gagnés</h2>
					<div class="card card-white">
						<div class="flex flex-wrap gap-12" role="list" aria-label="Badges débloqués">
							@for (badge of profile()?.unlockedBadges; track publicProfileService.trackByBadge($index, badge)) {
								<div
									class="badge-chip badge-chip--unlocked"
									[title]="publicProfileService.getBadgeTitle(badge)"
									role="listitem"
									tabindex="0"
									[attr.aria-label]="'Badge débloqué: ' + badge.name"
									[attr.aria-describedby]="'badge-desc-' + badge.id">
									<i [class]="badge.icon" aria-hidden="true"></i>
									<span class="text-sm">{{ badge.name }}</span>
									<span [id]="'badge-desc-' + badge.id" class="sr-only">{{ badge.hint || 'Badge obtenu grâce aux performances' }}</span>
								</div>
							}
							@if (!profile()?.unlockedBadges?.length) {
								<div class="text-center w-full p-20">
									<p class="text-sm text-gray-600">Aucun badge débloqué pour le moment</p>
								</div>
							}
						</div>
					</div>
				</section>

				<!-- Activité récente -->
				<section class="mt-20 card card-shadow" role="region" aria-labelledby="activity-title">
					<h2 id="activity-title" class="text-lg text-bold mb-20">Activité récente</h2>
					<div class="activity-list" role="list" aria-label="Activités récentes">
						@for (activity of profile()?.recentActivities; track publicProfileService.trackByActivity($index, activity)) {
							<div
								class="flex align-items-center gap-16 p-25 activity-item"
								role="listitem"
								tabindex="0">
								<div class="flex align-items-center justify-content-center activity-icon" aria-hidden="true">
									<i [class]="activity.icon"></i>
								</div>
								<div class="activity-content">
									<p class="activity-text">{{ activity.text }}</p>
									<time class="activity-time text-sm" [attr.datetime]="activity.timestamp.toISOString()">{{ activity.time }}</time>
								</div>
							</div>
						}
						@if (!profile()?.recentActivities?.length) {
							<div class="text-center p-20">
								<p class="text-sm text-gray-600">Aucune activité récente</p>
							</div>
						}
					</div>
				</section>

				<!-- Actions pour le propriétaire du profil -->
				@if (profile()?.isOwnProfile) {
					<section class="mt-20" role="region" aria-labelledby="own-actions-title">
						<h2 id="own-actions-title" class="text-lg text-bold mb-20 text-center">Actions rapides</h2>
						<div class="flex justify-content-center">
							<button
								(click)="navigateToDashboard()"
								class="btn btn-primary"
								aria-label="Accéder à mon tableau de bord complet">
								<i class="fas fa-tachometer-alt"></i>
								Mon tableau de bord complet
							</button>
						</div>
					</section>
				}
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
export class PublicProfileComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected publicProfileService = inject(PublicProfileService);

  @Input() userId?: string;
  private routeUserId?: string;

  ngOnInit() {
    // Récupérer l'ID utilisateur depuis les paramètres de route
    this.route.params.subscribe(params => {
      this.routeUserId = params['userId'];
      if (this.routeUserId) {
        this.publicProfileService.setSelectedUser(this.routeUserId);
      }
    });
  }

  // Computed property pour le profil
  profile = computed(() => {
    if (this.userId) {
      return this.publicProfileService.getPublicProfile(this.userId);
    }
    if (this.routeUserId) {
      return this.publicProfileService.getPublicProfile(this.routeUserId);
    }
    return this.publicProfileService.getSelectedUserProfile();
  });

  goBack() {
    this.router.navigate(['/']);
  }

  navigateToDashboard() {
    this.router.navigate(['/tableau-de-bord']);
  }
}
