import { Routes } from '@angular/router';
import { RegisterComponent } from './register.component';
import { LoginComponent } from './login.component';

export const authRoutes: Routes = [
  {
    path: 'inscription',
    component: RegisterComponent
  },
  {
    path: 'connexion',
    component: LoginComponent
  }
];


