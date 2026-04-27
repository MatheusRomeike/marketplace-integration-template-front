import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorMessage } from '../models/error-message.model';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { NotifyService } from '../../shared/services/notify.service';
import { StateService } from '../../shared/services/state.service';

export class BaseService {
  protected http = inject(HttpClient);
  protected localStorageService = inject(LocalStorageService);
  protected notifyService = inject(NotifyService);
  protected stateService = inject(StateService);
  protected serverUrl = environment.serverPath;

  constructor(protected baseUrl: string) { }

  protected get<T>(url: string): Observable<T> {
    return this.http.get<T>(this.buildUrl(url), { headers: this.authHeader() }).pipe(catchError(e => this.handleError(e)));
  }

  protected post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(this.buildUrl(url), body, { headers: this.authHeader() }).pipe(catchError(e => this.handleError(e)));
  }

  protected put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(this.buildUrl(url), body, { headers: this.authHeader() }).pipe(catchError(e => this.handleError(e)));
  }

  protected delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.buildUrl(url), { headers: this.authHeader() }).pipe(catchError(e => this.handleError(e)));
  }

  protected authHeader(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (this.stateService.contextAtual) headers = headers.append('X-Company-Id', String(this.stateService.contextAtual));
    if (this.stateService.grupoEmpresaAtual) headers = headers.append('X-Group-Company-Id', String(this.stateService.grupoEmpresaAtual));

    return headers;
  }

  protected buildUrl(url: string): string {
    return `${this.serverUrl}${this.baseUrl}${url}`;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      this.localStorageService.logout();
    }

    const errorBody = error.error;

    let errors: ErrorMessage[] = Array.isArray(errorBody?.errors) || Array.isArray(errorBody?.Errors)
      ? (errorBody.errors || errorBody.Errors)
      : [];

    if (errors.length === 0 && (errorBody?.message || errorBody?.Message)) {
      errors.push({
        message: errorBody.message || errorBody.Message
      });
    }

    if (errors.length === 0) {
      errors.push({
        message: error.status === 403
          ? 'Você não tem permissão para acessar este recurso.'
          : errorBody?.message || errorBody?.Message || error.message || 'Ocorreu um erro inesperado.'
      });
    }

    errors.forEach(err => this.notifyService.error(err.message));

    return throwError(() => errors);
  }
}



