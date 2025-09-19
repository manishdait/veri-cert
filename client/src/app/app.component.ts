import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { fontawsomeIcons } from './shared/utils/fa-icons';
import { AlertComponent } from './shared/components/alert/alert.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, AlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  router = inject(Router);
  faLibrary = inject(FaIconLibrary);

  navbar = signal(false);

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.navbar.set(!(
          ['/login', '/sign-up'].includes(event.urlAfterRedirects) || 
          event.urlAfterRedirects.startsWith('/view/')
        ))
      }
    });  
  }

  ngOnInit(): void {
    this.faLibrary.addIcons(...fontawsomeIcons);
  }
}
