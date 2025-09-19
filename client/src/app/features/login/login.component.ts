import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthRequest } from '../../model/auth.model';
import { InputComponent } from '../../shared/components/input/input.component';

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
        this.router.navigate(['/home'], {replaceUrl: true})
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
