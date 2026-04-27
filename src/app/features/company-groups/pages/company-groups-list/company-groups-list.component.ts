import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import DataTableFactory from '../../../../shared/factories/data-table.factory';
import { CommonModule } from '@angular/common';
import { CompanyGroupsService } from '../../services/company-groups.service';
import { GetCompanyGroupsResult } from '../../models/company-groups.result';
import { Breadcrumb, PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { NotifyService } from '../../../../shared/services/notify.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-company-groups-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, EmptyStateComponent, AvatarComponent, RouterModule],
  templateUrl: './company-groups-list.component.html',
  styleUrl: './company-groups-list.component.scss'
})
export class CompanyGroupsListComponent implements OnInit {
  private companyGroupsService = inject(CompanyGroupsService);
  private notifyService = inject(NotifyService);
  private dataTable = new DataTableFactory();

  public breadcrumbs: Breadcrumb[] = [
    { label: 'Home', url: '/home' },
    { label: 'Grupos de Empresas', active: true }
  ];
  public companyGroups: GetCompanyGroupsResult[] = [];
  public isLoading = false;

  ngOnInit(): void {
    this.loadCompanyGroups();
  }

  loadCompanyGroups(): void {
    this.isLoading = true;
    this.companyGroupsService.list().subscribe({
      next: (data) => {
        this.companyGroups = data;
        this.isLoading = false;
        this.dataTable.drawTable('#table-groups', {
          order: [[0, 'asc']]
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearch(event: any): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataTable.searchTable(value);
  }

  onDelete(group: GetCompanyGroupsResult): void {
    this.notifyService.confirmation(
      'Tem certeza?',
      `Deseja realmente excluir o grupo "${group.name}"?`
    ).then((result) => {
      if (result.isConfirmed) {
        this.companyGroupsService.remove(group.id).subscribe({
          next: () => {
            this.notifyService.success('Grupo excluído com sucesso!');
            this.loadCompanyGroups();
          }
        });
      }
    });
  }
}
