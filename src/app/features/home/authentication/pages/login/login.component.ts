import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BannerComponent } from '../../components/banner/banner.component';
import { BaseComponent } from '../../../../../core/components/base/base.component';
import { SubmitComponent } from '../../../../../shared/components/submit/submit.component';
import { LocalStorageService } from '../../../../../shared/services/local-storage.service';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, typeEventArgs, ReadyArgs } from 'keycloak-angular';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, BannerComponent, SubmitComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent {
  authenticated = false;
  userName: string | undefined;
  keycloakStatus: string | undefined;
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  private readonly localStorageService = inject(LocalStorageService);

  constructor(private router: Router) {
    super();
    effect(async () => {
      const keycloakEvent = this.keycloakSignal();

      this.keycloakStatus = keycloakEvent.type;

      if (keycloakEvent.type === KeycloakEventType.Ready) {
        this.authenticated = typeEventArgs<ReadyArgs>(keycloakEvent.args);
        if (this.authenticated) {
          const profile = await this.keycloak.loadUserProfile();
          this.userName = profile.firstName || profile.username;
          this.localStorageService.registerSession({
            name: this.userName ?? '',
            email: profile.email ?? '',
          });
        }
      }

      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        this.authenticated = false;
        this.userName = undefined;
        this.localStorageService.clear();
      }
    });
  }

  async login() {
    if (this.authenticated) {
      this.router.navigate(['/home']);
    } else {
      await this.keycloak.login({
        redirectUri: window.location.origin + '/home',
        locale: 'pt-BR',
      });
    }
  }
}
