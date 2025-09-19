import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);

  router = inject(Router);

  user = this.authService.getUser();
  dark = this.themeService.dark;

  logout() {
    this.authService.logout();
    this.login();
  }

  login() {
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.themeService.toggle();
  }
}
