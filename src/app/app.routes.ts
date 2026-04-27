import { Routes } from '@angular/router';
import { MasterPageComponent } from './core/components/master-page/master-page.component';
import { HomeIndexComponent } from './features/home/pages/home-index/home-index.component';
import { LoginComponent } from './features/home/authentication/pages/login/login.component';
import { ForbiddenComponent } from './features/home/authentication/pages/forbidden/forbidden.component';
import { NotEnabledComponent } from './features/home/authentication/pages/not-enabled/not-enabled.component';
import { canActivateAuthRole } from './shared/guards/keycloak-auth.guard';
import { KEYCLOAK_ROLES } from './shared/constants/auth.constants';
import { sessionResolver } from './core/configs/session.resolver';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'not-enabled', component: NotEnabledComponent },
  {
    path: '',
    component: MasterPageComponent,
    canActivateChild: [canActivateAuthRole],
    resolve: { session: sessionResolver },
    children: [
      {
        path: 'home',
        component: HomeIndexComponent,
      },
      {
        path: 'integracoes',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/integrations/pages/integrations-list/integrations-list.component').then(m => m.IntegrationsListComponent)
          },
          {
            path: 'novo',
            loadComponent: () => import('./features/integrations/pages/integrations-form/integrations-form.component').then(m => m.IntegrationsFormComponent)
          },
          {
            path: 'editar/:id',
            loadComponent: () => import('./features/integrations/pages/integrations-form/integrations-form.component').then(m => m.IntegrationsFormComponent)
          },
          {
            path: 'callback',
            loadComponent: () => import('./features/integrations/pages/integrations-callback/integrations-callback.component').then(m => m.IntegrationsCallbackComponent)
          }
        ]
      },
      {
        path: 'produtos',
        children: [
          {
            path: '',
            data: { roles: [KEYCLOAK_ROLES.PRODUCT] },
            loadComponent: () => import('./features/products/pages/products-list/products-list.component').then(m => m.ProductsListComponent)
          },
          {
            path: 'novo',
            data: { roles: [KEYCLOAK_ROLES.PRODUCT] },
            loadComponent: () => import('./features/products/pages/products-form/products-form.component').then(m => m.ProductsFormComponent)
          },
          {
            path: 'editar/:id',
            data: { roles: [KEYCLOAK_ROLES.PRODUCT] },
            loadComponent: () => import('./features/products/pages/products-form/products-form.component').then(m => m.ProductsFormComponent)
          }
        ]
      },
      {
        path: 'categorias',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/categories/pages/categories-list/categories-list.component').then(m => m.CategoriesListComponent)
          },
          {
            path: 'novo',
            loadComponent: () => import('./features/categories/pages/categories-form/categories-form.component').then(m => m.CategoriesFormComponent)
          },
          {
            path: 'editar/:id',
            loadComponent: () => import('./features/categories/pages/categories-form/categories-form.component').then(m => m.CategoriesFormComponent)
          }
        ]
      },
      {
        path: 'variacoes',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/variations/pages/variations-list/variations-list.component').then(m => m.VariationsListComponent)
          },
          {
            path: 'novo',
            loadComponent: () => import('./features/variations/pages/variations-form/variations-form.component').then(m => m.VariationsFormComponent)
          },
          {
            path: 'editar/:id',
            loadComponent: () => import('./features/variations/pages/variations-form/variations-form.component').then(m => m.VariationsFormComponent)
          }
        ]
      },
      {
        path: 'logs-processamento',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/processing-logs/pages/processing-logs-list/processing-logs-list.component').then(m => m.ProcessingLogsListComponent)
          }
        ]
      },
      {
        path: 'grupos-empresas',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/company-groups/pages/company-groups-list/company-groups-list.component').then(m => m.CompanyGroupsListComponent)
          },
          {
            path: 'novo',
            loadComponent: () => import('./features/company-groups/pages/company-groups-form/company-groups-form.component').then(m => m.CompanyGroupsFormComponent)
          },
          {
            path: 'editar/:id',
            loadComponent: () => import('./features/company-groups/pages/company-groups-form/company-groups-form.component').then(m => m.CompanyGroupsFormComponent)
          }
        ]
      },
      {
        path: 'empresas',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/companies/pages/companies-list/companies-list.component').then(m => m.CompaniesListComponent)
          },
          {
            path: 'novo',
            loadComponent: () => import('./features/companies/pages/companies-form/companies-form.component').then(m => m.CompaniesFormComponent)
          },
          {
            path: 'editar/:id',
            loadComponent: () => import('./features/companies/pages/companies-form/companies-form.component').then(m => m.CompaniesFormComponent)
          }
        ]
      }
    ],
  },
  { path: '**', redirectTo: 'error' },
];
