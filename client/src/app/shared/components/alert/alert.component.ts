import { Component, inject, signal } from '@angular/core';
import { AlertService } from '../../../core/services/alert.service';
import { Alert } from '../../../model/alert.model';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  alertService = inject(AlertService);

  timeoutId: any;

  alert = signal<Alert|null>(null);

  constructor() {
    this.alertService.onAlert().subscribe(data => {
      this.alert.set(data);
      
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.alert.set(null);
      }, 3000);
    });
  }
}
