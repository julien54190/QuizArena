import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../interfaces/category';
import { CATEGORIES_DATA } from '../../data/categories.data';


@Component({
  selector: 'app-accueil',
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div>
        <!-- Barre de recherche -->
          <div>
            <div>
              <input
              [(ngModel)]="searchQuery"
              (ngModelChange)="searchTerm.set($event); filterQuizzes()"
              type="text"
              placeholder="Rechercher un quiz..."
              class=""
              />
              <select [ngModel]="categoryFilter()" (ngModelChange)="categoryFilter.set($event); filterQuizzes()" class="">
              <option value="">Toutes les catégories</option>
              @for (cat of categories(); track cat.name) {
                <option [value]="cat.name">{{ cat.name }}</option>
              }
            </select>
              <select [ngModel]="difficultyFilter()" (ngModelChange)="difficultyFilter.set($event); filterQuizzes()" class="">
              <option value="">Toutes difficultés</option>
              <option value="facile">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
            </select>
            <select [ngModel]="minQuestions()" (ngModelChange)="minQuestions.set($event); filterQuizzes()" class="">
              <option value="0">Min questions</option>
              <option value="5">5+ questions</option>
              <option value="10">10+ questions</option>
              <option value="15">15+ questions</option>
              <option value="20">20+ questions</option>
            </select>
            <select [ngModel]="minScore()" (ngModelChange)="minScore.set($event); filterQuizzes()" class="">
              <option value="0">Min score</option>
              <option value="50">50%+</option>
              <option value="60">60%+</option>
              <option value="70">70%+</option>
              <option value="80">80%+</option>
            </select>
            <button (click)="resetFilters()" class="">Reset</button>
            </div>
          </div>
      </div>
    </div>
  `,
  styles: ``
})
export class AccueilComponent {
  // Signals pour les filtre
  searchTerm = signal('');
  categoryFilter = signal('');
  difficultyFilter = signal('');
  minQuestions = signal(0);
  minScore = signal(0);

  // Liste des catégories
  categories = signal<Category[]>(CATEGORIES_DATA)

  // Query de recherche
  searchQuery: string = '';

  filterQuizzes() {}

  resetFilters() {
    this.searchTerm.set('');
    this.categoryFilter.set('');
    this.difficultyFilter.set('');
    this.minQuestions.set(0);
    this.minScore.set(0);
    this.searchQuery = '';
  }

}
