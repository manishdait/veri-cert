import { Component, inject, input } from '@angular/core';
import { Certificate } from '../../../model/certificate.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { parseTimestamp } from '../../utils/datetime.util';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-info',
  imports: [FontAwesomeModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  alertService = inject(AlertService);
  certificate = input.required<Certificate>();

  copy() {
    navigator.clipboard.writeText(this.certificate()!.uuid);
    this.alertService.setAlert({message:'Copied', type: 'SUCCESS'});
  }

  getTimestamp(timestamp: Date) {
    return parseTimestamp(timestamp);
  }
}
