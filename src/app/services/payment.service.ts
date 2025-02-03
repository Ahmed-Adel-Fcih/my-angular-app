import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private storedCards: any[] = [];
  private card: any = {
    id: null,
    card_number: null,
    cardHolder: null,
    expiry: null,
    cvv: null
  };
  private tokenizationRequest: any; // Tokenization request object

  constructor(private backendService: BackendService) {
    // Initialize with some dummy data
    this.storedCards = [
      { id: 1, cardNumber: '**** **** **** 1234', cardHolder: 'John Doe', expiry: '12/24' },
      { id: 2, cardNumber: '**** **** **** 5678', cardHolder: 'Jane Smith', expiry: '11/23' }
    ];
    //generate Signature
    //create tokenizationRequest to BE and get the signature and merchant refernece
    //send tokenization to Amazon
    this.tokenizationRequest = {
      "service_command": "TOKENIZATION",
      "access_code": "BBclIzOu7uPKrCrTpn6u",
      "merchant_identifier": "gockaBhA",
      "merchant_reference": "gockaBhA_7",
      "language": "en",
      "expiry_date": "",
      "card_number": "",
      "card_security_code":"",    
      "signature": "",
      "token_name":"",
      "card_holder_name":"John Smith",
      "remember_me":"NO",
      "return_url": "http://localhost:8080/api/v1/amazon"
  };
  }

  getStoredCards(): Observable<any[]> {
    return this.backendService.getSavedCards();
  }

  getTokenizationRequest(): Observable<any> {
    return of(this.tokenizationRequest);
  }

  addCard(card: any): Observable<any> {
    return this.backendService.addCard(card);
  }

  removeCard(cardId: string): Observable<any> {
    this.storedCards = this.storedCards.filter(card => card.id !== cardId);
    return of(null);
  }

  setCard(card: any) {
    this.card = card;
  }

  getCard(): any {
    return this.card;
  }

  setCvv(cvv: any) {
    this.card.cvv = cvv;
  }

  setStoredCards(cards: any[]) {
    this.storedCards = cards;
  }

  preparePayment(cardId?: string): Observable<any> {
    return this.backendService.preparePayment(cardId);
  }

  doPurchase(purchaseData: any): Observable<any> {
    return this.backendService.doPurchase(purchaseData);
  }

  getPaymentDetails(): Observable<any> {
    return this.backendService.getPaymentDetails();
  }

  refundPayment(merchantReference: string): Observable<any> {
    return this.backendService.refundPayment(merchantReference);
  }
}