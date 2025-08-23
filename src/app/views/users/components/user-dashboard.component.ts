import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../../../interfaces/user';

interface Badge { name: string; icon: string; hint?: string; }

@Component({
  selector: 'app-user-dashboard',
	imports: [CommonModule],
	template: `
		<div class="home-container">
			<div class="home-content p-10">
				<header class="text-center mb-20">
					<h1 class="text-xlg text-bold mb-10">Tableau de bord</h1>
					<p class="text-sm">Bienvenue dans votre espace personnel, {{ currentUser()?.firstName }} !</p>
				</header>

				<!-- Statistiques -->
				<section class="mt-20 card card-shadow" role="region" aria-label="Statistiques personnelles">
					<div class="flex flex-wrap gap-16">
						<article class="card w-full field text-center card-white card-hover" role="article">
							<div class="text-lg text-bold" aria-label="Nombre de quiz joués">{{ currentUser()?.totalPlays || 0 }}</div>
							<div class="text-sm">Quiz joués</div>
						</article>
						<article class="card w-full field text-center card-white card-hover" role="article">
							<div class="text-lg text-bold" aria-label="Score moyen">{{ currentUser()?.averageScore || 0 }}%</div>
							<div class="text-sm">Score moyen</div>
						</article>
						<article class="card w-full field text-center card-white card-hover" role="article">
							<div class="text-lg text-bold" aria-label="Nombre de quiz créés">{{ currentUser()?.quizzesCreated || 0 }}</div>
							<div class="text-sm">Quiz créés</div>
						</article>
						<article class="card w-full field text-center card-white card-hover" role="article">
							<div class="text-lg text-bold" aria-label="Plan actuel">{{ currentUser()?.plan || 'Gratuit' }}</div>
							<div class="text-sm">Plan actuel</div>
						</article>
					</div>
				</section>

				<!-- Actions rapides -->
				<section class="mt-20" role="region" aria-label="Actions rapides">
					<h2 class="text-lg text-bold mb-20 text-center">Actions rapides</h2>
					<div class="flex flex-wrap gap-16">
						<button (click)="navigateTo('creer-quiz')" class="card card-white card-hover text-center flex flex-col justify-content-between" aria-label="Créer un quiz">
							<div class="text-primary text-lg">
								<i class="fas fa-plus-circle"></i>
							</div>
							<div>
								<h3 class="text-semibold mb-10">Créer un quiz</h3>
								<p class="text-sm">Créez votre propre quiz et partagez-le avec la communauté</p>
							</div>
						</button>

						<button (click)="navigateTo('statistiques')" class="card card-white card-hover text-center flex flex-col justify-content-between" aria-label="Voir mes statistiques">
							<div class="text-primary text-lg">
								<i class="fas fa-chart-line"></i>
							</div>
							<div>
								<h3 class="text-semibold mb-10">Voir mes stats</h3>
								<p class="text-sm">Analysez vos performances et votre progression</p>
							</div>
						</button>

						<button (click)="navigateTo('profil')" class="card card-white card-hover text-center flex flex-col justify-content-between" aria-label="Modifier mon profil">
							<div class="text-primary text-lg">
								<i class="fas fa-user-edit"></i>
							</div>
							<div>
								<h3 class="text-semibold mb-10">Modifier mon profil</h3>
								<p class="text-sm">Mettez à jour vos informations personnelles</p>
							</div>
						</button>

						<button (click)="navigateTo('abonnement')" class="card card-white card-hover text-center flex flex-col justify-content-between" aria-label="Gérer l'abonnement">
							<div class="text-primary text-lg">
								<i class="fas fa-credit-card"></i>
							</div>
							<div>
								<h3 class="text-semibold mb-10">Gérer l'abonnement</h3>
								<p class="text-sm">Passez à un plan supérieur pour plus de fonctionnalités</p>
							</div>
						</button>
					</div>
				</section>

				<!-- Expérience -->
				<section class="mt-20 card card-shadow" role="region" aria-label="Progression d'expérience">
					<div class="flex justify-content-between align-items-center mb-20">
						<h2 class="text-lg text-bold">Mon expérience</h2>
						<span class="badge-info">Niveau {{ level() }}</span>
					</div>
					<div class="experience-bar" role="progressbar" aria-valuemin="0" [attr.aria-valuenow]="xpPercent()" aria-valuemax="100" [attr.aria-label]="'Progression niveau: ' + xpPercent() + '%'">
						<div class="experience-fill" [style.width.%]="xpPercent()"></div>
					</div>
					<div class="flex justify-content-between mt-10">
						<span class="text-sm">XP: {{ currentXp() }} / {{ nextLevelXp() }}</span>
						<span class="text-sm">Reste: {{ nextLevelXp() - currentXp() }} XP</span>
					</div>
				</section>

				<!-- Badges -->
				<section class="mt-20" role="region" aria-label="Badges et récompenses">
					<div class="flex flex-wrap gap-16">
						<div class="card card-white flex-1">
							<h2 class="text-lg text-bold mb-20">Badges gagnés</h2>
							<div class="flex flex-wrap gap-12">
								<div *ngFor="let b of badgesUnlocked()" class="badge-chip badge-chip--unlocked" [title]="getUnlockedBadgeTitle(b)">
									<i [class]="b.icon"></i>
									<span class="text-sm">{{ b.name }}</span>
								</div>
							</div>
						</div>
						<div class="card card-white flex-1">
							<h2 class="text-lg text-bold mb-20">À débloquer</h2>
							<div class="flex flex-wrap gap-12">
								<div *ngFor="let b of badgesLocked()" class="badge-chip badge-chip--locked" [title]="getLockedBadgeTitle(b)">
									<i [class]="b.icon"></i>
									<span class="text-sm">{{ b.name }}</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- Activité récente -->
				<section class="mt-20 card card-shadow" role="region" aria-label="Activité récente">
					<h2 class="text-lg text-bold mb-20">Activité récente</h2>
					<div class="activity-list">
						<div *ngFor="let activity of recentActivities()" class=" flex align-items-center gap-16 p-25 activity-item">
							<div class="flex align-items-center justify-centent-center activity-icon">
								<i [class]="activity.icon"></i>
							</div>
							<div class="activity-content">
								<p class="activity-text">{{ activity.text }}</p>
								<span class="activity-time text-sm">{{ activity.time }}</span>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
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

	navigateTo(route: string) { this.router.navigate([`/tableau-de-bord/${route}`]); }
}


