import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
  paymentIntentId: string = '';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.paymentIntentId = params['paymentIntent'];
      this.isLoading = false;

      // Mettre à jour le statut de l'abonnement
      this.paymentService.getSubscriptionStatus().subscribe({
        next: (status) => {
          this.paymentService.updateSubscriptionStatus(status);
        }
      });
    });
  }

  goToDashboard() {
    this.router.navigate(['/users/dashboard']);
  }

  goToPlans() {
    this.router.navigate(['/payment/plans']);
  }
}
