import { PaymentService } from '../services/payment.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { CreatePaymentIntentDto } from '../dto/create-payment-intent.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createCustomer(createCustomerDto: CreateCustomerDto, req: any): Promise<{
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
    getSubscriptionStatus(req: any): Promise<{
        plan: import("../dto/create-subscription.dto").SubscriptionPlan;
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
}
