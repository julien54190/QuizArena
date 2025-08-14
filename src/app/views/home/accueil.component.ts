import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { PopularQuizComponent } from './components/popular-quiz.component';
import { SearchBarComponent } from './components/search-bar.component';
import { StatBarComponent } from './components/stat-bar.component';
import { BestPlayersComponent } from './components/best-players.component';




@Component({
  selector: 'app-accueil',
  imports: [CommonModule, SearchBarComponent, StatBarComponent, PopularQuizComponent, BestPlayersComponent],
  template: `
  <div class="home-container">
    <div class="home-content">
      <div class="text-center mb-20">
        <h1 class="text-xlg text-bold mb-10">Bienvenue sur QuizArena</h1>
        <p class="text-sm">Découvrez des milliers de quiz passionnants et testez vos connaissances dans tous les domaines</p>
      </div>
      <!-- Barre de recherche -->
      <app-search-bar (searchChanged)="onSearchChanged($event)"></app-search-bar>
      <!-- Composant Statbar -->
      <app-stat-bar></app-stat-bar>
      <!-- Composant PopularQuiz -->
      <app-popular-quiz
        [searchTerm]="searchTerm()"
        [categoryFilter]="categoryFilter()"
        [difficultyFilter]="difficultyFilter()">
      </app-popular-quiz>
      <!-- Composant BestPlayer -->
      <app-best-players></app-best-players>

    </div>
  </div>
  `,
  styles: `
    :host{display:block;}
  `
})
export class AccueilComponent {
  // Signals pour stocker les filtres
  searchTerm = signal('');
  categoryFilter = signal('');
  difficultyFilter = signal('');

  // Méthode pour recevoir les changements de recherche du composant enfant
  onSearchChanged(searchData: {
    searchTerm: string;
    categoryFilter: string;
    difficultyFilter: string;
    minQuestions: number;
    minScore: number;
  }) {
    this.searchTerm.set(searchData.searchTerm);
    this.categoryFilter.set(searchData.categoryFilter);
    this.difficultyFilter.set(searchData.difficultyFilter);
  }
}
