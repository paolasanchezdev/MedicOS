// =========================================================================
// ARCHIVO: apps/web/src/modules/qr/services/qr.service.ts
// DESCRIPCIÓN: Cliente HTTP para el resolver de QR y auditoría de MedicOS.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient.js';
import type { ResolvePatientQRResponse } from '../types/qr.types.js';

class QRService {
  /**
   * Envía el payload escaneado al backend para validación, auditoría y entrega de datos clínicos.
   */
  async resolvePatientQR(qrPayload: string): Promise<ResolvePatientQRResponse> {
    return apiClient<ResolvePatientQRResponse>('/patients/qr/resolve', {
      method: 'POST',
      body: JSON.stringify({ qrPayload }),
    });
  }
}

export const qrService = new QRService();