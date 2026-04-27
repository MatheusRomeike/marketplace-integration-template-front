import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/components/base/base.component';
import { Select } from '../../models/select.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { NotifyService } from '../../services/notify.service';
import { StateService } from '../../services/state.service';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { AvatarComponent } from '../avatar/avatar.component';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Tenant } from '../../models/tenant';

@Component({
  selector: 'app-company-select',
  templateUrl: './company-select.component.html',
  styleUrl: './company-select.component.scss',
  imports: [NgSelectModule, FormsModule, AvatarComponent],
})
export class CompanySelectComponent extends BaseComponent implements OnInit {
  public value?: number;
  public companies: Array<Tenant> = [];
  private _lastValue?: number;

  constructor(
    private notifyService: NotifyService,
    private router: Router,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.value = this.stateService.contextAtual || undefined;
    this._lastValue = this.value;

    this.getCompanies();

    this.subscriptions.add(
      this.stateService.tenant$.subscribe(tenant => {
        if (tenant && this.value !== tenant.id) {
          this.value = tenant.id;
          this._lastValue = tenant.id;
        }
      })
    );
  }

  private getCompanies() {
    this.userService.GetUserCompanies().subscribe({
      next: (response: Array<Tenant>) => {
        this.companies = response;

        if (this.companies.length > 0) {
          const currentTenantId = this.stateService.contextAtual;
          const currentValid = this.companies.find(c => c.id === currentTenantId);

          if (!currentValid) {
            this.stateService.setTenant(this.companies[0]);
          }
        } else {
          this.stateService.limparContexto();
        }
      },
      error: (err) => {
        console.error('Error loading companies:', err);
      }
    });
  }

  public changeCompany() {
    if (!this.value) return;

    const companyName = this.companies.find(c => c.id === this.value)?.name || 'esta empresa';

    this.notifyService
      .confirmation(
        'Alterar Empresa',
        `Tem certeza que deseja acessar os dados da empresa ${companyName}?`
      )
      .then((resolve) => {
        if (resolve.value) {
          const tenant = this.companies.find(c => c.id === this.value)!;
          this.stateService.setTenant(tenant);

          this.notifyService.success('Empresa alterada com sucesso!');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          this.value = this._lastValue;
        }
      });
  }
}
