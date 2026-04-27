import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CompanyGroupsService } from '../../services/company-groups.service';
import { Breadcrumb, PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { NotifyService } from '../../../../shared/services/notify.service';
import { FormSidebarComponent } from '../../../../shared/components/form-sidebar/form-sidebar.component';
import { FormSidebarInfo, FormSidebarTip } from '../../../../shared/models/form-sidebar.model';
import { LoadingCardDirective } from '../../../../shared/directives/loading-card.directive';

@Component({
  selector: 'app-company-groups-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    RouterModule,
    FormSidebarComponent,
    LoadingCardDirective
  ],
  templateUrl: './company-groups-form.component.html',
  styleUrl: './company-groups-form.component.scss'
})
export class CompanyGroupsFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private companyGroupsService = inject(CompanyGroupsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notifyService = inject(NotifyService);

  public breadcrumbs: Breadcrumb[] = [];
  public tips: FormSidebarTip[] = [
    {
      icon: 'ti ti-layers-intersect',
      description: 'Grupos de empresas permitem organizar suas unidades de negócio por região ou tipo.',
      type: 'primary'
    },
    {
      icon: 'ti ti-link',
      description: 'O <strong>ID Externo</strong> é fundamental para a sincronização com sistemas de ERP legados.',
      type: 'warning'
    }
  ];

  public get info(): FormSidebarInfo[] {
    const items: FormSidebarInfo[] = [];
    if (this.id) {
      items.push({ label: 'Status', value: 'Ativo', isBadge: true, badgeClass: 'bg-label-success' });
      items.push({ label: 'ID Sistema', value: `#${this.id}`, valueClass: 'fw-bold' });
    }
    return items;
  }

  public form: FormGroup;
  public isEdit = false;
  public id?: number;
  public isLoading = false;

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      externalId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    this.breadcrumbs = [
      { label: 'Home', url: '/home' },
      { label: 'Grupos de Empresas', url: '/grupos-empresas' },
      { label: idParam ? 'Editar Grupo' : 'Novo Grupo', active: true }
    ];

    if (idParam) {
      this.isEdit = true;
      this.id = Number(idParam);
      this.loadCompanyGroup();
    }
  }

  loadCompanyGroup(): void {
    if (!this.id) return;

    this.isLoading = true;
    this.companyGroupsService.getById(this.id).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/grupos-empresas']);
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const command = this.form.value;

    if (this.isEdit && this.id) {
      this.companyGroupsService.update(this.id, { ...command, id: this.id }).subscribe({
        next: () => {
          this.notifyService.success('Grupo de empresa atualizado com sucesso!');
          this.router.navigate(['/grupos-empresas']);
        },
        error: () => this.isLoading = false
      });
    } else {
      this.companyGroupsService.create(command).subscribe({
        next: () => {
          this.notifyService.success('Grupo de empresa criado com sucesso!');
          this.router.navigate(['/grupos-empresas']);
        },
        error: () => this.isLoading = false
      });
    }
  }
}
