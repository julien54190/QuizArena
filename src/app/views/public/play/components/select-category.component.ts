import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../../../../services/home.service';
import { ICategory } from '../../../../interfaces/category';

@Component({
  selector: 'app-select-category',
  imports: [],
  template: `
    <section class="mt-20 card card-shadow" role="main" aria-labelledby="category-title">
      <h2 id="category-title" class="text-center text-xlg">Choisissez une catégorie</h2>
      <p class="text-sm text-center" id="category-description">Sélectionnez le thème qui vous intéresse pour découvrir nos quiz</p>

      <div class="flex flex-wrap gap-16 filed w-full justify-content-center"
          role="grid"
          aria-label="Liste des catégories de quiz"
          aria-describedby="category-description">
        @for (category of categories(); track category.id) {
          <div (click)="selectCategory(category)"
              (keydown.enter)="selectCategory(category)"
              (keydown.space)="selectCategory(category)"
              class="card card-white mt-10 card-size text-center flex flex-col justify-content-between card-hover"
              role="gridcell"
              tabindex="0"
              [attr.aria-label]="'Catégorie ' + category.name + ', ' + category.quizCount + ' quiz disponibles'"
              [attr.aria-describedby]="'desc-' + category.id">
            <span aria-hidden="true">{{ category.icon }}</span>
            <div>
              <h3>{{ category.name }}</h3>
              <p [id]="'desc-' + category.id">{{ category.description }}</p>
                            <span class="badge-info" [attr.aria-label]="category.quizCount + ' quiz disponibles'">{{ category.quizCount }} quiz disponibles</span>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: ``
})
export class SelectCategoryComponent {
  private homeService = inject(HomeService);
  private router = inject(Router);

  // Données exposées
  categories = this.homeService.categories;

  // Méthodes
  selectCategory(category: ICategory): void {
    console.log('Navigation vers la catégorie:', category.name);
    this.router.navigate(['/jouer', category.id]);
  }
}



