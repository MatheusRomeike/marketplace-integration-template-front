import { inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { NAVIGATION_CONFIG, NavItem, NavSection } from '../configs/navigation.config';

const CLIENT_ID = 'Integration-Template-api';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly keycloak = inject(Keycloak);

  /**
   * Returns all navigation sections filtered by user permissions.
   */
  getVisibleSections(): NavSection[] {
    const userRoles = this.getUserRoles();

    return NAVIGATION_CONFIG.map(section => ({
      ...section,
      items: section.items.filter(item => this.hasPermission(item, userRoles))
    })).filter(section => section.items.length > 0);
  }

  /**
   * Returns all searchable items filtered by user permissions and searchable flag.
   */
  getSearchableItems(): NavSection[] {
    const userRoles = this.getUserRoles();

    return NAVIGATION_CONFIG.map(section => ({
      ...section,
      items: section.items.filter(item => item.searchable && this.hasPermission(item, userRoles))
    })).filter(section => section.items.length > 0);
  }

  private getUserRoles(): string[] {
    return this.keycloak.resourceAccess?.[CLIENT_ID]?.roles || [];
  }

  private hasPermission(item: NavItem, userRoles: string[]): boolean {
    if (!item.roles || item.roles.length === 0) return true;

    return item.roles.some(role => this.keycloak.hasResourceRole(role, CLIENT_ID));
  }
}
