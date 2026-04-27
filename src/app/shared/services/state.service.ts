import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Tenant } from '../models/tenant';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public tenant$ = new BehaviorSubject<Tenant | null>(null);

  constructor(private localStorageService: LocalStorageService) {
    const session = this.localStorageService.getSession();
    if (session?.tenant) {
      this.tenant$.next(session.tenant);
    }
  }

  public get contextAtual(): number | null {
    return this.tenant$.value?.id || null;
  }

  public get grupoEmpresaAtual(): number | null {
    return this.tenant$.value?.companyGroupId || null;
  }

  public setTenant(tenant: Tenant) {
    const session = this.localStorageService.getSession();
    if (session) {
      session.tenant = tenant;
      this.localStorageService.registerSession(session);
      this.tenant$.next(tenant);
    }
  }

  public limparContexto() {
    const session = this.localStorageService.getSession();
    if (session) {
      delete session.tenant;
      this.localStorageService.registerSession(session);
    }
    this.tenant$.next(null);
  }
}

