import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';
import { AuthenticatedUser } from '../models/authenticated-user';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public authenticatedUser$ = new Subject<AuthenticatedUser>();
  private readonly keycloak = inject(Keycloak);

  public registerSession(session: AuthenticatedUser) {
    localStorage.setItem(environment.userData.session, JSON.stringify(session));
    this.authenticatedUser$.next(session);
  }

  public getSession = (): AuthenticatedUser | null => JSON.parse(localStorage.getItem(environment.userData.session) || 'null');
  public isLogged = (): boolean => !!this.getSession();

  public logout() {
    this.clear();
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  public clear() {
    Object.values(environment.userData).forEach(key => localStorage.removeItem(key));
  }
}


