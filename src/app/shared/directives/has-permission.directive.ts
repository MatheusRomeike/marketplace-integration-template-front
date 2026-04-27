import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import Keycloak from 'keycloak-js';

const CLIENT_ID = 'Integration-Template-api';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private roles: string[] = [];
  private form?: FormGroup;
  private hasView = false;

  @Input() set appHasPermission(value: string | string[] | null | undefined) {
    this.roles = this.normalizeRoles(value);
    this.updateView();
  }

  @Input() set appHasPermissionFormGroup(value: FormGroup | undefined) {
    this.form = value;
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private keycloak: Keycloak
  ) { }

  private updateView(): void {
    if (this.isAllowed()) {
      if (!this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }

      this.form?.enable({ emitEvent: false });
      return;
    }

    this.viewContainer.clear();
    this.hasView = false;
    this.form?.disable({ emitEvent: false });
  }

  private isAllowed(): boolean {
    if (this.roles.length === 0) return true;
    return this.roles.some(role => this.keycloak.hasResourceRole(role, CLIENT_ID));
  }

  private normalizeRoles(value: string | string[] | null | undefined): string[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }
}
