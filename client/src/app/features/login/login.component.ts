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

  processing = signal(false);
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

    this.form.disable();
    const request: AuthRequest = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value
    }

    this.processing.set(true);
    this.authService.authenticateUser(request).subscribe({
      next: (res) => {
        this.form.enable();
        this.router.navigate(['/home'], {replaceUrl: true});
        this.processing.set(false);
      },
      error: (err) => {
        this.form.enable();
        this.processing.set(false);
        console.error(err);
      }
    });
  }
}
