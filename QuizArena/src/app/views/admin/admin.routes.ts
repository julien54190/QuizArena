import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users.component';
import { AdminCreateUserComponent } from './components/admin-create-user.component';
import { AdminQuizzesComponent } from './components/admin-quizzes.component';
import { AdminCategoriesComponent } from './components/admin-categories.component';
import { AdminSessionsComponent } from './components/admin-sessions.component';
import { adminGuard } from '../../guard/auth.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [adminGuard],
          children: [
            { path: 'tableau-de-bord', component: AdminDashboardComponent },
            { path: 'utilisateurs', component: AdminUsersComponent },
            { path: 'utilisateurs/creer', component: AdminCreateUserComponent },
            { path: 'quizzes', component: AdminQuizzesComponent },
            { path: 'categories', component: AdminCategoriesComponent },
            { path: 'sessions', component: AdminSessionsComponent },
            { path: '', pathMatch: 'full', redirectTo: 'tableau-de-bord' }
          ]
  }
];


