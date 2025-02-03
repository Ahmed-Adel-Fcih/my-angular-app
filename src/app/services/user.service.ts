import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loggedInUserId: string;

  constructor() {
    this.loggedInUserId = '1'; // Initialize with default value
  }

  setLoggedInUserId(userId: string) {
    this.loggedInUserId = userId;
  }

  getLoggedInUserId(): string {
    return this.loggedInUserId;
  }
}
