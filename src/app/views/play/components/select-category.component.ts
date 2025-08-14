import { Component, inject } from '@angular/core';
import { HomeService } from '../../../services/home.service';
import { ICategory } from '../../../interfaces/category';

@Component({
  selector: 'app-select-category',
  imports: [],
  template: `
    <section class="mt-20 card card-shadow">
      <h2 class="text-center text-xlg">Choisissez une catégorie</h2>
      <p class="text-sm text-center">Sélectionnez le thème qui vous intéresse pour découvrir nos quiz</p>
      <div class="flex flex-wrap gap-16 filed w-full justify-content-center">
              @for (category of categories(); track category.id) {
        <div (click)="selectCategory(category)"
        class="card card-white mt-10 card-size text-center flex flex-col justify-content-between card-hover">
          <span>{{ category.icon }}</span>
          <div>
            <h3>{{ category.name }}</h3>
            <p>{{ category.description }}</p>
            <span class="badge-info">{{ category.quizCount }} quiz disponibles</span>
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

    // Données exposées
    categories = this.homeService.categories;

    // Méthodes
    selectCategory(category: ICategory): void {
      console.log('Navigation vers la catégorie:', category.name);

    }
}
