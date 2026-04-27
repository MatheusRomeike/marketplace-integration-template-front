import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../core/services/base.service';
import { ProcessingLog, ProcessingLogFilter } from '../models/processing-log.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessingLogsService extends BaseService {
  constructor() {
    super('api/processing-logs');
  }

  list(filters: ProcessingLogFilter = {}): Observable<ProcessingLog[]> {
    const query = this.buildQuery(filters);
    return this.get<ProcessingLog[]>(query ? `?${query}` : '');
  }

  private buildQuery(filters: ProcessingLogFilter): string {
    const params = new URLSearchParams();

    if (filters.companyId) params.set('companyId', String(filters.companyId));
    if (filters.operation) params.set('operation', filters.operation);
    if (filters.correlationId) params.set('correlationId', filters.correlationId);
    if (filters.createdFrom) params.set('createdFrom', filters.createdFrom);
    if (filters.createdTo) params.set('createdTo', filters.createdTo);
    if (filters.limit) params.set('limit', String(filters.limit));

    return params.toString();
  }
}
