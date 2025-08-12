import { CommonModule } from '@angular/common';
import { Component, signal, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICategory } from '../../../interfaces/category';
import { CATEGORIES_DATA } from '../../../data/categories.data';

@Component({
  selector: 'app-searchbar',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="home-panel p-25 card" role="search">
      <div class="flex flex-wrap gap-16">
        <div class="search-field">
          <label for="search-input" class="sr-only">Rechercher un quiz</label>
          <input
            id="search-input"
            [(ngModel)]="searchQuery"
            (ngModelChange)="searchTerm.set($event); onSearchChange()"
            type="text"
            placeholder="Rechercher un quiz..."
            class="flex-item search-bar w-full"
            aria-label="Rechercher un quiz par nom ou description"
          />
        </div>

        <div class="search-field">
          <label for="category-select" class="sr-only">Filtrer par catégorie</label>
          <select
            id="category-select"
            [ngModel]="categoryFilter()"
            (ngModelChange)="categoryFilter.set($event); onSearchChange()"
            class="flex-item search-bar w-full"
            aria-label="Filtrer par catégorie"
          >
            <option value="">Toutes les catégories</option>
            @for (cat of categories(); track cat.name) {
              <option [value]="cat.name">{{ cat.name }}</option>
            }
          </select>
        </div>

        <div class="search-field">
          <label for="difficulty-select" class="sr-only">Filtrer par difficulté</label>
          <select
            id="difficulty-select"
            [ngModel]="difficultyFilter()"
            (ngModelChange)="difficultyFilter.set($event); onSearchChange()"
            class="flex-item search-bar w-full"
            aria-label="Filtrer par niveau de difficulté"
          >
            <option value="">Toutes difficultés</option>
            <option value="facile">Facile</option>
            <option value="moyen">Moyen</option>
            <option value="difficile">Difficile</option>
          </select>
        </div>

        <div class="search-field">
          <label for="questions-select" class="sr-only">Filtrer par nombre de questions</label>
          <select
            id="questions-select"
            [ngModel]="minQuestions()"
            (ngModelChange)="minQuestions.set($event); onSearchChange()"
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

        <div class="search-field">
          <label for="score-select" class="sr-only">Filtrer par score minimum</label>
          <select
            id="score-select"
            [ngModel]="minScore()"
            (ngModelChange)="minScore.set($event); onSearchChange()"
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
  // Signals pour les filtres
  searchTerm = signal('');
  categoryFilter = signal('');
  difficultyFilter = signal('');
  minQuestions = signal(0);
  minScore = signal(0);

  // Liste des catégories
  categories = signal<ICategory[]>(CATEGORIES_DATA);

  // Propriété pour la recherche
  searchQuery: string = '';

  // Output pour communiquer avec le parent
  @Output() searchChanged = new EventEmitter<{
    searchTerm: string;
    categoryFilter: string;
    difficultyFilter: string;
    minQuestions: number;
    minScore: number;
  }>();

  // Méthode appelée quand les filtres changent
  onSearchChange() {
    this.searchChanged.emit({
      searchTerm: this.searchTerm(),
      categoryFilter: this.categoryFilter(),
      difficultyFilter: this.difficultyFilter(),
      minQuestions: this.minQuestions(),
      minScore: this.minScore()
    });
  }

  // Méthode pour réinitialiser les filtres
  resetFilters() {
    this.searchTerm.set('');
    this.categoryFilter.set('');
    this.difficultyFilter.set('');
    this.minQuestions.set(0);
    this.minScore.set(0);
    this.searchQuery = '';
    this.onSearchChange();
  }
}
