import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import Stripe from 'stripe';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CreateSubscriptionDto, SubscriptionPlan } from '../dto/create-subscription.dto';
import { CreatePaymentIntentDto } from '../dto/create-payment-intent.dto';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);

  // Plans de tarification
  private readonly PRICING_PLANS = {
    [SubscriptionPlan.FREE]: {
      priceId: null,
      amount: 0,
      name: 'Gratuit',
      features: ['3 quiz par jour', 'Fonctionnalités de base']
    },
    [SubscriptionPlan.PREMIUM]: {
      priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
      amount: 999, // 9.99€ en centimes
      name: 'Premium',
      features: ['Quiz illimités', 'Statistiques avancées', 'Thèmes personnalisés']
    },
    [SubscriptionPlan.EDUCATION]: {
      priceId: process.env.STRIPE_EDUCATION_PRICE_ID,
      amount: 499, // 4.99€ en centimes
      name: 'Éducation',
      features: ['Quiz illimités', 'Gestion de classe', 'Rapports détaillés']
    }
  };

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-08-27.basil',
    });
  }

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    try {
      // Vérifier si le customer existe déjà
      const existingCustomer = await this.prisma.user.findUnique({
        where: { id: createCustomerDto.userId },
        include: { subscription: true }
      });

      if (existingCustomer?.subscription?.stripeCustomerId) {
        return {
          customerId: existingCustomer.subscription.stripeCustomerId,
          message: 'Customer déjà existant'
        };
      }

      // Créer le customer Stripe
      const customer = await this.stripe.customers.create({
        email: createCustomerDto.email,
        name: createCustomerDto.name,
        metadata: {
          userId: createCustomerDto.userId
        }
      });

      // Sauvegarder en base
      await this.prisma.subscription.upsert({
        where: { userId: createCustomerDto.userId },
        update: {
          stripeCustomerId: customer.id,
          status: 'active'
        },
        create: {
          userId: createCustomerDto.userId,
          stripeCustomerId: customer.id,
          plan: SubscriptionPlan.FREE,
          status: 'active'
        }
      });

      this.logger.log(`Customer Stripe créé: ${customer.id}`);
      return { customerId: customer.id };
    } catch (error) {
      this.logger.error('Erreur création customer:', error);
      throw new BadRequestException('Erreur lors de la création du customer');
    }
  }

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const plan = this.PRICING_PLANS[createSubscriptionDto.plan];
      
      if (createSubscriptionDto.plan === SubscriptionPlan.FREE) {
        // Plan gratuit - pas de paiement
        await this.prisma.subscription.update({
          where: { stripeCustomerId: createSubscriptionDto.customerId },
          data: { plan: SubscriptionPlan.FREE }
        });
        
        return { message: 'Plan gratuit activé' };
      }

      // Créer la subscription Stripe
      const subscription = await this.stripe.subscriptions.create({
        customer: createSubscriptionDto.customerId,
        items: [{ price: plan.priceId || '' }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      // Sauvegarder en base
      await this.prisma.subscription.update({
        where: { stripeCustomerId: createSubscriptionDto.customerId },
        data: {
          plan: createSubscriptionDto.plan,
          stripeSubscriptionId: subscription.id,
          status: subscription.status as any
        }
      });

      this.logger.log(`Subscription créée: ${subscription.id}`);
      return {
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret
      };
    } catch (error) {
      this.logger.error('Erreur création subscription:', error);
      throw new BadRequestException('Erreur lors de la création de l\'abonnement');
    }
  }

  async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: createPaymentIntentDto.amount,
        currency: createPaymentIntentDto.currency,
        customer: createPaymentIntentDto.customerId,
        description: createPaymentIntentDto.description,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      this.logger.log(`PaymentIntent créé: ${paymentIntent.id}`);
      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      this.logger.error('Erreur création PaymentIntent:', error);
      throw new BadRequestException('Erreur lors de la création du paiement');
    }
  }

  async getSubscriptionStatus(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
      include: { user: true }
    });

    if (!subscription) {
      return { plan: SubscriptionPlan.FREE, status: 'inactive' };
    }

    return {
      plan: subscription.plan,
      status: subscription.status,
      features: this.PRICING_PLANS[subscription.plan].features
    };
  }

  async getPricingPlans() {
    return Object.entries(this.PRICING_PLANS).map(([key, plan]) => ({
      id: key,
      name: plan.name,
      amount: plan.amount,
      features: plan.features,
      priceId: plan.priceId
    }));
  }

  async handleWebhook(payload: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret || '');
      
      switch (event.type) {
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
          break;
        default:
          this.logger.log(`Event non géré: ${event.type}`);
      }
    } catch (error) {
      this.logger.error('Erreur webhook:', error);
      throw new BadRequestException('Webhook invalide');
    }
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { status: subscription.status as any }
    });
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { 
        status: 'canceled',
        plan: SubscriptionPlan.FREE
      }
    });
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    if ((invoice as any).subscription && typeof (invoice as any).subscription === 'string') {
      await this.prisma.subscription.updateMany({
        where: { stripeSubscriptionId: (invoice as any).subscription },
        data: { status: 'active' }
      });
    }
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    if ((invoice as any).subscription && typeof (invoice as any).subscription === 'string') {
      await this.prisma.subscription.updateMany({
        where: { stripeSubscriptionId: (invoice as any).subscription },
        data: { status: 'past_due' }
      });
    }
  }
}
