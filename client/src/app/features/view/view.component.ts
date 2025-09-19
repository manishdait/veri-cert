import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QRCodeComponent } from 'angularx-qrcode';
import { CertificateService } from '../../core/services/certificate.service';
import { Certificate } from '../../model/certificate.model';
import { InfoComponent } from '../../shared/components/info/info.component';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-view',
  imports: [FontAwesomeModule, QRCodeComponent, InfoComponent],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit {
  router = inject(Router);
  certificateService = inject(CertificateService);
  themeService = inject(ThemeService);

  route = inject(ActivatedRoute);

  uuid = signal(this.route.snapshot.params['uuid'])
  certificate = signal<Certificate | null>(null);

  darkMode = this.themeService.dark;

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
    this.router.navigate(['/verify'],{queryParams: {'uuid': this.uuid()}});
  }  
}
