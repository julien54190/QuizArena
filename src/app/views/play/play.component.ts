import { Component } from '@angular/core';
import { SelectCategoryComponent } from "./components/select-category.component";

@Component({
  selector: 'app-play',
  imports: [SelectCategoryComponent],
  template: `
  <header class="home-container">
    <div class="home-content">
      <div class="text-center mb-20">
        <h1 class="text-xlg text-bold mb-10">Jouer aux Quiz</h1>
        <p class="text-sm">      Choisissez une catégorie, sélectionnez un quiz et testez vos connaissances !
        Relevez le défi et améliorez votre score.</p>
      </div>
      <app-select-category></app-select-category>
    </div>
  </header>

  `,
  styles: ``
})
export class PlayComponent {

}
