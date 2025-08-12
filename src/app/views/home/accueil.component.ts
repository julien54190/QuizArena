import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearchBarComponent } from './components/searchbar.component';
import { StatbarComponent } from "./components/statbar.component";


@Component({
  selector: 'app-accueil',
  imports: [CommonModule, SearchBarComponent, StatbarComponent],
  template: `
    <div class="home-container">
      <div class="home-content">
        <div class="text-center mb-20">
          <h1 class="text-xlg text-bold mb-10">Bienvenue sur QuizArena</h1>
          <p class="text-sm">Découvrez des milliers de quiz passionnants et testez vos connaissances dans tous les domaines</p>
        </div>
        <!-- Barre de recherche -->
        <app-searchbar (searchChanged)="onSearchChanged($event)" class="mt-20"></app-searchbar>
        <!-- Composant Statbar -->
        <app-statbar class="mt-20"></app-statbar>
      </div>
    </div>
  `,
  styles: `
    :host{display:block;}
  `
})
export class AccueilComponent {
  // Méthode pour recevoir les changements de recherche du composant enfant
  onSearchChanged(searchData: {
    searchTerm: string;
    categoryFilter: string;
    difficultyFilter: string;
    minQuestions: number;
    minScore: number;
  }) {}
}
