import { Component, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CertificateService } from '../../services/certificate.service';

@Component({
  selector: 'app-verify-form',
  imports: [ReactiveFormsModule, FontAwesomeModule, InputComponent],
  templateUrl: './verify-form.component.html',
  styleUrl: './verify-form.component.css'
})
export class VerifyFormComponent {
  certificateService = inject(CertificateService);
  onCancel = output<boolean>();

  key = signal('');
  verified = signal(false);

  formError = signal(false);
  form: FormGroup;
  
  constructor() {
    this.form = new FormGroup({
      key: new FormControl('', [Validators.required])
    });
  }

  get formControl() {
    return this.form.controls;
  }

  cancel() {
    this.onCancel.emit(true);
  }

  verifyCertificate() {
    if (this.form.invalid) {
      this.formError.set(true);
      return;
    }

    this.formError.set(false);

    const key = this.form.get('key')?.value;

    this.certificateService.verifyCertificate(key).subscribe({
      next: (res) => {
        this.key.set(key);
        this.verified.set(res['verified'])
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
}
