import { Component, inject, input, signal } from '@angular/core';
import { Certificate } from '../../../model/certificate.model';
import { CertificateService } from '../../../core/services/certificate.service';
import { NgTemplateOutlet } from '@angular/common';
import { AppState } from '../../../store/app.state';
import { Store } from '@ngrx/store';
import { updateCertificate } from '../../../store/certificate/certificate.action';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-card',
  imports: [NgTemplateOutlet, FontAwesomeModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  certificateService = inject(CertificateService);
  store = inject(Store<AppState>);

  certificate = input.required<Certificate>();
  type = input.required<string>();

  processing = signal(false);

  copy(uuid: string) {
    navigator.clipboard.writeText(uuid);
  }


  copyUrl(uuid: string) {
    navigator.clipboard.writeText(`http://localhost:4200/view/${uuid}`);
  }

  revoke(uuid: string) {
    this.processing.set(true);
    this.certificateService.revokeCertificate(uuid).subscribe({
      next: (res) => {
        this.store.dispatch(updateCertificate({certificate: res}))
        this.processing.set(false);
      },
      error: (err) => {
        this.processing.set(false);
        console.error(err);
      }
    })
  }
}
