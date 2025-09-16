import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certificate } from '../model/certificate.model';

const URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private client: HttpClient;

  constructor(private backend: HttpBackend, private interceptorClient: HttpClient) { 
    this.client = new HttpClient(backend);
  }

  getCertificates(): Observable<Certificate[]> {
    return this.interceptorClient.get<Certificate[]>(`${URL}/certificates`);
  }

  verifyCertificate(key: string): Observable<{[key: string]: boolean}> {
    return this.client.get<{[key: string]: boolean}>(`${URL}/certificates/verify/${key}`);
  }
}
