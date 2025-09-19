import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QRCodeComponent } from 'angularx-qrcode';
import { CertificateService } from '../../core/services/certificate.service';
import { Certificate } from '../../model/certificate.model';

@Component({
  selector: 'app-view',
  imports: [FontAwesomeModule, QRCodeComponent],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit {
  certificateService = inject(CertificateService)
  route = inject(ActivatedRoute);

  uuid = signal(this.route.snapshot.params['uuid'])
  certificate = signal<Certificate | null>(null);

  verified = signal<boolean|null>(null);

  constructor() {
    console.log(this.route.snapshot.params);    
  }

  ngOnInit(): void {
    this.certificateService.getCertificateById(this.uuid()).subscribe({
      next: (res) => {
        this.certificate.set(res);
      },
      error: (err) => {
        console.error(err);
      }
    })    
  }

  verify() {
    this.certificateService.verifyCertificate(this.certificate()!.uuid).subscribe({
      next: (res) => {
        this.verified.set(res['verified'])
      },
      error: (err) => {
        this.verified.set(false);
      }
    })
  }

  copy() {
    navigator.clipboard.writeText(this.certificate()!.uuid);
  }
}
