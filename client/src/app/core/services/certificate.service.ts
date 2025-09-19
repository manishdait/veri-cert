import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Certificate, CertificateRequest } from '../../model/certificate.model';

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
    return this.interceptorClient.get<Certificate[]>(`${URL}/certificates/me`);
  }

  verifyCertificate(uuid: string): Observable<{[uuid: string]: boolean}> {
    return this.client.get<{[uuid: string]: boolean}>(`${URL}/certificates/verify/${uuid}`);
  }

  getCertificateById(uuid: string): Observable<Certificate> {
    return this.client.get<Certificate>(`${URL}/certificates/id/${uuid}`);
  }

  issueCertificate(request: CertificateRequest): Observable<Certificate> {
    return this.interceptorClient.post<Certificate>(`${URL}/certificates/issue`,request);
  }

  getCertificateByIssuer() {
    return this.interceptorClient.get<Certificate[]>(`${URL}/certificates/issue-by/me`);
  }

  revokeCertificate(uuid: string): Observable<Certificate> {
    return this.interceptorClient.put<Certificate>(`${URL}/certificates/revoke/${uuid}`, null);
  }
}
