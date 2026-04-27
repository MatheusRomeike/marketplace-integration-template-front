import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { NgbModal, NgbModalModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../core/components/base/base.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import {
  Breadcrumb,
  PageHeaderComponent
} from '../../../../shared/components/page-header/page-header.component';
import {
  ProcessingLog,
  ProcessingLogEvent,
  ProcessingLogFilter,
  ProcessingLogLevel,
  ProcessingLogStatus
} from '../../models/processing-log.model';
import { ProcessingLogsService } from '../../services/processing-logs.service';

type DatePreset = 'today' | 'last-hour' | 'last-24h' | 'last-7d' | 'last-30d' | 'custom';

@Component({
  selector: 'app-processing-logs-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    NgbNavModule,
    PageHeaderComponent,
    EmptyStateComponent
  ],
  templateUrl: './processing-logs-list.component.html',
  styleUrl: './processing-logs-list.component.scss'
})
export class ProcessingLogsListComponent extends BaseComponent implements OnInit {
  public breadcrumbs: Breadcrumb[] = [
    { label: 'Início', url: '/home' },
    { label: 'Logs de Processamento', active: true }
  ];

  public logs: ProcessingLog[] = [];
  public filteredLogs: ProcessingLog[] = [];
  public selectedLog?: ProcessingLog;
  public openedPayloadId: string | number | null = null;

  public activeCompanyName = this.stateService.tenant$.value?.name || '';

  public minCreatedAt = this.toDateTimeLocal(this.daysAgo(30));
  public maxCreatedAt = this.toDateTimeLocal(new Date());

  public activePreset: DatePreset = 'last-24h';

  public datePresets: Array<{ value: DatePreset; label: string }> = [
    { value: 'today', label: 'Hoje' },
    { value: 'last-hour', label: 'Última hora' },
    { value: 'last-24h', label: 'Últimas 24h' },
    { value: 'last-7d', label: 'Últimos 7 dias' },
    { value: 'last-30d', label: 'Últimos 30 dias' }
  ];

  public operations = [
    { value: 'product-webhook', label: 'Webhook de produtos' }
  ];

  public statuses: Array<{ value: ProcessingLogStatus | ''; label: string }> = [
    { value: '', label: 'Todos' },
    { value: 'Queued', label: 'Na fila' },
    { value: 'Started', label: 'Iniciado' },
    { value: 'Completed', label: 'Concluído' },
    { value: 'Failed', label: 'Falhou' }
  ];

