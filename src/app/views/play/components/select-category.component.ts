import { Component, inject } from '@angular/core';
import { HomeService } from '../../../services/home.service';
import { ICategory } from '../../../interfaces/category';

@Component({
  selector: 'app-select-category',
  imports: [],
  template: `
    <section>
      <header>
        <h2>Choisissez une catégorie</h2>
        <p>Sélectionnez le thème qui vous intéresse pour découvrir nos quiz</p>
      </header>

      <div>
                @for (category of categories(); track category.id) {
          <div (click)="selectCategory(category)">
            <span>{{ category.icon }}</span>
            <div>
              <h3>{{ category.name }}</h3>
              <p>{{ category.description }}</p>
              <span>{{ category.quizCount }} quiz disponibles</span>
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
