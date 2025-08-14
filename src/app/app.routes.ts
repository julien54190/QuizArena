import { Routes } from '@angular/router';
import { AccueilComponent } from './views/home/accueil.component';
import { PlayComponent } from './views/play/play.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'accueil',
    pathMatch: 'full'
  },
  {
    path: 'accueil',
    component: AccueilComponent
  },
  {
    path: 'jouer',
    component: PlayComponent
  }

];
