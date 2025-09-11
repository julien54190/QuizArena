import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (_route, state): boolean | UrlTree => {
  const router = inject(Router);
  const userService = inject(UserService);

  if (userService.isAuthenticated()) {
    return true;
  }

  // Redirection vers la page de connexion avec retour post-login
  return router.createUrlTree(['/auth/connexion'], { queryParams: { redirect: state.url } });
};

export const adminGuard: CanActivateFn = (_route, state): boolean | UrlTree => {
  const router = inject(Router);
  const userService = inject(UserService);

  const user = userService.currentUser();
  if (userService.isAuthenticated() && user && (user.role?.toString().toLowerCase() === 'admin')) {
    return true;
  }

  return router.createUrlTree(['/accueil']);
};


