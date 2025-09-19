import { Injectable, signal } from '@angular/core';
import { Alert } from '../../model/alert.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private _alert: Subject<Alert> = new Subject<Alert>();

  constructor() {}

  setAlert(alert: Alert) {
    this._alert.next(alert);
  }

  onAlert(): Observable<Alert> {
    return this._alert.asObservable();
  }
}
