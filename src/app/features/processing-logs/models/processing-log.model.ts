export type ProcessingLogLevel = 'Information' | 'Warning' | 'Error';

export type ProcessingLogStatus = 'Queued' | 'Started' | 'Completed' | 'Failed';

export interface ProcessingLogEvent {
  id: string;
  source: string;
  level: ProcessingLogLevel;
  status: ProcessingLogStatus;
  message: string;
  payloadJson?: string;
  createdAt: string;
}

export interface ProcessingLog {
  id: string;
  companyId: number;
  companyGroupId: number;
  correlationId: string;
  source: string;
  operation: string;
  level: ProcessingLogLevel;
  status: ProcessingLogStatus;
  message: string;
  payloadJson?: string;
  createdAt: string;
  expiresAt?: string;

  eventsCount?: number;
  events?: ProcessingLogEvent[];
}

export interface ProcessingLogFilter {
  companyId?: number;
  operation?: string;
  correlationId?: string;
  createdFrom?: string;
  createdTo?: string;
  limit?: number;
}