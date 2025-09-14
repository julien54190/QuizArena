"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/services/prisma.service");
const stripe_1 = __importDefault(require("stripe"));
const create_subscription_dto_1 = require("../dto/create-subscription.dto");
let PaymentService = PaymentService_1 = class PaymentService {
    prisma;
    stripe;
    logger = new common_1.Logger(PaymentService_1.name);
    PRICING_PLANS = {
        [create_subscription_dto_1.SubscriptionPlan.FREE]: {
            priceId: null,
            amount: 0,
            name: 'Gratuit',
            features: ['3 quiz par jour', 'Fonctionnalités de base']
        },
        [create_subscription_dto_1.SubscriptionPlan.PREMIUM]: {
            priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
            amount: 999,
            name: 'Premium',
            features: ['Quiz illimités', 'Statistiques avancées', 'Thèmes personnalisés']
        },
        [create_subscription_dto_1.SubscriptionPlan.EDUCATION]: {
            priceId: process.env.STRIPE_EDUCATION_PRICE_ID,
            amount: 499,
            name: 'Éducation',
            features: ['Quiz illimités', 'Gestion de classe', 'Rapports détaillés']
        }
    };
    constructor(prisma) {
        this.prisma = prisma;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2025-08-27.basil',
        });
    }
    async createCustomer(createCustomerDto) {
        try {
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
            const customer = await this.stripe.customers.create({
                email: createCustomerDto.email,
                name: createCustomerDto.name,
                metadata: {
                    userId: createCustomerDto.userId
                }
            });
            await this.prisma.subscription.upsert({
                where: { userId: createCustomerDto.userId },
                update: {
                    stripeCustomerId: customer.id,
                    status: 'active'
                },
                create: {
                    userId: createCustomerDto.userId,
                    stripeCustomerId: customer.id,
                    plan: create_subscription_dto_1.SubscriptionPlan.FREE,
                    status: 'active'
                }
            });
            this.logger.log(`Customer Stripe créé: ${customer.id}`);
            return { customerId: customer.id };
        }
        catch (error) {
            this.logger.error('Erreur création customer:', error);
            throw new common_1.BadRequestException('Erreur lors de la création du customer');
        }
    }
    async createSubscription(createSubscriptionDto) {
        try {
            const plan = this.PRICING_PLANS[createSubscriptionDto.plan];
            if (createSubscriptionDto.plan === create_subscription_dto_1.SubscriptionPlan.FREE) {
                await this.prisma.subscription.update({
                    where: { stripeCustomerId: createSubscriptionDto.customerId },
                    data: { plan: create_subscription_dto_1.SubscriptionPlan.FREE }
                });
                return { message: 'Plan gratuit activé' };
            }
            const subscription = await this.stripe.subscriptions.create({
                customer: createSubscriptionDto.customerId,
                items: [{ price: plan.priceId || '' }],
                payment_behavior: 'default_incomplete',
                payment_settings: { save_default_payment_method: 'on_subscription' },
                expand: ['latest_invoice.payment_intent'],
            });
            await this.prisma.subscription.update({
                where: { stripeCustomerId: createSubscriptionDto.customerId },
                data: {
                    plan: createSubscriptionDto.plan,
                    stripeSubscriptionId: subscription.id,
                    status: subscription.status
                }
            });
            this.logger.log(`Subscription créée: ${subscription.id}`);
            return {
                subscriptionId: subscription.id,
                clientSecret: subscription.latest_invoice?.payment_intent?.client_secret
            };
        }
        catch (error) {
            this.logger.error('Erreur création subscription:', error);
            throw new common_1.BadRequestException('Erreur lors de la création de l\'abonnement');
        }
    }
    async createPaymentIntent(createPaymentIntentDto) {
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
        }
        catch (error) {
            this.logger.error('Erreur création PaymentIntent:', error);
            throw new common_1.BadRequestException('Erreur lors de la création du paiement');
        }
    }
    async getSubscriptionStatus(userId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { userId },
            include: { user: true }
        });
        if (!subscription) {
            return { plan: create_subscription_dto_1.SubscriptionPlan.FREE, status: 'inactive' };
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
    async handleWebhook(payload, signature) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        try {
            const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret || '');
            switch (event.type) {
                case 'customer.subscription.updated':
                    await this.handleSubscriptionUpdated(event.data.object);
                    break;
                case 'customer.subscription.deleted':
                    await this.handleSubscriptionDeleted(event.data.object);
                    break;
                case 'invoice.payment_succeeded':
                    await this.handlePaymentSucceeded(event.data.object);
                    break;
                case 'invoice.payment_failed':
                    await this.handlePaymentFailed(event.data.object);
                    break;
                default:
                    this.logger.log(`Event non géré: ${event.type}`);
            }
        }
        catch (error) {
            this.logger.error('Erreur webhook:', error);
            throw new common_1.BadRequestException('Webhook invalide');
        }
    }
    async handleSubscriptionUpdated(subscription) {
        await this.prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: { status: subscription.status }
        });
    }
    async handleSubscriptionDeleted(subscription) {
        await this.prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: {
                status: 'canceled',
                plan: create_subscription_dto_1.SubscriptionPlan.FREE
            }
        });
    }
    async handlePaymentSucceeded(invoice) {
        if (invoice.subscription && typeof invoice.subscription === 'string') {
            await this.prisma.subscription.updateMany({
                where: { stripeSubscriptionId: invoice.subscription },
                data: { status: 'active' }
            });
        }
    }
    async handlePaymentFailed(invoice) {
        if (invoice.subscription && typeof invoice.subscription === 'string') {
            await this.prisma.subscription.updateMany({
                where: { stripeSubscriptionId: invoice.subscription },
                data: { status: 'past_due' }
            });
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map