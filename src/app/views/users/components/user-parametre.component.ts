import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLayoutComponent } from '../shared/user-layout.component';

@Component({
  selector: 'app-user-parametre',
  standalone: true,
  imports: [CommonModule, UserLayoutComponent],
  template: `
    <app-user-layout>
      <main class="home-container" role="main" aria-labelledby="coming-title">
        <div class="home-content p-10">
          <section class="card card-shadow text-center" role="region" aria-labelledby="coming-title">
            <div class="flex flex-col align-items-center gap-16">
              <div class="text-primary text-xlg" aria-hidden="true">
                <i class="fas fa-cog"></i>
              </div>
              <h1 id="coming-title" class="text-lg text-bold">Fonctionnalité à venir</h1>
              <p class="text-sm">Cette page de paramètres sera bientôt disponible. Revenez plus tard !</p>
            </div>
          </section>
        </div>
      </main>
    </app-user-layout>
  `
})
export class UserParametreComponent {

}
