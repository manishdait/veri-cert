import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegistrationRequest } from '../../model/auth.model';
import { InputComponent } from '../../shared/components/input/input.component';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, InputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  role = signal<'USER'|'ISSUER'>('USER')

  form: FormGroup;
  formError = signal(false);

  constructor() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  get formControls() {
    return this.form.controls;
  }

  registerUser() {
    if (this.form.invalid) {
      this.formError.set(true);
      return;
    }

    this.formError.set(false);
    const request: RegistrationRequest = {
      uname: this.form.get('username')?.value,
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
      role: this.role()
    }

    this.authService.registerUser(request).subscribe({
      next: (res) => {
        this.router.navigate(['/home'], {replaceUrl: true});
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
