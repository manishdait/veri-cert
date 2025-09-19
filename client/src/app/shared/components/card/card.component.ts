import { Component, inject, input, signal } from '@angular/core';
import { Certificate } from '../../../model/certificate.model';
import { CertificateService } from '../../../core/services/certificate.service';
import { NgTemplateOutlet } from '@angular/common';
import { AppState } from '../../../store/app.state';
import { Store } from '@ngrx/store';
import { updateCertificate } from '../../../store/certificate/certificate.action';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlertService } from '../../../core/services/alert.service';
import { parseTimestamp } from '../../utils/datetime.util';

@Component({
  selector: 'app-card',
  imports: [NgTemplateOutlet, FontAwesomeModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  store = inject(Store<AppState>);
  certificateService = inject(CertificateService);
  alertService = inject(AlertService);

  certificate = input.required<Certificate>();
  type = input.required<string>();

  processing = signal(false);

  copy(uuid: string) {
    navigator.clipboard.writeText(uuid);
    this.alertService.setAlert({message:'Copied', type: 'SUCCESS'});
  }


  copyUrl(uuid: string) {
    navigator.clipboard.writeText(`http://localhost:4200/view/${uuid}`);
    this.alertService.setAlert({message:'Copied', type: 'SUCCESS'});
  }

  revoke(uuid: string) {
    this.processing.set(true);
    this.certificateService.revokeCertificate(uuid).subscribe({
      next: (res) => {
        this.store.dispatch(updateCertificate({certificate: res}))
        this.alertService.setAlert({message: 'Certificate has been revoked', type: 'SUCCESS'});
        this.processing.set(false);
      },
      error: (err) => {
        this.processing.set(false);
        this.alertService.setAlert({message: 'Error revoking certificate', type: 'ERROR'});
        console.error(err);
      }
    })
  }

  getTimestamp(timestamp: Date) {
    return parseTimestamp(timestamp);
  }
}
