export interface NavItem {
  title: string;
  url: string;
  icon: string;
  roles?: string[];
  section?: string;
  searchable?: boolean;
}

export interface NavSection {
  title: string;
  icon?: string;
  items: NavItem[];
}

import { KEYCLOAK_ROLES } from '../../shared/constants/auth.constants';

export const NAVIGATION_CONFIG: NavSection[] = [
  {
    title: 'Geral',
    icon: 'ti ti-layout-dashboard',
    items: [
      {
        title: 'Início',
        url: '/home',
        icon: 'ti ti-home',
        roles: [],
        searchable: true,
      }
    ],
  },
  {
    title: 'Catálogo',
    icon: 'ti ti-packages',
    items: [
      {
        title: 'Produtos',
        url: '/produtos',
        icon: 'ti ti-package',
        roles: [KEYCLOAK_ROLES.PRODUCT],
        searchable: true,
      },
      {
        title: 'Categorias',
        url: '/categorias',
        icon: 'ti ti-category',
        roles: [],
        searchable: true,
      },
      {
        title: 'Variações',
        url: '/variacoes',
        icon: 'ti ti-adjustments-horizontal',
        roles: [],
        searchable: true,
      }
    ],
  },
  {
    title: 'Publicação',
    icon: 'ti ti-speakerphone',
    items: [
      {
        title: 'Canais',
        url: '/integracoes',
        icon: 'ti ti-plug-connected',
        roles: [KEYCLOAK_ROLES.INTEGRATIONS],
        searchable: true,
      }
    ],
  },
  {
    title: 'Monitoramento',
    icon: 'ti ti-activity',
    items: [
      {
        title: 'Logs de Processamento',
        url: '/logs-processamento',
        icon: 'ti ti-list-search',
        roles: [],
        searchable: true,
      }
    ],
  },
  {
    title: 'Administração Interna',
    icon: 'ti ti-shield-lock',
    items: [
      {
        title: 'Empresas',
        url: '/empresas',
        icon: 'ti ti-building',
        roles: [KEYCLOAK_ROLES.COMPANY],
        searchable: true,
      },
      {
        title: 'Grupos de Empresas',
        url: '/grupos-empresas',
        icon: 'ti ti-building-community',
        roles: [KEYCLOAK_ROLES.COMPANY_GROUP],
        searchable: true,
      }
    ],
  }
];

export const getRolesByUrl = (url: string): string[] => {
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;

  for (const section of NAVIGATION_CONFIG) {
    const item = section.items.find(i => i.url === normalizedUrl);
    if (item) {
      return item.roles || [];
    }
  }

  return [];
};
