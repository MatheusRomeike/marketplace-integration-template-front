import { Injectable } from '@angular/core';
import { BaseService } from '../../../core/services/base.service';
import { Observable } from 'rxjs';
import { GetCompanyGroupsResult } from '../models/company-groups.result';
import { CreateCompanyGroupCommand, UpdateCompanyGroupCommand } from '../models/company-groups.command';

@Injectable({
  providedIn: 'root'
})
export class CompanyGroupsService extends BaseService {
  constructor() {
    super('api/company-groups');
  }

  list(): Observable<GetCompanyGroupsResult[]> {
    return this.get<GetCompanyGroupsResult[]>('');
  }

  getById(id: number): Observable<GetCompanyGroupsResult> {
    return this.get<GetCompanyGroupsResult>(`/${id}`);
  }

  create(command: CreateCompanyGroupCommand): Observable<number> {
    return this.post<number>('', command);
  }

  update(id: number, command: UpdateCompanyGroupCommand): Observable<void> {
    return this.put<void>(`/${id}`, command);
  }

  remove(id: number): Observable<void> {
    return this.delete<void>(`/${id}`);
  }
}
