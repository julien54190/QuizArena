import { Component, inject } from '@angular/core';
import { HomeService } from '../../../../services/home.service';

@Component({
  selector: 'app-stat-bar',
  imports: [],
  template: `
  <section class="mt-20 card card-shadow" role="region" aria-label="Statistiques de QuizArena">
    <div class="flex flex-wrap gap-16">
      <article class="card w-full field text-center card-white" role="article">
        <div class="text-lg text-bold" aria-label="Nombre total de quiz disponibles">{{ totalQuizzes() }}</div>
        <div>Quiz disponibles</div>
      </article>
      <article class="card w-full field text-center card-white" role="article">
        <div class="text-lg text-bold" aria-label="Nombre total de catégories">{{ totalCategories() }}</div>
        <div class="text-sm">Catégories</div>
      </article>
      <article class="card w-full field text-center card-white" role="article">
        <div class="text-lg text-bold" aria-label="Score moyen des utilisateurs">{{ averageScore() }}%</div>
        <div>Score moyen</div>
      </article>
      <article class="card w-full field text-center card-white" role="article">
        <div class="text-lg text-bold" aria-label="Nombre total de parties jouées">{{ totalPlays() }}</div>
        <div>Parties jouées</div>
      </article>
    </div>
  </section>
  `,
  styles: ``
})
export class StatBarComponent {
  private homeService = inject(HomeService);

  // Statistiques depuis le service
  totalQuizzes = this.homeService.totalQuizzes;
  totalCategories = this.homeService.totalCategories;
  averageScore = this.homeService.averageScore;
  totalPlays = this.homeService.totalPlays;
}
