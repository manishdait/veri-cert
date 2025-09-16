import { Component, inject, signal } from '@angular/core';
import { InputComponent } from '../components/input/input.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthRequest } from '../model/auth.model';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  form: FormGroup;
  formError = signal(false);

  constructor() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  get formControls() {
    return this.form.controls;
  }

  authenticateUser() {
    if (this.form.invalid) {
      this.formError.set(true);
      return;
    }

    this.formError.set(false);
    const request: AuthRequest = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value
    }

    this.authService.authenticateUser(request).subscribe({
      next: (res) => {
        if (this.authService.getUser()()?.role === 'USER') {
          this.router.navigate(['/home'], {replaceUrl: true})
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
