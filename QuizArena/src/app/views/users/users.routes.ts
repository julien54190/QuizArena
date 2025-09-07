import { Routes } from '@angular/router';

import { UsersComponent } from './users.component';
import { UserProfileComponent } from './components/user-profile.component';
import { UserStatComponent } from './components/user-stat.component';
import { UserCreateQuizComponent } from './components/user-create-quiz.component';
import { UserSubscriptionComponent } from './components/user-subscription.component';
import { UserParametreComponent } from './components/user-parametre.component';
import { UserDashboardComponent } from './components/user-dashboard.component';
import { authGuard } from '../../guard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: UsersComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'tableau-de-bord',
                component: UserDashboardComponent,
            },
            {
                path: 'profil',
                component: UserProfileComponent,
            },
            {
                path: 'statistiques',
                component: UserStatComponent,
            },
            {
                path: 'creer-quiz',
                component: UserCreateQuizComponent,
            },
            {
                path: 'abonnement',
                component: UserSubscriptionComponent,
            },
            {
                path: 'parametres',
                component: UserParametreComponent,
            },
            {
                path: '',
                redirectTo: 'tableau-de-bord',
                pathMatch: 'full',
            },
        ],
    },
];
