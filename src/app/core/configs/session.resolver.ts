import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import Keycloak from 'keycloak-js';
import { LocalStorageService } from '../../shared/services/local-storage.service';

export const sessionResolver: ResolveFn<void> = async () => {
  const keycloak = inject(Keycloak);
  const localStorageService = inject(LocalStorageService);

  if (localStorageService.getSession()) return;

  if (!keycloak.authenticated) return;


  const profile = await keycloak.loadUserProfile();
  localStorageService.registerSession({
    name: profile.firstName || profile.username || '',
    email: profile.email ?? '',
  });
};
