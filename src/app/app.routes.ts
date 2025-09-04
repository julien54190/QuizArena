import { Routes } from '@angular/router';
import { RegisterComponent } from './views/auth/register.component';
import { LoginComponent } from './views/auth/login.component';

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
    path:  'inscription',
    component: RegisterComponent
  },
  {
    path: 'connexion',
    component: LoginComponent
  }
];
