import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { SearchBarComponent } from './components/searchbar.component';
import { StatBarComponent } from './components/statbar.component';
import { PopularQuizComponent } from './components/popularquiz.component';



@Component({
  selector: 'app-accueil',
  imports: [CommonModule, SearchBarComponent, StatBarComponent, PopularQuizComponent],
  template: `
  <div class="home-container">
    <div class="home-content">
      <div class="text-center mb-20">
        <h1 class="text-xlg text-bold mb-10">Bienvenue sur QuizArena</h1>
        <p class="text-sm">Découvrez des milliers de quiz passionnants et testez vos connaissances dans tous les domaines</p>
      </div>
      <!-- Barre de recherche -->
      <app-searchbar (searchChanged)="onSearchChanged($event)"></app-searchbar>
      <!-- Composant Statbar -->
      <app-statbar></app-statbar>
      <!-- Composant PopularQuiz -->
      <app-popularquiz
        [searchTerm]="searchTerm()"
        [categoryFilter]="categoryFilter()"
        [difficultyFilter]="difficultyFilter()">
      </app-popularquiz>
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
