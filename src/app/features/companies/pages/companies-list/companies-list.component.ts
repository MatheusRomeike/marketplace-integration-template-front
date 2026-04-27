import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseComponent } from '../../../../core/components/base/base.component';
import { NotifyService } from '../../../../shared/services/notify.service';
import { PageHeaderComponent, Breadcrumb } from '../../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { CompaniesService } from '../../services/companies.service';
import { Company } from '../../models/company.model';
import DataTableFactory from '../../../../shared/factories/data-table.factory';
import { CpfCnpjPipe } from '../../../../shared/pipes/cpfCnpj.pipe';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, EmptyStateComponent, AvatarComponent, CpfCnpjPipe],
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss']
})
export class CompaniesListComponent extends BaseComponent implements OnInit {
  public breadcrumbs: Breadcrumb[] = [
    { label: 'Home', url: '/home' },
    { label: 'Empresas', active: true }
  ];
  public companies: Company[] = [];
  private dataTable = new DataTableFactory();

  constructor(
    private companiesService: CompaniesService,
    private notifyService: NotifyService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadCompanies();
  }


  loadCompanies() {
    this.isLoading = true;

    this.companiesService.getAll().subscribe({
      next: (data) => {
        this.companies = data;
        this.isLoading = false;
        if (this.companies.length > 0) {
          setTimeout(() => {
            this.dataTable.drawTable('#table-companies', {
              order: [[0, 'asc']],
            });
          }, 0);
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onDelete(company: Company) {
    this.notifyService.confirmation(
      'Excluir Empresa',
      `Tem certeza que deseja excluir a empresa ${company.name}?`
    ).then((result) => {
      if (result.isConfirmed) {
        this.companiesService.remove(company.id).subscribe({
          next: () => {
            this.notifyService.success('Empresa excluída com sucesso!');
            this.loadCompanies();
          }
        });
      }
    });
  }

  onSearch(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.dataTable.searchTable(value);
  }
}
