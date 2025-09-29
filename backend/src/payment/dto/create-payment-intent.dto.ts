import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsNumber()
  @Min(50) // Minimum 50 centimes
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string = 'eur';

  @IsString()
  @IsNotEmpty()
  description: string;
}


