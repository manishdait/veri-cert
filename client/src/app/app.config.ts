import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideNgxWebstorage, withLocalStorage } from 'ngx-webstorage';

import { routes } from './app.routes';
import { RefreshTokenInterceptor } from './core/interceptors/refresh-token.interceptor';
import { AccessTokenInterceptor } from './core/interceptors/access-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideNgxWebstorage(withLocalStorage()),
    provideHttpClient(withInterceptorsFromDi()),
    [
      { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: AccessTokenInterceptor, multi: true }
    ]
  ]
};
