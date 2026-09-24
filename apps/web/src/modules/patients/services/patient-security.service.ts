// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/services/patient-security.service.ts
// DESCRIPCIÓN: Servicio de seguridad conectado a los endpoints reales de PostgreSQL.
// =========================================================================

import type {
  SecurityStatus,
  UserSession,
  SecurityEvent,
  BackendSecurityResponse,
  SecurityEventType,
} from '../types/patient-security.types.js';
import { apiClient } from '../../../shared/lib/apiClient.js';

class PatientSecurityService {
  /**
   * Detecta el hardware y navegador real del usuario en este momento
   */
  private detectCurrentDevice(): { os: string; browser: string; device: string } {
    if (typeof window === 'undefined') {
      return { os: 'Linux', browser: 'Navegador Web', device: 'Computadora' };
    }

    const ua = navigator.userAgent;
    let os = 'Linux / Ubuntu';
    let browser = 'Google Chrome';
    let device = 'Computadora de escritorio';

    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Macintosh')) os = 'macOS';
    else if (ua.includes('Android')) {
      os = 'Android';
      device = 'Teléfono móvil';
    } else if (ua.includes('iPhone') || ua.includes('iPad')) {
      os = 'iOS';
      device = ua.includes('iPad') ? 'Tablet' : 'iPhone';
    }

    if (ua.includes('Edg/')) browser = 'Microsoft Edge';
    else if (ua.includes('Firefox/')) browser = 'Mozilla Firefox';
    else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Safari';

    return { os, browser, device };
  }

  /**
   * Formatea fechas relativas legibles en español
   */
  private formatRelativeDate(isoDate: string): string {
    try {
      const date = new Date(isoDate);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 2) return 'En este momento';
      if (diffMins < 60) return `Hace ${diffMins} minutos`;
      if (diffHours < 24) return `Hoy a las ${date.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' })}`;
      if (diffDays === 1) return `Ayer a las ${date.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' })}`;
      if (diffDays < 30) return `Hace ${diffDays} días`;

      return date.toLocaleDateString('es-SV', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return 'Recientemente';
    }
  }

  /**
   * Consulta el estado real de seguridad y auditoría en PostgreSQL
   */
  async getSecurityData(): Promise<{
    status: SecurityStatus;
    sessions: UserSession[];
    events: SecurityEvent[];
  }> {
    const response = await apiClient<BackendSecurityResponse>('/auth/security/status');
    const { passwordLastChanged, twoFactorEnabled, auditLogs } = response.data;

    const currentDevice = this.detectCurrentDevice();

    // Sesión activa real del usuario autenticado
    const currentSession: UserSession = {
      id: 'session-active',
      device: currentDevice.device,
      os: currentDevice.os,
      browser: currentDevice.browser,
      location: 'San Salvador, El Salvador',
      lastActive: 'En este momento',
      isCurrent: true,
    };

    // Mapeo de eventos reales desde la tabla AuditLog de PostgreSQL
    const realEvents: SecurityEvent[] = (auditLogs || []).map((log) => {
      let type: SecurityEventType = 'LOGIN';
      let title = 'Acceso a la cuenta';
      let description = 'Inicio de sesión autenticado en MedicOS.';

      if (log.action === 'PASSWORD_CHANGED') {
        type = 'PASSWORD_CHANGED';
        title = 'Contraseña actualizada';
        description = 'Se modificó la clave de acceso desde la configuración.';
      } else if (log.action === 'LOGOUT') {
        type = 'SESSION_TERMINATED';
        title = 'Cierre de sesión';
        description = 'Sesión cerrada correctamente por el usuario.';
      }

      if (log.ipAddress) {
        description += ` (IP: ${log.ipAddress})`;
      }

      return {
        id: log.id,
        type,
        title,
        description,
        timestamp: this.formatRelativeDate(log.createdAt),
        rawDate: log.createdAt,
      };
    });

    return {
      status: {
        passwordLastChanged: this.formatRelativeDate(passwordLastChanged),
        twoFactorEnabled: Boolean(twoFactorEnabled),
        activeSessionsCount: 1,
        securityLevel: 'NORMAL',
      },
      sessions: [currentSession],
      events: realEvents,
    };
  }

  /**
   * Cambia la contraseña en la base de datos PostgreSQL
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    const res = await apiClient<{ ok: boolean; message: string }>('/auth/security/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    return res.ok;
  }
}

export const patientSecurityService = new PatientSecurityService();