import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  clientSecret: string = '';
  planId: string = '';
  isLoading = true;
  isProcessing = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.clientSecret = params['clientSecret'];
      this.planId = params['planId'];

      if (this.clientSecret) {
        this.setupPayment();
      } else {
        this.error = 'Paramètres de paiement manquants';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.paymentService.cleanup();
  }

  async setupPayment() {
    try {
      await this.paymentService.setupPaymentElement('payment-element', this.clientSecret);
      this.isLoading = false;
    } catch (error) {
      console.error('Erreur lors de la configuration du paiement:', error);
      this.error = 'Erreur lors de la configuration du paiement';
      this.isLoading = false;
    }
  }

  async handleSubmit() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.error = null;

    try {
      const { error, paymentIntent } = await this.paymentService.confirmPayment();

      if (error) {
        this.error = error.message || 'Erreur lors du paiement';
        this.isProcessing = false;
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Paiement réussi, rediriger vers la page de succès
        this.router.navigate(['/payment/success'], {
          queryParams: { paymentIntent: paymentIntent.id }
        });
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      this.error = 'Une erreur inattendue s\'est produite';
      this.isProcessing = false;
    }
  }

  goBack() {
    this.router.navigate(['/payment/plans']);
  }
}
