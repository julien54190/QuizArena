import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLayoutComponent } from '../shared/user-layout.component';

@Component({
  selector: 'app-user-stat',
  imports: [CommonModule, UserLayoutComponent],
  template: `
    <app-user-layout>
      <section class="card card-shadow text-center" role="region" aria-labelledby="coming-title">
        <div class="flex flex-col align-items-center gap-16">
          <div class="text-primary text-xlg" aria-hidden="true">
            <i class="fas fa-hourglass-half"></i>
          </div>
          <h1 id="coming-title" class="text-lg text-bold">Fonctionnalité à venir</h1>
          <p class="text-sm">Cette page de statistiques sera bientôt disponible. Revenez plus tard !</p>
        </div>
      </section>
    </app-user-layout>
  `,
  styles: ``
})
export class UserStatComponent {}
