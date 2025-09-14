import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';

export interface PricingPlan {
  id: string;
  name: string;
  amount: number;
  features: string[];
  priceId?: string;
}

export interface SubscriptionStatus {
  plan: string;
  status: string;
  features: string[];
}

export interface CustomerResponse {
  customerId: string;
  message?: string;
}

export interface SubscriptionResponse {
  subscriptionId?: string;
  clientSecret?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private paymentElement: StripePaymentElement | null = null;

  private subscriptionStatusSubject = new BehaviorSubject<SubscriptionStatus | null>(null);
  public subscriptionStatus$ = this.subscriptionStatusSubject.asObservable();

  private readonly API_URL = 'http://localhost:3000/payment';

  constructor(private http: HttpClient) {
    this.initializeStripe();
  }

  private async initializeStripe() {
    this.stripe = await loadStripe('pk_test_51O...'); // Clé publique Stripe
  }

  // Créer un customer Stripe
  createCustomer(email: string, name: string): Observable<CustomerResponse> {
    return this.http.post<CustomerResponse>(`${this.API_URL}/customer`, {
      email,
      name
    });
  }

  // Créer un abonnement
  createSubscription(plan: string, customerId: string): Observable<SubscriptionResponse> {
    return this.http.post<SubscriptionResponse>(`${this.API_URL}/subscription`, {
      plan,
      customerId
    });
  }

  // Obtenir les plans de tarification
  getPricingPlans(): Observable<PricingPlan[]> {
    return this.http.get<PricingPlan[]>(`${this.API_URL}/pricing-plans`);
  }

  // Obtenir le statut de l'abonnement
  getSubscriptionStatus(): Observable<SubscriptionStatus> {
    return this.http.get<SubscriptionStatus>(`${this.API_URL}/subscription-status`);
  }

  // Mettre à jour le statut local
  updateSubscriptionStatus(status: SubscriptionStatus) {
    this.subscriptionStatusSubject.next(status);
  }

  // Configurer Stripe Elements pour le paiement
  async setupPaymentElement(containerId: string, clientSecret: string) {
    if (!this.stripe) {
      throw new Error('Stripe non initialisé');
    }

    this.elements = this.stripe.elements({
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#0570de',
          colorBackground: '#ffffff',
          colorText: '#30313d',
          colorDanger: '#df1b41',
          fontFamily: 'Ideal Sans, system-ui, sans-serif',
          spacingUnit: '2px',
          borderRadius: '4px',
        }
      }
    });

    this.paymentElement = this.elements.create('payment');
    this.paymentElement.mount(`#${containerId}`);
  }

  // Confirmer le paiement
  async confirmPayment(): Promise<{ error?: any; paymentIntent?: any }> {
    if (!this.stripe || !this.paymentElement) {
      throw new Error('Stripe ou PaymentElement non initialisé');
    }

    const result = await this.stripe.confirmPayment({
      elements: this.elements!,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    return {
      error: result.error,
      paymentIntent: (result as any).paymentIntent
    };
  }

  // Vérifier si l'utilisateur a accès à une fonctionnalité
  hasFeature(feature: string): boolean {
    const status = this.subscriptionStatusSubject.value;
    if (!status) return false;

    return status.features.includes(feature);
  }

  // Vérifier si l'utilisateur est premium
  isPremium(): boolean {
    const status = this.subscriptionStatusSubject.value;
    return status?.plan === 'premium' || status?.plan === 'education';
  }

  // Obtenir le nom du plan
  getPlanName(): string {
    const status = this.subscriptionStatusSubject.value;
    if (!status) return 'Gratuit';

    switch (status.plan) {
      case 'premium': return 'Premium';
      case 'education': return 'Éducation';
      default: return 'Gratuit';
    }
  }

  // Nettoyer les éléments Stripe
  cleanup() {
    if (this.paymentElement) {
      this.paymentElement.unmount();
      this.paymentElement = null;
    }
    if (this.elements) {
      this.elements = null;
    }
  }
}
