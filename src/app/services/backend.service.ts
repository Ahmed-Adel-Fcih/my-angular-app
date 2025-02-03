import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient, private userService: UserService) {}
  baseurl: string = 'http://localhost:8080';

  private getHeaders(): HttpHeaders {
    const customerId = this.userService.getLoggedInUserId();
    return new HttpHeaders({
      'customerId': customerId
    });
  }

  preparePayment(cardId?: string): Observable<any> {
    const url = this.baseurl + '/api/v1/payments/prepare';
    const body = cardId ? { card_id: cardId } : {};
    const headers = this.getHeaders();
    return this.http.post(url, body, { headers });
  }

  doPurchase(purchaseData: any): Observable<any> {
    const url = this.baseurl + '/api/v1/payments';    
    const headers = this.getHeaders();
    return this.http.post(url, purchaseData, { headers });
  }

  getSavedCards(): Observable<any[]> {
    const url = this.baseurl + '/api/v1/cards';
    return this.http.get<any[]>(url);
  }

  addCard(card: any): Observable<any> {
    const url = this.baseurl + '/api/v1/cards';
    const headers = this.getHeaders();
    return this.http.post(url, card, { headers });
  }

  handleReturnUrl(data: any): Observable<any> {
    const url = this.baseurl + '/api/v1/amazon';
    return this.http.post(url, data);
  }

  getPaymentDetails(): Observable<any> {
    const url = this.baseurl + '/api/v1/payments';
    const headers = this.getHeaders();
    return this.http.get(url, { headers });
  }

  refundPayment(merchantReference: string): Observable<any> {
    const url = this.baseurl + '/api/v1/payments/refund';
    const body = merchantReference;
    const headers = this.getHeaders();
    return this.http.post(url, body, { headers });
  }
}
