// =========================================================================
// ARCHIVO: apps/web/src/modules/personalized-advice/services/personalized-advice.service.ts
// DESCRIPCIÓN: Cliente HTTP para consumir los consejos personalizados de salud
//              usando el cliente funcional centralizado apiClient(endpoint, options).
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient.js';
import type { PersonalizedAdviceResponse } from '../types/personalized-advice.types.js';

export class PersonalizedAdviceService {
  async fetchAdvice(): Promise<PersonalizedAdviceResponse> {
    return apiClient<PersonalizedAdviceResponse>('/personalized-advice');
  }

  async sendAdviceFeedback(adviceId: string, action: 'DISMISS' | 'APPLY'): Promise<void> {
    try {
      await apiClient<void>('/personalized-advice/action', {
        method: 'POST',
        body: JSON.stringify({ adviceId, action }),
      });
    } catch {
      // Registro silencioso de feedback
    }
  }
}

export const personalizedAdviceService = new PersonalizedAdviceService();