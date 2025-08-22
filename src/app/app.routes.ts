import { Routes } from '@angular/router';
import { UsersComponent } from './views/users/users.component';

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
  path: 'tableau-de-bord',
  component: UsersComponent
  }

];
