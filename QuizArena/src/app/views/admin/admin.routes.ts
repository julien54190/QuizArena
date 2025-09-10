import { Routes } from '@angular/router';

import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { adminGuard } from '../../guard/auth.guard';

export const adminRoutes: Routes = [
  { path: 'tableau-de-bord', canActivate: [adminGuard], component: AdminDashboardComponent },
  { path: '', pathMatch: 'full', redirectTo: 'tableau-de-bord' }
];


