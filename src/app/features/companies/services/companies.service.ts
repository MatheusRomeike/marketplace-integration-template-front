import { Injectable } from '@angular/core';
import { BaseService } from '../../../core/services/base.service';
import { Company } from '../models/company.model';
import { Observable } from 'rxjs';
import { KeycloakUser } from '../models/keycloak-user.model';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService extends BaseService {

  constructor() {
    super('api/companies');
  }

  getAll(validateUser = false): Observable<Company[]> {
    return this.get<Company[]>(`?validateUser=${validateUser}`);
  }

  getById(id: number): Observable<Company> {
    return this.get<Company>(`/${id}`);
  }

  save(company: Company): Observable<Company> {
    if (company.id) {
      return this.put<Company>(`/${company.id}`, company);
    }
    return this.post<Company>('', company);
  }

  getUsersByGroup(groupId: number, companyId?: number): Observable<KeycloakUser[]> {
    const url = `${this.serverUrl}api/company-groups/${groupId}/users${companyId ? `?companyId=${companyId}` : ''}`;
    return this.http.get<any[]>(url, { headers: this.authHeader() });
  }

  remove(id: number): Observable<void> {
    return this.delete<void>(`/${id}`);
  }

  regenerateApiKey(id: number): Observable<string> {
    return this.post<string>(`/${id}/regenerate-api-key`, {});
  }
}
