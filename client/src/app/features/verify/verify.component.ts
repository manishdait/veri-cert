import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute } from '@angular/router';
import { CertificateService } from '../../core/services/certificate.service';
import { Certificate } from '../../model/certificate.model';
import { InputComponent } from '../../shared/components/input/input.component';
import { InfoComponent } from '../../shared/components/info/info.component';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-verify',
  imports: [ReactiveFormsModule, FontAwesomeModule, InputComponent, InfoComponent],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyFormComponent implements OnInit {
  route = inject(ActivatedRoute);
  certificateService = inject(CertificateService);
  alertService = inject(AlertService);

  onCancel = output<boolean>();
  uuid = signal<undefined|string>(this.route.snapshot.queryParams['uuid']);

  verified = signal<null|boolean>(null);
  certificate = signal<null|Certificate>(null);

  processing = signal(false);
  formError = signal(false);
  form: FormGroup;
  
  constructor() {
    this.form = new FormGroup({
      uuid: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    if (this.uuid() && this.uuid() !== undefined) {
      this.form.controls['uuid'].setValue(this.uuid());
      this.verifyCertificate();
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

    this.form.disable();
    this.uuid.set(this.form.get('uuid')?.value);
    this.verify(this.uuid()!);    
  }

  verify(uuid: string) {
    this.processing.set(true);
    this.certificateService.verifyCertificate(uuid).subscribe({
      next: (res) => {
        this.certificateService.getCertificateById(uuid).subscribe(cert => {
          this.form.enable();
          this.processing.set(false);
          this.verified.set(res['verified']);
          this.certificate.set(cert);
        })        
      },
      error: (err) => {
        this.form.enable();
        this.processing.set(false);
        this.verified.set(false);
        this.alertService.setAlert({message: 'Error verifiying certificate', type: 'ERROR'});
        console.error(err);
      }
    })
  }

  close() {
    this.verified.set(null);
    this.certificate.set(null);
  }
}
