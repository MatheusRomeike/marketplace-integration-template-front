import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';
import { getRolesByUrl } from '../../core/configs/navigation.config';

const CLIENT_ID = 'Integration-Template-api';

const normalizeRoles = (roles: string | string[]): string[] =>
  Array.isArray(roles) ? roles : [roles];

const hasRequiredRole = (userRoles: string[], required: string[]) =>
  required.some(role => userRoles.includes(role));

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles } = authData;
  const router = inject(Router);

  if (!authenticated) {
    return router.parseUrl('/');
  }

  // First check route data, then fallback to central navigation config
  let requiredRoles = route.data['roles'];

  if (!requiredRoles) {
    requiredRoles = getRolesByUrl(state.url);
  }

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const clientRoles =
    grantedRoles.resourceRoles?.[CLIENT_ID] || [];

  const rolesToCheck = normalizeRoles(requiredRoles);

  if (hasRequiredRole(clientRoles, rolesToCheck)) {
    return true;
  }

  return router.parseUrl('/forbidden');
};

export const canActivateAuthRole =
  createAuthGuard<CanActivateFn>(isAccessAllowed);