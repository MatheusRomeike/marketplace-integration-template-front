import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Keycloak from 'keycloak-js';
import { BaseComponent } from '../../../../../core/components/base/base.component';
import { SubmitComponent } from '../../../../../shared/components/submit/submit.component';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterModule, SubmitComponent],
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss']
})
export class ForbiddenComponent extends BaseComponent {
  private readonly keycloak = inject(Keycloak);

  constructor(private router: Router) {
    super();
  }

  logout() {
    this.keycloak.logout({
      redirectUri: window.location.origin
    });
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
