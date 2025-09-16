import { Component, inject, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VerifyFormComponent } from '../components/verify-form/verify-form.component';
import { CertificateService } from '../services/certificate.service';
import { Certificate } from '../model/certificate.model';

@Component({
  selector: 'app-home',
  imports: [FontAwesomeModule, VerifyFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
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

  copy(key: string) {
    navigator.clipboard.writeText(key);
  }
}
