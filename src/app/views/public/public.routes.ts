import { Routes } from '@angular/router';
import { AccueilComponent } from './home/accueil.component';
import { PlayComponent } from './play/play.component';

export const publicRoutes: Routes = [
	{
		path: 'accueil',
		component: AccueilComponent
	},
	{
		path: 'jouer',
		component: PlayComponent
	},
	{
		path: 'jouer/:categoryId',
		component: PlayComponent
	},
	{
		path: 'jouer/quiz/:quizId',
		component: PlayComponent
	}
];
