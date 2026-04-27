import {
  ApplicationConfig,
  EnvironmentInjector,
  inject,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppInjector } from './app.injector';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { includeBearerTokenInterceptor } from 'keycloak-angular';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { provideKeycloakAngular } from './core/configs/keycloak.config';
import { authErrorInterceptor } from './core/interceptors/auth.interceptor';

registerLocaleData(localePt);
//KeycloakAngularModule
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideKeycloakAngular(),

    provideHttpClient(
      withInterceptors([
        includeBearerTokenInterceptor,
        errorInterceptor,
        authErrorInterceptor
      ])
    ),

    provideEnvironmentInitializer(() => {
      AppInjector.injector = inject(EnvironmentInjector);
    }),
  ],
};
