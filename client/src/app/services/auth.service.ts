import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { AuthRequest, AuthResponse, RegistrationRequest } from '../model/auth.model';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LocalStorageService } from 'ngx-webstorage';
import { User } from '../model/user.model';

const URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private client: HttpClient;
  private user = signal<User | null>(null);

  constructor(private backend: HttpBackend, private interceptorClient: HttpClient, private storage: LocalStorageService) { 
    this.client = new HttpClient(backend);
  }

  registerUser(request: RegistrationRequest): Observable<AuthResponse> {
    return this.client.post<AuthResponse>(`${URL}/auth/sign-up`, request).pipe(
      switchMap((res) => {
        this.storeResponse(res);

        return this.interceptorClient.get<User>(`${URL}/users/me`).pipe(
          map((userRes) => {
            this.user.set(userRes);
            return res;
          })
        )
      })
    );
  }

  authenticateUser(request: AuthRequest): Observable<AuthResponse> {
    return this.client.post<AuthResponse>(`${URL}/auth/login`, request).pipe(
      switchMap((res) => {
        this.storeResponse(res);
        
        return this.interceptorClient.get<User>(`${URL}/users/me`).pipe(
          map((userRes) => {
            this.user.set(userRes);
            return res;
          })
        )
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.client.post<AuthResponse>(`${URL}/auth/refresh`, null, {headers: {'Authorization': `Bearer ${this.getRefreshToken()}`}}).pipe(
      map(res => {
        this.storeResponse(res);
        return res;
      })
    )
  }

  getAccessToken() {
    return this.storage.retrieve('accessToken');
  }

  getRefreshToken() {
    return this.storage.retrieve('refreshToken');
  }

  getUser() {
    return this.user;
  }

  isAuthenticated(): Observable<boolean> {
    const accessToken = this.storage.retrieve('accessToken');
    if (!accessToken) {
      this.logout()
      return of(false);
    }

    return this.interceptorClient.get<User>(`${URL}/users/me`).pipe(
      map((response) => {
        this.user.set(response);
        return true;
      }),

      catchError((err) => {
        this.logout()
        return of(false);
      })
    );
  }

  logout() {
    this.user.set(null);
    this.storage.clear('accessToken');
    this.storage.clear('refreshToken');
  }

  private storeResponse(res: AuthResponse): void {
    this.storage.store('accessToken', res.accessToken);
    this.storage.store('refreshToken', res.refreshToken);
  }
}
