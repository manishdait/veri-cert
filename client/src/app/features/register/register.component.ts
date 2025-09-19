import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegistrationRequest } from '../../model/auth.model';
import { InputComponent } from '../../shared/components/input/input.component';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, InputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  router = inject(Router);
  authService = inject(AuthService);
  alertService = inject(AlertService);

  role = signal<'USER'|'ISSUER'>('USER')

  form: FormGroup;
  formError = signal(false);
  processing = signal(false);

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

    this.form.disable();
    const request: RegistrationRequest = {
      uname: this.form.get('username')?.value,
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
      role: this.role()
    }

    this.processing.set(true);
    this.authService.registerUser(request).subscribe({
      next: (res) => {
        this.form.enable();
        this.router.navigate(['/home'], {replaceUrl: true});
        this.processing.set(false);
      },
      error: (err) => {
        this.form.enable();
        this.processing.set(false);

        if (err.error.status === 400) {
          this.alertService.setAlert({message: err.error.message, type: 'WARN'});
        } else {
          this.alertService.setAlert({message: "Error creating account", type: 'ERROR'});
        }

        console.error(err);
      }
    });
  }
}