  public filters: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private processingLogsService: ProcessingLogsService
  ) {
    super();

    const defaultRange = this.buildDateRange('last-24h');

    this.filters = this.fb.group(
      {
        companyId: [this.stateService.contextAtual],
        operation: ['product-webhook'],
        status: [''],
        correlationId: [''],
        createdFrom: [defaultRange.from, [Validators.required]],
        createdTo: [defaultRange.to, [Validators.required]],
        limit: [100, [Validators.required, Validators.min(1), Validators.max(500)]]
      },
      {
        validators: [this.dateRangeValidator.bind(this)]
      }
    );

    this.filters.get('createdFrom')?.valueChanges.subscribe(() => this.markCustomPeriod());
    this.filters.get('createdTo')?.valueChanges.subscribe(() => this.markCustomPeriod());
  }

  ngOnInit(): void {
    this.loadLogs();
  }

  public loadLogs(): void {
    this.refreshMaxDate();

    if (this.filters.invalid) {
      this.filters.markAllAsTouched();
      return;
    }

    this.normalizePeriod();

    this.isLoading = true;

    this.processingLogsService.list(this.buildApiFilters()).subscribe({
      next: (logs) => {
        this.logs = logs.sort((a, b) => this.dateTicks(b.createdAt) - this.dateTicks(a.createdAt));
        this.applyVisualFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  public clearFilters(): void {
    const defaultRange = this.buildDateRange('last-24h');
    this.activePreset = 'last-24h';

    this.filters.patchValue(
      {
        companyId: this.stateService.contextAtual,
        operation: 'product-webhook',
        status: '',
        correlationId: '',
        createdFrom: defaultRange.from,
        createdTo: defaultRange.to,
        limit: 100
      },
      { emitEvent: false }
    );

    this.loadLogs();
  }

  public setDatePreset(preset: DatePreset): void {
    const range = this.buildDateRange(preset);
    this.activePreset = preset;

    this.filters.patchValue(
      {
        createdFrom: range.from,
        createdTo: range.to
      },
      { emitEvent: false }
    );

    this.filters.updateValueAndValidity();
  }

  public refreshCurrentPeriod(): void {
    const preset = this.activePreset === 'custom' ? 'last-24h' : this.activePreset;
    this.setDatePreset(preset);
    this.loadLogs();
  }

  public openDetails(log: ProcessingLog, content: TemplateRef<unknown>): void {
    this.selectedLog = log;

    this.modalService.open(content, {
      centered: true,
      scrollable: true,
      size: 'xl',
      windowClass: 'modal-processing-log'
    });
  }

  public applyVisualFilters(): void {
    const status = this.filters.get('status')?.value;

    this.filteredLogs = status
      ? this.logs.filter(log => log.status === status)
      : [...this.logs];
  }

  public buildApiFilters(): ProcessingLogFilter {
    const value = this.filters.getRawValue();

    return {
      companyId: value.companyId || undefined,
      operation: value.operation || undefined,
      correlationId: value.correlationId?.trim() || undefined,
      createdFrom: this.toIsoDate(value.createdFrom),
      createdTo: this.toIsoDate(value.createdTo),
      limit: Number(value.limit || 100)
    };
  }

  public get selectedPeriodLabel(): string {
    return this.datePresets.find(item => item.value === this.activePreset)?.label || 'Período personalizado';
  }

  public get periodSummary(): string {
    const createdFrom = this.filters.get('createdFrom')?.value;
    const createdTo = this.filters.get('createdTo')?.value;

    if (!createdFrom || !createdTo) {
      return 'Selecione um período para buscar os logs.';
    }

    return `${this.formatDateTime(createdFrom)} até ${this.formatDateTime(createdTo)}`;
  }

  public get totalEvents(): number {
    return this.filteredLogs.reduce((total, log) => total + this.eventsCount(log), 0);
  }

  public hasInvalidPeriod(): boolean {
    return !!this.filters.errors?.['invalidDateRange'] &&
      (this.filters.get('createdFrom')?.touched || this.filters.get('createdTo')?.touched);
  }

  public statusLabel(status: ProcessingLogStatus): string {
    const labels: Record<ProcessingLogStatus, string> = {
      Queued: 'Na fila',
      Started: 'Iniciado',
      Completed: 'Concluído',
      Failed: 'Falhou'
    };

    return labels[status] || status;
  }

  public statusBadge(status: ProcessingLogStatus): string {
    const classes: Record<ProcessingLogStatus, string> = {
      Queued: 'bg-label-secondary',
      Started: 'bg-label-info',
      Completed: 'bg-label-success',
      Failed: 'bg-label-danger'
    };

    return classes[status] || 'bg-label-secondary';
  }

  public levelBadge(level: ProcessingLogLevel | string): string {
    const classes: Record<string, string> = {
      Information: 'bg-label-info',
      Warning: 'bg-label-warning',
      Error: 'bg-label-danger'
    };

    return classes[level] || 'bg-label-secondary';
  }

  public levelLabel(level: ProcessingLogLevel | string): string {
    const labels: Record<string, string> = {
      Information: 'Informação',
      Warning: 'Aviso',
      Error: 'Erro'
    };

    return labels[level] || level;
  }

  formatPayload(payload: string | object | null | undefined): string {
    if (!payload) {
      return '';
    }

    try {
      const parsed = typeof payload === 'string'
        ? JSON.parse(payload)
        : payload;

      return JSON.stringify(parsed, null, 2);
    } catch {
      return String(payload);
    }
  }

  copyPayload(payload: string | object | null | undefined): void {
    const formatted = this.formatPayload(payload);

    navigator.clipboard.writeText(formatted);
  }

  public processingEvents(log: ProcessingLog): ProcessingLogEvent[] {
    if (log.events?.length) {
      return [...log.events].sort((a, b) => this.dateTicks(a.createdAt) - this.dateTicks(b.createdAt));
    }

    return [{
      id: log.id,
      source: log.source,
      level: log.level,
      status: log.status,
      message: log.message,
      payloadJson: log.payloadJson,
      createdAt: log.createdAt
    }];
  }

  public eventsCount(log: ProcessingLog): number {
    return log.eventsCount || log.events?.length || 1;
  }

  public isInvalid(controlName: string): boolean {
    const control = this.filters.get(controlName);

    return !!control && control.invalid && (control.dirty || control.touched);
  }

  public relativeDate(value: string): string {
    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    if (Number.isNaN(diffMs)) return '';

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'agora há pouco';
    if (diffMinutes < 60) return `há ${diffMinutes} min`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays === 1) return 'ontem';
    if (diffDays < 30) return `há ${diffDays} dias`;

    return '';
  }

  private buildDateRange(preset: DatePreset): { from: string; to: string } {
    this.refreshMaxDate();

    const now = new Date();
    const from = new Date(now);

    switch (preset) {
      case 'today':
        from.setHours(0, 0, 0, 0);
        break;
      case 'last-hour':
        from.setHours(now.getHours() - 1);
        break;
      case 'last-24h':
        from.setHours(now.getHours() - 24);
        break;
      case 'last-7d':
        from.setDate(now.getDate() - 7);
        break;
      case 'last-30d':
        from.setDate(now.getDate() - 30);
        break;
      default:
        from.setHours(now.getHours() - 24);
        break;
    }

    const minDate = new Date(this.minCreatedAt);

    return {
      from: this.toDateTimeLocal(from < minDate ? minDate : from),
      to: this.toDateTimeLocal(now)
    };
  }

  private markCustomPeriod(): void {
    if (this.activePreset !== 'custom') {
      this.activePreset = 'custom';
    }
  }

  private dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const createdFrom = control.get('createdFrom')?.value;
    const createdTo = control.get('createdTo')?.value;

    if (!createdFrom || !createdTo) return null;

    const from = new Date(createdFrom);
    const to = new Date(createdTo);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      return { invalidDateRange: true };
    }

    return from > to ? { invalidDateRange: true } : null;
  }

  private toIsoDate(value?: string | null): string | undefined {
    if (!value) return undefined;

    return new Date(value).toISOString();
  }

  private normalizePeriod(): void {
    const minDate = new Date(this.minCreatedAt);
    const maxDate = new Date(this.maxCreatedAt);

    const createdFromValue = this.filters.get('createdFrom')?.value;
    const createdToValue = this.filters.get('createdTo')?.value;

    if (!createdFromValue || !createdToValue) return;

    const createdFrom = new Date(createdFromValue);
    const createdTo = new Date(createdToValue);

    let nextFrom = createdFrom < minDate ? this.minCreatedAt : createdFromValue;
    let nextTo = createdTo > maxDate ? this.maxCreatedAt : createdToValue;

    if (new Date(nextFrom) > new Date(nextTo)) {
      nextTo = nextFrom;
    }

    this.filters.patchValue(
      {
        createdFrom: nextFrom,
        createdTo: nextTo
      },
      { emitEvent: false }
    );
  }

  private refreshMaxDate(): void {
    this.maxCreatedAt = this.toDateTimeLocal(new Date());
  }

  private toDateTimeLocal(date: Date): string {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    return offsetDate.toISOString().slice(0, 16);
  }

  private daysAgo(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return date;
  }

  private dateTicks(value: string): number {
    return new Date(value).getTime();
  }

  private formatDateTime(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '-';

    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  public operationLabel(value: string): string {
    return this.operations.find(operation => operation.value === value)?.label || value;
  }

  public timelinePointClass(status: ProcessingLogStatus): string {
    const classes: Record<ProcessingLogStatus, string> = {
      Queued: 'timeline-point-secondary',
      Started: 'timeline-point-info',
      Completed: 'timeline-point-success',
      Failed: 'timeline-point-danger'
    };

    return classes[status] || 'timeline-point-secondary';
  }

  togglePayload(eventId: string | number): void {
    this.openedPayloadId = this.openedPayloadId === eventId
      ? null
      : eventId;
  }

  isPayloadOpen(eventId: string | number): boolean {
    return this.openedPayloadId === eventId;
  }
}