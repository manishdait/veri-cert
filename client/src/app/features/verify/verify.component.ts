import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute } from '@angular/router';
import { CertificateService } from '../../core/services/certificate.service';
import { Certificate } from '../../model/certificate.model';
import { InputComponent } from '../../shared/components/input/input.component';

@Component({
  selector: 'app-verify',
  imports: [ReactiveFormsModule, FontAwesomeModule, InputComponent],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyFormComponent implements OnInit {
  certificateService = inject(CertificateService);
  route = inject(ActivatedRoute);

  onCancel = output<boolean>();
  uuid = signal<undefined|string>(this.route.snapshot.queryParams['uuid']);

  verified = signal<null|boolean>(null);
  certificate = signal<null|Certificate>(null);

  formError = signal(false);
  form: FormGroup;
  
  constructor() {
    this.form = new FormGroup({
      uuid: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    if (this.uuid() && this.uuid() !== undefined) {
      this.verify(this.uuid()!);
    }
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

    this.uuid.set(this.form.get('uuid')?.value);
    this.verify(this.uuid()!);    
  }

  verify(uuid: string) {
    this.certificateService.verifyCertificate(uuid).subscribe({
      next: (res) => {
        this.certificateService.getCertificateById(uuid).subscribe(cert => {
          this.verified.set(res['verified']);
          this.certificate.set(cert);
        })        
      },
      error: (err) => {
        this.verified.set(false);
        console.error(err);
      }
    })
  }

  close() {
    this.verified.set(null);
    this.certificate.set(null);
  }
}
