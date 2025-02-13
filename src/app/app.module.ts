import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CarouselModule } from 'primeng/carousel';

import { AppComponent } from './app.component';
import { PaymentComponent } from './components/payment/payment.component';
import { CardListComponent } from './components/card-list/card-list.component';
import { AddCardComponent } from './components/add-card/add-card.component';
import { PaymentDetailsComponent } from './components/payment-details/payment-details.component';
import { PaymentService } from './services/payment.service';
import { UserService } from './services/user.service';
import { BackendService } from './services/backend.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StatusModalComponent } from './components/status-modal/status-modal.component';



@NgModule({
  declarations: [
    AppComponent,
    PaymentComponent,
    PaymentDetailsComponent,
    CardListComponent,
    AddCardComponent,
    StatusModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    CarouselModule
  ],
  providers: [PaymentService, UserService, BackendService],
  bootstrap: [AppComponent],
  entryComponents: [StatusModalComponent]
})
export class AppModule { }