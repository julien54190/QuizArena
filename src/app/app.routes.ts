import { Routes } from '@angular/router';
import { UsersComponent } from './views/users/users.component';
import { UserProfileComponent } from './views/users/components/user-profile.component';
import { UserStatComponent } from './views/users/components/user-stat.component';
import { UserCreateQuizComponent } from './views/users/components/user-create-quiz.component';

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
  },
  {
    path: 'profil',
    component: UserProfileComponent
  },
  {
    path: 'statistiques',
    component: UserStatComponent
  },
  {
    path: 'creer-quiz',
    component: UserCreateQuizComponent
  }

];
