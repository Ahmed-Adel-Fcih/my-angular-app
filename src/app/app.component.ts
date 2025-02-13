import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatusModalComponent } from './components/status-modal/status-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Payment Page';
  statusMessage: string | null = null;

  constructor(private route: ActivatedRoute, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['status']) {
        this.statusMessage = params['status'];
        this.openModal();
      }
    });
  }

  openModal() {
    const modalRef = this.modalService.open(StatusModalComponent);
    modalRef.componentInstance.message = this.statusMessage;
  }
}