export declare enum SubscriptionPlan {
    FREE = "free",
    PREMIUM = "premium",
    EDUCATION = "education"
}
export declare class CreateSubscriptionDto {
    plan: SubscriptionPlan;
    customerId: string;
}
