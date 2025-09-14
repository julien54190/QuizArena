import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService, PricingPlan, SubscriptionStatus } from '../../services/payment.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pricing-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing-plans.component.html',
  styleUrls: ['./pricing-plans.component.scss']
})
export class PricingPlansComponent implements OnInit {
  plans: PricingPlan[] = [];
  currentSubscription: SubscriptionStatus | null = null;
  isLoading = true;
  isProcessing = false;

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPlans();
    this.loadSubscriptionStatus();
  }

  loadPlans() {
    this.paymentService.getPricingPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des plans:', error);
        this.isLoading = false;
      }
    });
  }

  loadSubscriptionStatus() {
    this.paymentService.getSubscriptionStatus().subscribe({
      next: (status) => {
        this.currentSubscription = status;
        this.paymentService.updateSubscriptionStatus(status);
      },
      error: (error) => {
        console.error('Erreur lors du chargement du statut:', error);
      }
    });
  }

  async selectPlan(plan: PricingPlan) {
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      // Vérifier si l'utilisateur est connecté
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/auth/login']);
        return;
      }

      // Si c'est le plan gratuit, l'activer directement
      if (plan.id === 'free') {
        await this.activateFreePlan();
        return;
      }

      // Pour les plans payants, créer le customer et l'abonnement
      await this.createCustomerAndSubscription(plan);
    } catch (error) {
      console.error('Erreur lors de la sélection du plan:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async activateFreePlan() {
    // Logique pour activer le plan gratuit
    this.paymentService.updateSubscriptionStatus({
      plan: 'free',
      status: 'active',
      features: ['3 quiz par jour', 'Fonctionnalités de base']
    });

    // Rediriger vers le dashboard
    this.router.navigate(['/users/dashboard']);
  }

  private async createCustomerAndSubscription(plan: PricingPlan) {
    // Obtenir les informations utilisateur
    const userEmail = this.authService.currentUserEmail();
    if (!userEmail) {
      throw new Error('Utilisateur non connecté');
    }

    // Créer le customer Stripe
    this.paymentService.createCustomer(userEmail, 'Utilisateur QuizArena').subscribe({
      next: (customerResponse) => {
        // Créer l'abonnement
        this.paymentService.createSubscription(plan.id, customerResponse.customerId).subscribe({
          next: (subscriptionResponse) => {
            if (subscriptionResponse.clientSecret) {
              // Rediriger vers la page de paiement
              this.router.navigate(['/payment/checkout'], {
                queryParams: {
                  clientSecret: subscriptionResponse.clientSecret,
                  planId: plan.id
                }
              });
            } else {
              // Plan activé directement
              this.loadSubscriptionStatus();
              this.router.navigate(['/users/dashboard']);
            }
          },
          error: (error) => {
            console.error('Erreur lors de la création de l\'abonnement:', error);
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors de la création du customer:', error);
      }
    });
  }

  isCurrentPlan(planId: string): boolean {
    return this.currentSubscription?.plan === planId;
  }

  formatPrice(amount: number): string {
    if (amount === 0) return 'Gratuit';
    return `${(amount / 100).toFixed(2)}€`;
  }

  getPlanIcon(planId: string): string {
    switch (planId) {
      case 'free': return '🆓';
      case 'premium': return '💎';
      case 'education': return '🎓';
      default: return '📦';
    }
  }

  getPlanColor(planId: string): string {
    switch (planId) {
      case 'free': return 'bg-gray-100';
      case 'premium': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'education': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-gray-100';
    }
  }
}
