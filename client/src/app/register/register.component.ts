import { Component, inject, signal } from '@angular/core';
import { InputComponent } from '../components/input/input.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistrationRequest } from '../model/auth.model';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, InputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

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
      role: 'USER'
    }

    this.authService.registerUser(request).subscribe({
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
