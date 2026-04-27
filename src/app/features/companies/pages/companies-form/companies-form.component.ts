import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BaseComponent } from '../../../../core/components/base/base.component';
import { NotifyService } from '../../../../shared/services/notify.service';
import { PageHeaderComponent, Breadcrumb } from '../../../../shared/components/page-header/page-header.component';
import { SubmitComponent } from '../../../../shared/components/submit/submit.component';
import { CompanyGroupSelectComponent } from '../../../../shared/components/company-group-select/company-group-select.component';
import { CompaniesService } from '../../services/companies.service';
import { FormSidebarComponent } from '../../../../shared/components/form-sidebar/form-sidebar.component';
import { FormSidebarInfo, FormSidebarTip } from '../../../../shared/models/form-sidebar.model';
import { Mask } from '../../../../shared/utils/mask';
import { TextMaskDirective } from '../../../../shared/directives/text-mask.directive';
import { LoadingCardDirective } from '../../../../shared/directives/loading-card.directive';
import { KeycloakUser } from '../../models/keycloak-user.model';
import DataTableFactory from '../../../../shared/factories/data-table.factory';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-companies-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PageHeaderComponent,
    CompanyGroupSelectComponent,
    FormSidebarComponent,
    TextMaskDirective,
    LoadingCardDirective,
    AvatarComponent,
    EmptyStateComponent,
    SubmitComponent
  ],
  templateUrl: './companies-form.component.html',
  styleUrls: ['./companies-form.component.scss']
})
export class CompaniesFormComponent extends BaseComponent implements OnInit {
  public mascara = new Mask();
  public breadcrumbs: Breadcrumb[] = [];
  public form: FormGroup;
  public id?: number;
  public users: KeycloakUser[] = [];
  public showIntegrationAdmins = false;
  public isUsersLoading = false;
  private dataTable = new DataTableFactory();
  public apiKey?: string;
  public showKey: boolean = false;

  public tips: FormSidebarTip[] = [
    {
      icon: 'ti ti-info-circle',
      description: 'Certifique-se de que o <strong>CNPJ</strong> está correto para evitar falhas na sincronização.',
      type: 'primary'
    },
    {
      icon: 'ti ti-help',
      description: 'O <strong>E-mail de Contato</strong> será usado para notificações técnicas e de cobrança.',
      type: 'info'
    },
    {
      icon: 'ti ti-users',
      description: 'Você deve selecionar pelo menos um <strong>usuário</strong> que terá acesso a esta empresa.',
      type: 'warning'
    }
  ];

  public get info(): FormSidebarInfo[] {
    const items: FormSidebarInfo[] = [];
    if (this.id) {
      items.push({ label: 'Status', value: 'Ativa', isBadge: true, badgeClass: 'bg-label-success' });
      items.push({ label: 'ID Sistema', value: `#${this.id}`, valueClass: 'fw-bold' });
    }
    return items;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private companiesService: CompaniesService,
    private notifyService: NotifyService
  ) {
    super();
    this.form = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(3)]],
      fantasyName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cnpj: ['', [Validators.required]],
      companyGroupId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.breadcrumbs = [
      { label: 'Home', url: '/home' },
      { label: 'Empresas', url: '/empresas' },
      { label: this.id ? 'Editar Empresa' : 'Nova Empresa', active: true }
    ];

    this.form.get('companyGroupId')?.valueChanges.subscribe(value => {
      if (value) {
        this.loadUsers(value);
      } else {
        this.users = [];
      }
    });

    if (this.id) {
      this.form.get('companyGroupId')?.disable();
      this.loadCompany();
    }
  }

  loadCompany() {
    this.isLoading = true;
    this.companiesService.getById(this.id!).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.apiKey = data.apiKey;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/empresas']);
      }
    });
  }

  public get displayedUsers(): KeycloakUser[] {
    if (this.showIntegrationAdmins) {
      return this.users;
    }
    return this.users.filter(u => u.clienteId !== '000');
  }

  loadUsers(groupId: number) {
    this.isUsersLoading = true;
    this.companiesService.getUsersByGroup(groupId, this.id).subscribe({
      next: (data) => {
        this.users = data;
        this.isUsersLoading = false;
        this.initializeDataTable();
      },
      error: () => {
        this.isUsersLoading = false;
      }
    });
  }

  initializeDataTable() {
    this.dataTable.destroy();

    if (this.displayedUsers.length === 0) return;

    setTimeout(() => {
      const tableElement = document.getElementById('table-users');
      if (!tableElement) return;

      this.dataTable.drawTable('#table-users', {
        order: [[1, 'asc']],
        pageLength: 5,
        autoWidth: false,
        columnDefs: [
          { orderable: false, targets: 0 }
        ]
      });
    }, 0);
  }

  toggleIntegrationAdmins() {
    this.showIntegrationAdmins = !this.showIntegrationAdmins;
    this.initializeDataTable();
  }

  toggleUserSelection(user: KeycloakUser) {
    user.isSelected = !user.isSelected;
  }

  searchUsers(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.dataTable.searchTable(value);
  }

  async onRegenerateApiKey() {
    if (!this.id) return;

    const result = await this.notifyService.confirmation(
      'Regerar API Key?',
      'Atenção: Ao regerar a API Key, todas as integrações externas que utilizam a chave atual perderão a conexão imediatamente. Deseja continuar?'
    );

    if (result.isConfirmed) {
      this.isLoading = true;
      this.companiesService.regenerateApiKey(this.id).subscribe({
        next: (newKey) => {
          this.apiKey = newKey;
          this.notifyService.success('API Key regerada com sucesso!');
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onSubmit() {
    const selectedUsers = this.users.filter(u => u.isSelected).map(u => u.id);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (selectedUsers.length === 0) {
      this.notifyService.warning('Selecione pelo menos um usuário para esta empresa.');
      return;
    }

    this.isLoading = true;
    const payload = { ...this.form.getRawValue(), userIds: selectedUsers };

    this.companiesService.save(payload).subscribe({
      next: () => {
        this.notifyService.success(`Empresa ${this.id ? 'atualizada' : 'criada'} com sucesso!`);
        this.router.navigate(['/empresas']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  copy(key: string) {
    navigator.clipboard.writeText(key);
    // Use notification service
    this.notifyService.success('API Key copiada!');
  }
}
