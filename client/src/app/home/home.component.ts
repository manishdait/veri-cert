import { Component, inject, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CertificateService } from '../services/certificate.service';
import { Certificate } from '../model/certificate.model';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  authService = inject(AuthService);
  user = this.authService.getUser();
}
