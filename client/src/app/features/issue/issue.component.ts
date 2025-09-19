import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CertificateService } from '../../core/services/certificate.service';
import { CertificateRequest } from '../../model/certificate.model';
import { InputComponent } from '../../shared/components/input/input.component';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-issue',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './issue.component.html',
  styleUrl: './issue.component.css'
})
export class IssueComponent {
  certificateService = inject(CertificateService);
  alertService = inject(AlertService);

  processing = signal(false);
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

    this.processing.set(true);
    this.certificateService.issueCertificate(request).subscribe({
      next: (res) => {
        this.processing.set(false);
        this.form.reset();
        this.alertService.setAlert({message:`Issued certificate to ${res.user}`, type: 'SUCCESS'});
      },
      error: (err) => {
        this.alertService.setAlert({message:'Error occur while issuing certificate', type: 'ERROR'});
        this.processing.set(false);
        this.form.reset();
      }
    })
  }
}
