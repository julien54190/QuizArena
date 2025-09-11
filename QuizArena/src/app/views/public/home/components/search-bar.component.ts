import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeService } from '../../../../services/home.service';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card card-shadow mt-20" role="search">
      <div class="flex flex-wrap gap-16">
        <div class="field">
          <label for="search-input" class="sr-only">Rechercher un quiz</label>
          <input
            id="search-input"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange()"
            type="text"
            placeholder="Rechercher un quiz..."
            class="flex-item search-bar w-full"
            aria-label="Rechercher un quiz par nom ou description"
          />
        </div>

        <div class="field">
          <label for="category-select" class="sr-only">Filtrer par catégorie</label>
          <select
            id="category-select"
            [(ngModel)]="categoryFilter"
            (ngModelChange)="onSearchChange()"
            class="flex-item search-bar w-full"
            aria-label="Filtrer par catégorie"
          >
            <option value="">Toutes les catégories</option>
            @for (cat of homeService.categories(); track cat.name) {
              <option [value]="cat.name">{{ cat.name }}</option>
            }
          </select>
        </div>

        <div class="field">
          <label for="difficulty-select" class="sr-only">Filtrer par difficulté</label>
          <select
            id="difficulty-select"
            [(ngModel)]="difficultyFilter"
            (ngModelChange)="onSearchChange()"
            class="flex-item search-bar w-full"
            aria-label="Filtrer par niveau de difficulté"
          >
            <option value="">Toutes difficultés</option>
            <option value="facile">Facile</option>
            <option value="moyen">Moyen</option>
            <option value="difficile">Difficile</option>
          </select>
        </div>

        <div class="field">
          <label for="questions-select" class="sr-only">Filtrer par nombre de questions</label>
          <select
            id="questions-select"
            [(ngModel)]="minQuestions"
            (ngModelChange)="onSearchChange()"
            class="flex-item search-bar w-full"
            aria-label="Filtrer par nombre minimum de questions"
          >
            <option value="0">Min questions</option>
            <option value="5">5+ questions</option>
            <option value="10">10+ questions</option>
            <option value="15">15+ questions</option>
            <option value="20">20+ questions</option>
          </select>
        </div>

        <div class="field">
          <label for="score-select" class="sr-only">Filtrer par score minimum</label>
          <select
            id="score-select"
            [(ngModel)]="minScore"
            (ngModelChange)="onSearchChange()"
            class="flex-item search-bar w-full"
            aria-label="Filtrer par score minimum"
          >
            <option value="0">Min score</option>
            <option value="50">50%+</option>
            <option value="60">60%+</option>
            <option value="70">70%+</option>
            <option value="80">80%+</option>
          </select>
        </div>

        <div class="flex justify-content-center w-full">
          <button
            (click)="resetFilters()"
            class="btn btn-outline-primary text-semibold"
            aria-label="Réinitialiser tous les filtres de recherche"
            type="button"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {flex: 1; display: block; }
  `
})
export class SearchBarComponent {
  homeService = inject(HomeService);

  // Propriétés pour les filtres
  searchQuery: string = '';
  categoryFilter: string = '';
  difficultyFilter: string = '';
  minQuestions: number = 0;
  minScore: number = 0;

  constructor() {
    // Initialiser les valeurs avec celles du service
    this.searchQuery = this.homeService.searchTerm();
    this.categoryFilter = this.homeService.categoryFilter();
    this.difficultyFilter = this.homeService.difficultyFilter();
    this.minQuestions = this.homeService.minQuestions();
    this.minScore = this.homeService.minScore();
  }

  // Méthode appelée quand la recherche change
  onSearchChange() {
    this.homeService.updateSearchFilters({
      searchTerm: this.searchQuery,
      categoryFilter: this.categoryFilter,
      difficultyFilter: this.difficultyFilter,
      minQuestions: Number(this.minQuestions),
      minScore: Number(this.minScore)
    });
  }

  // Méthode pour réinitialiser les filtres
  resetFilters() {
    this.homeService.resetFilters();
    this.searchQuery = '';
    this.categoryFilter = '';
    this.difficultyFilter = '';
    this.minQuestions = 0;
    this.minScore = 0;
  }
}
