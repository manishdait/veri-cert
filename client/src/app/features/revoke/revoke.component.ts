import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CertificateService } from '../../core/services/certificate.service';
import { Certificate } from '../../model/certificate.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { setCertificates, updateCertificate } from '../../store/certificate/certificate.action';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { certificate } from '../../store/certificate/certificate.selector';

@Component({
  selector: 'app-revoke',
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './revoke.component.html',
  styleUrl: './revoke.component.css'
})
export class RevokeComponent implements OnInit {
  store = inject(Store<AppState>);
  certificateService = inject(CertificateService);

  certificates: Observable<Certificate[]>
  
  constructor() {
    this.certificates = this.store.select(certificate);
  }

  ngOnInit(): void {
    this.certificateService.getCertificateByIssuer().subscribe({
      next: (res) => {
        this.store.dispatch(setCertificates({certificates: res}));
      },
      error: (err) => {
      }
    })    
  }

  copy(uuid: string) {
    navigator.clipboard.writeText(uuid);
  }

  revoke(uuid: string) {
    this.certificateService.revokeCertificate(uuid).subscribe({
      next: (res) => {
        this.store.dispatch(updateCertificate({certificate: res}))
      },
      error: (res) => {

      }
    })
  }
}
