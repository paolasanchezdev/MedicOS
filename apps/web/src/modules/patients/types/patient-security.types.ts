// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/types/patient-security.types.ts
// DESCRIPCIÓN: Tipos estrictos mapeados directamente desde PostgreSQL y AuditLog.
// =========================================================================

export type SecurityLevel = 'NORMAL' | 'PROTEGIDA' | 'ATENCION';

export interface UserSession {
  id: string;
  device: string;
  os: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export type SecurityEventType = 
  | 'LOGIN'
  | 'LOGOUT'
  | 'PASSWORD_CHANGED'
  | 'SESSION_TERMINATED'
  | 'SETTINGS_CHANGED';

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  title: string;
  description: string;
  timestamp: string;
  rawDate: string;
}

export interface SecurityStatus {
  passwordLastChanged: string;
  twoFactorEnabled: boolean;
  activeSessionsCount: number;
  securityLevel: SecurityLevel;
}

export interface BackendAuditLog {
  id: string;
  action: string;
  entity: string;
  ipAddress?: string | null;
  createdAt: string;
}

export interface BackendSecurityResponse {
  ok: boolean;
  data: {
    passwordLastChanged: string;
    accountCreatedAt: string;
    twoFactorEnabled: boolean;
    auditLogs: BackendAuditLog[];
  };
}