import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit {
  paymentDetails: any;
  isProcessingRefund: boolean = false; // Spinner flag

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPaymentDetails();
  }

  loadPaymentDetails() {
    this.paymentService.getPaymentDetails().subscribe(details => {
      this.paymentDetails = details;
    });
  }

  initiateRefund(merchantReference: string) {
    this.isProcessingRefund = true; // Show spinner
    this.paymentService.refundPayment(merchantReference).subscribe(
      response => {
        console.log('Refund response:', response);
        this.isProcessingRefund = false; // Hide spinner
      },
      error => {
        console.error('Refund error:', error);
        this.isProcessingRefund = false; // Hide spinner
      }
    );
  }
}
