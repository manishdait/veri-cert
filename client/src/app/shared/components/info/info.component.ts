import { Component, input } from '@angular/core';
import { Certificate } from '../../../model/certificate.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-info',
  imports: [FontAwesomeModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  certificate = input.required<Certificate>();

  copy() {
    navigator.clipboard.writeText(this.certificate()!.uuid);
  }
}
