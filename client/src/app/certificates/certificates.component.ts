import { Component, inject, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CertificateService } from '../services/certificate.service';
import { Certificate } from '../model/certificate.model';

@Component({
  selector: 'app-certificates',
  imports: [FontAwesomeModule],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.css'
})
export class CertificatesComponent implements OnInit {
  certificateService = inject(CertificateService);

  verifyForm = signal(false);
  certificates = signal<Certificate[]>([]);

  constructor() {}

  setVerifyForm(toggle: boolean) {
    this.verifyForm.set(toggle);
  }

  ngOnInit(): void {
    this.certificateService.getCertificates().subscribe({
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

  async copyUrl(uuid: string) {
    navigator.clipboard.writeText(`http://localhost:4200/view/${uuid}`);
  }
}
