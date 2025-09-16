import { Component, input, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [FontAwesomeModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: InputComponent,
    multi: true
  }]
})
export class InputComponent implements ControlValueAccessor, OnInit {
  disabled = false;
  value = '';

  onChange!: (value: string) => void;
  OnTouch!: () => void;

  id = input.required<string>();
  placeholder = input.required<string>();
  controlType = input<string>('text');

  type = signal('');

  ngOnInit(): void {
    this.type.set(this.controlType())
  }

  showPassword() {
    if (this.type() === 'password') {
      this.type.set('text');
    } else{
      this.type.set('password');
    }
  }

  setValue(event: Event) {
    if (this.disabled) {
      return;
    }
    
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
    this.OnTouch();
  }

  writeValue(obj: string): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.OnTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled
  }
}
