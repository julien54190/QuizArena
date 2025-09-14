import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum SubscriptionPlan {
  FREE = 'free',
  PREMIUM = 'premium',
  EDUCATION = 'education',
}

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @IsString()
  @IsNotEmpty()
  customerId: string;
}
