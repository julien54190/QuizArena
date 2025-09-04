import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-best-players',
  imports: [CommonModule],
  template: `
  <section class="mt-20 card card-shadow" role="region" aria-labelledby="best-players-title">
    <h2 id="best-players-title" class="text-center text-xlg">Meilleurs joueurs</h2>
    <div class="flex flex-wrap gap-16 filed w-full justify-content-center" role="list" aria-label="Classement des meilleurs joueurs">
      <!-- 1er place -->
      @if (topPlayers().length > 0) {
        <article
          class="card card-white mt-10 card-size text-center flex flex-col justify-content-between card-hover"
          role="listitem"
          (click)="navigateToProfile(topPlayers()[0].id)"
          (keydown.enter)="navigateToProfile(topPlayers()[0].id)"
          (keydown.space)="navigateToProfile(topPlayers()[0].id)"
          tabindex="0"
          [attr.aria-label]="'Voir le profil de ' + topPlayers()[0].firstName + ' ' + topPlayers()[0].lastName + ' - 1er place'">
          <div role="img" aria-label="Médaille d'or - 1er place">🥇</div>
          <h3>{{ topPlayers()[0].firstName }} {{ topPlayers()[0].lastName }}</h3>
          <div>
            <div>Score moyen: <strong>{{ topPlayers()[0].averageScore }}%</strong></div>
            <div>Parties jouées: <strong>{{ topPlayers()[0].totalPlays }}</strong></div>
            <div>Quiz créés: <strong>{{ topPlayers()[0].quizzesCreated }}</strong></div>
          </div>
        </article>
      }

      <!-- 2ème place -->
      @if (topPlayers().length > 1) {
        <article
          class="card card-white mt-10 card-size text-center flex flex-col justify-content-between card-hover"
          role="listitem"
          (click)="navigateToProfile(topPlayers()[1].id)"
          (keydown.enter)="navigateToProfile(topPlayers()[1].id)"
          (keydown.space)="navigateToProfile(topPlayers()[1].id)"
          tabindex="0"
          [attr.aria-label]="'Voir le profil de ' + topPlayers()[1].firstName + ' ' + topPlayers()[1].lastName + ' - 2ème place'">
          <div role="img" aria-label="Médaille d'argent - 2ème place">🥈</div>
          <h3>{{ topPlayers()[1].firstName }} {{ topPlayers()[1].lastName }}</h3>
          <div>
            <div>Score moyen: <strong>{{ topPlayers()[1].averageScore }}%</strong></div>
            <div>Parties jouées: <strong>{{ topPlayers()[1].totalPlays }}</strong></div>
            <div>Quiz créés: <strong>{{ topPlayers()[1].quizzesCreated }}</strong></div>
          </div>
        </article>
      }

      <!-- 3ème place -->
      @if (topPlayers().length > 2) {
        <article
          class="card card-white mt-10 card-size text-center flex flex-col justify-content-between card-hover"
          role="listitem"
          (click)="navigateToProfile(topPlayers()[2].id)"
          (keydown.enter)="navigateToProfile(topPlayers()[2].id)"
          (keydown.space)="navigateToProfile(topPlayers()[2].id)"
          tabindex="0"
          [attr.aria-label]="'Voir le profil de ' + topPlayers()[2].firstName + ' ' + topPlayers()[2].lastName + ' - 3ème place'">
          <div role="img" aria-label="Médaille de bronze - 3ème place">🥉</div>
          <h3>{{ topPlayers()[2].firstName }} {{ topPlayers()[2].lastName }}</h3>
          <div>
            <div>Score moyen: <strong>{{ topPlayers()[2].averageScore }}%</strong></div>
            <div>Parties jouées: <strong>{{ topPlayers()[2].totalPlays }}</strong></div>
            <div>Quiz créés: <strong>{{ topPlayers()[2].quizzesCreated }}</strong></div>
          </div>
        </article>
      }
    </div>
  </section>
  `,
  styles: [`
    .card-hover {
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .card-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .card-hover:focus {
      outline: 2px solid #007bff;
      outline-offset: 2px;
    }
  `]
})
export class BestPlayersComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  // Top 3 des meilleurs joueurs depuis le service
  topPlayers = this.userService.topPlayers;

  // Méthode pour naviguer vers le profil d'un utilisateur
  navigateToProfile(userId: number) {
    this.router.navigate(['/profil', userId]);
  }
}
