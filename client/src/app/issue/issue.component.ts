import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../components/input/input.component';
import { CertificateService } from '../services/certificate.service';
import { CertificateRequest } from '../model/certificate.model';

@Component({
  selector: 'app-issue',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './issue.component.html',
  styleUrl: './issue.component.css'
})
export class IssueComponent {
  certificateService = inject(CertificateService);

  form: FormGroup;
  formError = signal(false);
  
  constructor() {
    this.form = new FormGroup({
      uemail: new FormControl('', [Validators.required, Validators.email]),
      memo: new FormControl('', [Validators.required])
    });
  }

  get formControl() {
    return this.form.controls;
  }

  issueCertificate() {
    if (this.form.invalid) {
      this.formError.set(true);
      return;
    }

    this.formError.set(false);

    const request: CertificateRequest = {
      userEmail: this.form.get('uemail')?.value,
      memo: this.form.get('memo')?.value
    }

    this.certificateService.issueCertificate(request).subscribe({
      next: (res) => {

      },
      error: (err) => {
        
      }
    })
  }
}
