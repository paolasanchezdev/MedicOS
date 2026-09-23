// =========================================================================
// ARCHIVO: apps/web/src/modules/ai-assistant/services/ai-assistant.service.ts
// DESCRIPCIÓN: Cliente HTTP para interactuar con el Asistente Educativo de Salud.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient.js';
import type {
  ClinicalContextItem,
  ChatMessage,
  ClinicalContextType,
} from '../types/ai-assistant.types.js';

class AIAssistantService {
  private readonly baseUrl = '/ai-assistant';

  async getContexts(): Promise<ClinicalContextItem[]> {
    const res = await apiClient<{ success: boolean; data: ClinicalContextItem[] }>(
      `${this.baseUrl}/contexts`
    );
    return res.data || [];
  }

  async sendMessage(
    message: string,
    contextType?: ClinicalContextType,
    contextItemId?: string,
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<ChatMessage> {
    const res = await apiClient<{ success: boolean; data: ChatMessage }>(
      `${this.baseUrl}/chat`,
      {
        method: 'POST',
        body: JSON.stringify({
          message,
          contextType,
          contextItemId,
          conversationHistory,
        }),
      }
    );
    return res.data;
  }
}

export const aiAssistantService = new AIAssistantService();