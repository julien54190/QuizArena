import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'accueil',
		pathMatch: 'full'
	},
	{
		path: '',
		loadChildren: () => import('./views/public/public.routes').then(m => m.publicRoutes)
	},
	{
		path: 'users',
		loadChildren: () => import('./views/users/users.routes').then(m => m.routes)
	}
];
