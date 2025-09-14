import { Routes } from '@angular/router';

export const paymentRoutes: Routes = [
  {
    path: 'plans',
    loadComponent: () => import('./pricing-plans.component').then(m => m.PricingPlansComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'success',
    loadComponent: () => import('./payment-success.component').then(m => m.PaymentSuccessComponent)
  }
];
