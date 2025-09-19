import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CertificateService } from '../../core/services/certificate.service';
import { Certificate } from '../../model/certificate.model';

@Component({
  selector: 'app-revoke',
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './revoke.component.html',
  styleUrl: './revoke.component.css'
})
export class RevokeComponent implements OnInit {
  certificateService = inject(CertificateService);

  certificates = signal<Certificate[]>([]);
  
  constructor() {}

  ngOnInit(): void {
    this.certificateService.getCertificateByIssuer().subscribe({
      next: (res) => {
        this.certificates.set(res);
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

      },
      error: (res) => {

      }
    })
  }
}
