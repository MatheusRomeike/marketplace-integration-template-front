import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-not-enabled',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './not-enabled.component.html',
  styleUrls: ['./not-enabled.component.scss']
})
export class NotEnabledComponent {
  private readonly keycloakService = inject(Keycloak);
  private readonly router = inject(Router);

  logout() {
    this.keycloakService.logout();
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
