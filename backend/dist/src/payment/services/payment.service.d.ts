import { PrismaService } from '../../prisma/services/prisma.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CreateSubscriptionDto, SubscriptionPlan } from '../dto/create-subscription.dto';
import { CreatePaymentIntentDto } from '../dto/create-payment-intent.dto';
export declare class PaymentService {
    private prisma;
    private stripe?;
    private readonly logger;
    private readonly PRICING_PLANS;
    constructor(prisma: PrismaService);
    private getStripe;
    createCustomer(createCustomerDto: CreateCustomerDto): Promise<{
        customerId: string;
        message: string;
    } | {
        customerId: string;
        message?: undefined;
    }>;
    createSubscription(createSubscriptionDto: CreateSubscriptionDto): Promise<{
        message: string;
        subscriptionId?: undefined;
        clientSecret?: undefined;
    } | {
        subscriptionId: string;
        clientSecret: any;
        message?: undefined;
    }>;
    createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto): Promise<{
        clientSecret: string | null;
        paymentIntentId: string;
    }>;
    getSubscriptionStatus(userId: string): Promise<{
        plan: SubscriptionPlan;
        status: string;
        features?: undefined;
    } | {
        plan: string;
        status: string;
        features: any;
    }>;
    getPricingPlans(): Promise<{
        id: string;
        name: string;
        amount: number;
        features: string[];
        priceId: string | null | undefined;
    }[]>;
    handleWebhook(payload: Buffer, signature: string): Promise<void>;
    private handleSubscriptionUpdated;
    private handleSubscriptionDeleted;
    private handlePaymentSucceeded;
    private handlePaymentFailed;
}
