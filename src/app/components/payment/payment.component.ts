import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { UserService } from '../../services/user.service';

declare var $: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  storedCards: any[] = [];
  rememberCard: boolean = false;
  tokenizationRequest: any; // Tokenization request object
  products = [
    { id: 1, img: 'assets/img/Product1.jpg', price: 6800, currency: 'SAR', description: 'Apple iPhone 16 Pro Max (1 TB) - Desert Titanium' },
    { id: 2, img: 'assets/img/Product2.jpg', price: 5900, currency: 'SAR', description: 'Samsung Galaxy S25 Ultra, TB1, 12 GB RAM, Titanium Black, 5G, Snapdragon 8 Elite' },
    { id: 3, img: 'assets/img/Product3.jpg', price: 17500, currency: 'SAR', description: 'MacBook Pro, M4 Max, 48GB, 1TB SSD, 16.2 inch, 40 Core GPU, Space Black' },
    { id: 4, img: 'assets/img/Product4.jpg', price: 4500, currency: 'SAR', description: 'Sony PlayStation 5, 1TB, White' },
    { id: 5, img: 'assets/img/Product5.jpg', price: 3000, currency: 'SAR', description: 'Apple Watch Series 8, 45mm, GPS + Cellular, Midnight Aluminum Case' },
    { id: 6, img: 'assets/img/Product6.jpg', price: 1200, currency: 'SAR', description: 'Amazon Echo Show 10, HD Smart Display with Motion and Alexa' }
  ];
  selectedProductId: number = 1;
  selectedProduct: any;
  isProcessingPayment: boolean = false; // Spinner flag
  responsiveOptions: any[];

  constructor(private paymentService: PaymentService, private userService: UserService) {
    this.paymentService.getTokenizationRequest().subscribe(tokenization => {
      this.tokenizationRequest = tokenization;
    });
    const userId = this.userService.getLoggedInUserId();
    console.log('Logged in user ID:', userId);
    //this.loadStoredCards(); // Load stored cards on initialization
    this.selectedProduct = this.products.find(product => product.id === this.selectedProductId);
    this.responsiveOptions = [
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
    ];
  }

  loadStoredCards() {
    this.paymentService.getStoredCards().subscribe(cards => {
      this.paymentService.setStoredCards(cards); // Update stored cards in the service
      this.storedCards = cards;
    });
  }

  ngOnInit() {
    // Initialize with the first product selected
    this.selectProduct(this.selectedProductId);
  }

  selectProduct(productId: number) {
    this.selectedProductId = productId;
    this.selectedProduct = this.products.find(product => product.id === productId);
  }

  proceedToPayment() {
    this.isProcessingPayment = true; // Show spinner
    const cardData = this.paymentService.getCard();
    const selectedProduct = this.selectedProduct;
    const userId = this.userService.getLoggedInUserId();

    if (this.rememberCard && !cardData.id) {
      this.paymentService.addCard(cardData).subscribe(() => {
        this.loadStoredCards(); // Load saved cards after adding a new card
      });
    }

    // Prepare the purchase data
    const purchaseData = {
      card_id: cardData.id,
      order_description: selectedProduct.description,
      amount: selectedProduct.price,
      currency: selectedProduct.currency
    };

    // Call the doPurchase backend service
    this.paymentService.doPurchase(purchaseData).subscribe(
      response => {
        console.log('Payment response:', response);
        this.isProcessingPayment = false; // Hide spinner
      },
      error => {
        console.error('Payment error:', error);
        this.isProcessingPayment = false; // Hide spinner
      }
    );
  }
}