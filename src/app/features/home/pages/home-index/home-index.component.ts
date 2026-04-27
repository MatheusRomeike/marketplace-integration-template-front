import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BaseComponent } from '../../../../core/components/base/base.component';
import { KEYCLOAK_ROLES } from '../../../../shared/constants/auth.constants';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

@Component({
  selector: 'app-home-index',
  templateUrl: './home-index.component.html',
  styleUrl: './home-index.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, HasPermissionDirective],
})
export class HomeIndexComponent extends BaseComponent implements OnInit {
  public nomeUsuario: string = '';
  public roles = KEYCLOAK_ROLES;
  public tenantName: string = '';
  public mockUpdatedAt = new Date();

  public catalogIndicators = [
    {
      label: 'Produtos ativos',
      value: '128',
      hint: '12 alterados na semana',
      icon: 'ti ti-package',
      color: 'primary',
      route: '/produtos',
      roles: [KEYCLOAK_ROLES.PRODUCT]
    },
    {
      label: 'Categorias mapeadas',
      value: '34',
      hint: '8 sem vínculo externo',
      icon: 'ti ti-category',
      color: 'info',
      route: '/categorias',
      roles: []
    },
    {
      label: 'Variações configuradas',
      value: '16',
      hint: '42 opções cadastradas',
      icon: 'ti ti-adjustments-horizontal',
      color: 'success',
      route: '/variacoes',
      roles: []
    }
  ];

  public publishingReadiness = [
    { label: 'Catálogo', percent: 82, className: 'bg-primary' },
    { label: 'Mapeamentos', percent: 64, className: 'bg-info' },
    { label: 'Canais', percent: 75, className: 'bg-success' }
  ];

  public nextActions = [
    {
      title: 'Revisar produtos sem estoque',
      description: 'Ajustar saldo/custo antes de publicar anúncios.',
      icon: 'ti ti-box-seam',
      route: '/produtos',
      roles: [KEYCLOAK_ROLES.PRODUCT]
    },
    {
      title: 'Conectar canais',
      description: 'Validar credenciais antes da publicação multicanal.',
      icon: 'ti ti-plug-connected',
      route: '/integracoes',
      roles: [KEYCLOAK_ROLES.INTEGRATIONS]
    },
    {
      title: 'Monitorar processamentos',
      description: 'Acompanhar webhooks e rotinas de fila recentes.',
      icon: 'ti ti-list-search',
      route: '/logs-processamento',
      roles: []
    }
  ];

  public recentEvents = [
    {
      status: 'Concluído',
      badge: 'bg-label-success',
      title: 'Webhook de produtos processado',
      detail: '100 produtos recebidos para atualização de catálogo',
      time: 'há 12 min'
    },
    {
      status: 'Iniciado',
      badge: 'bg-label-info',
      title: 'Sincronização de mapeamentos',
      detail: 'Categorias e variações em preparação para anúncios',
      time: 'há 28 min'
    },
    {
      status: 'Atenção',
      badge: 'bg-label-warning',
      title: 'Produtos sem categoria',
      detail: '18 itens precisam de revisão antes da publicação',
      time: 'há 1 h'
    }
  ];

  constructor(private localStorageService: LocalStorageService) {
    super();
  }

  ngOnInit() {
    const session = this.localStorageService.getSession();
    this.nomeUsuario = session?.name ?? '';
    this.tenantName = session?.tenant?.name ?? '';
  }
}
