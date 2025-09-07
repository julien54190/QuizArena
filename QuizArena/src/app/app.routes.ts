import { Routes } from '@angular/router';
// Routes d'auth chargées en lazy

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
	},
  {
    path: 'auth',
    loadChildren: () => import('./views/auth/auth.routes').then(m => m.authRoutes)
  }
];
