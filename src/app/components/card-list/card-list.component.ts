import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
@Injectable({
  providedIn: 'any'
})
export class CardListComponent {
  storedCards: any[] = [];
  selectedCard: any = null;
  manualCard: any = {};
  cvv: string = '';
  rememberCard: boolean = false;

  constructor(private paymentService: PaymentService, private userService: UserService) {
    this.loadStoredCards();
    const userId = this.userService.getLoggedInUserId();
    console.log('Logged in user ID:', userId);
  }

  loadStoredCards() {
    this.paymentService.getStoredCards().subscribe(cards => {
      this.paymentService.setStoredCards(cards); // Update stored cards in the service
      this.storedCards = cards;
    });
  }

  addNewCard() {
    // Logic to open the add card modal
    const addCardModal = document.getElementById('addCardModal');
    if (addCardModal) {
      addCardModal.style.display = 'block';
    }
  }

  closeModal() {
    const addCardModal = document.getElementById('addCardModal');
    if (addCardModal) {
      addCardModal.style.display = 'none';
    }
  }

  removeCard(cardId: string) {
    this.paymentService.removeCard(cardId).subscribe(() => {
      this.loadStoredCards();
    });
  }

  selectCard(card: any) {
    console.log(card);
    this.selectedCard = card;
    this.paymentService.setCard(card);
  }

  // In your component
  onInputCvv(event: any) {
  const inputElement = event.target as HTMLInputElement;
  const value = inputElement.value;
  this.paymentService.setCvv(value);
}

  

 
}