import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit {
  cardNumber: string;
  cardHolder: string;
  expirationDate: string;
  cvv: string;
  errorMessage: string;
  tokenizationRequest: any;

  constructor(
    private paymentService: PaymentService, 
    private userService: UserService
  ) {
    this.cardNumber = '';
    this.cardHolder = '';
    this.expirationDate = '';
    this.cvv = '';
    this.errorMessage = '';

    const userId = this.userService.getLoggedInUserId();
    console.log('Logged in user ID:', userId);
  }

  ngOnInit() {
    this.paymentService.getTokenizationRequest().subscribe(tokenization => {
      this.tokenizationRequest = tokenization;
    });
  }

  addCard() {
    if (this.validateCardDetails()) {
      // Mask the card number except for the last 4 digits
      const maskedCardNumber = this.cardNumber.slice(-4).padStart(this.cardNumber.length, '*');

      // Call the backend service to add the card
      const addedCardDetails = {
        card_number: maskedCardNumber,
        card_holder: this.cardHolder,
        expiry_date: this.expirationDate
      };
      const cardDetails = {
        card_number: this.cardNumber,
        card_holder: this.cardHolder,
        expiry_date: this.expirationDate,
        card_security_code: this.cvv
      };
      this.paymentService.addCard({ ...addedCardDetails}).subscribe(
        (cardResponse: any) => {
          const cardId = cardResponse.id;
          // Call the backend service to prepare the payment with the card ID
          this.paymentService.preparePayment(cardId).subscribe(
            (prepareResponse: any) => {
              // Update tokenizationRequest with the response data
              this.updateTokenizationRequest(prepareResponse, cardDetails);
              // Submit the tokenization form
              this.submitTokenizationForm();
              // Wait for 5 seconds and then load stored cards
              setTimeout(() => {
                this.paymentService.getStoredCards().subscribe(cards => {
                  this.paymentService.setStoredCards(cards); // Update stored cards in the service
                
                });
              }, 5000);
            },
            error => {
              this.errorMessage = 'Failed to prepare payment. Please try again.';
            }
          );
        },
        error => {
          this.errorMessage = 'Failed to add card. Please try again.';
        }
      );
    }
  }

  validateCardDetails(): boolean {
    if (!this.cardNumber || !this.cardHolder || !this.expirationDate || !this.cvv) {
      this.errorMessage = 'All fields are required.';
      return false;
    }
    // Additional validation logic can be added here
    return true;
  }

  updateTokenizationRequest(response: any, cardDetails: any) {
    // Update the tokenizationRequest object with the response data and card details
    this.tokenizationRequest.merchant_reference = response.merchant_reference;
    this.tokenizationRequest.merchant_identifier = response.merchant_identifier;
    this.tokenizationRequest.access_code = response.access_code;
    this.tokenizationRequest.signature = response.signature;
    this.tokenizationRequest.card_number = cardDetails.card_number;
    // Convert expiration date to YYMM format
    const formattedExpiryDate = this.convertExpiryDateToYYMM(cardDetails.expiry_date);
    this.tokenizationRequest.expiry_date = formattedExpiryDate;
    this.tokenizationRequest.card_security_code = cardDetails.card_security_code;
    this.tokenizationRequest.card_holder_name = cardDetails.card_holder;
  }

  submitTokenizationForm() {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://sbcheckout.payfort.com/FortAPI/paymentPage';
    form.style.display = 'none';

    Object.keys(this.tokenizationRequest).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = this.tokenizationRequest[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);

    // Show the loading spinner
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
      spinner.style.display = 'block';
    }

    // Intercept the form submission
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
      }).then(response => {
        // Handle the response
        if (spinner) {
          spinner.style.display = 'none';
        }
        // Process the response data
        console.log('Tokenization response:', response);
      }).catch(error => {
        if (spinner) {
          spinner.style.display = 'none';
        }
        console.error('Tokenization error:', error);
      });
    });

    form.submit();
  }

  convertExpiryDateToYYMM(expiryDate: string): string {
    const [month, year] = expiryDate.split('/');
    return `${year.slice(-2)}${month}`;
  }
}