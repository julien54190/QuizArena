import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Headers,
  RawBody,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { CreatePaymentIntentDto } from '../dto/create-payment-intent.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('customer')
  @UseGuards(JwtAuthGuard)
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto, @Request() req) {
    // Ajouter l'userId depuis le token JWT
    createCustomerDto.userId = req.user.userId;
    return this.paymentService.createCustomer(createCustomerDto);
  }

  @Post('subscription')
  @UseGuards(JwtAuthGuard)
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.paymentService.createSubscription(createSubscriptionDto);
  }

  @Post('payment-intent')
  @UseGuards(JwtAuthGuard)
  async createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto) {
    return this.paymentService.createPaymentIntent(createPaymentIntentDto);
  }

  @Get('subscription-status')
  @UseGuards(JwtAuthGuard)
  async getSubscriptionStatus(@Request() req) {
    return this.paymentService.getSubscriptionStatus(req.user.userId);
  }

  @Get('pricing-plans')
  async getPricingPlans() {
    return this.paymentService.getPricingPlans();
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @RawBody() payload: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentService.handleWebhook(payload, signature);
  }
}
