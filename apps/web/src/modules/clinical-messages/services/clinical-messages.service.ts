// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-messages/services/clinical-messages.service.ts
// DESCRIPCIÓN: Servicio de consumo API y caché local offline-first con soporte
//              de persistencia, edición y eliminación de mensajes.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient.js';
import type {
  ClinicalConversationThread,
  ClinicalMessageItem,
  ClinicalMessageType,
  ClinicalMessagePayload,
} from '../types/clinical-messages.types.js';

const STORAGE_PREFIX = 'medicos_messages_';

class ClinicalMessagesService {
  private getLocalKey(threadId: string): string {
    return `${STORAGE_PREFIX}${threadId}`;
  }

  async getConversations(): Promise<ClinicalConversationThread[]> {
    try {
      const res = await apiClient<ClinicalConversationThread[]>('/patients/conversations');
      const list = Array.isArray(res) ? res : [];

      // Sincronizar con mensajes locales para asegurar que el último mensaje y orden sean precisos
      return list.map((t) => {
        try {
          const raw = localStorage.getItem(this.getLocalKey(t.id));
          if (raw) {
            const msgs: ClinicalMessageItem[] = JSON.parse(raw);
            if (msgs.length > 0) {
              const latestLocal = msgs[msgs.length - 1];
              const backendTime = t.lastMessage ? new Date(t.lastMessage.createdAt).getTime() : 0;
              const localTime = new Date(latestLocal.createdAt).getTime();

              if (localTime >= backendTime) {
                return { ...t, lastMessage: latestLocal };
              }
            }
          }
        } catch {
          // Fallback a respuesta de red
        }
        return t;
      });
    } catch {
      return [];
    }
  }

  async getMessages(threadId: string): Promise<ClinicalMessageItem[]> {
    try {
      const res = await apiClient<ClinicalMessageItem[]>(`/patients/conversations/${threadId}/messages`);
      const backendMessages = Array.isArray(res) ? res : [];

      // Mezclar con mensajes locales no sincronizados
      const raw = localStorage.getItem(this.getLocalKey(threadId));
      const localList: ClinicalMessageItem[] = raw ? JSON.parse(raw) : [];

      const map = new Map<string, ClinicalMessageItem>();
      backendMessages.forEach((m) => map.set(m.id, m));
      localList.forEach((m) => {
        if (!map.has(m.id)) {
          map.set(m.id, m);
        }
      });

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      localStorage.setItem(this.getLocalKey(threadId), JSON.stringify(merged));
      return merged;
    } catch {
      try {
        const raw = localStorage.getItem(this.getLocalKey(threadId));
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
  }

  async sendMessage(
    threadId: string,
    content: string,
    type: ClinicalMessageType = 'TEXT',
    payload?: ClinicalMessagePayload | undefined
  ): Promise<ClinicalMessageItem> {
    const body: { content: string; type: ClinicalMessageType; payload?: ClinicalMessagePayload | undefined } = {
      content,
      type,
    };
    if (payload !== undefined) {
      body.payload = payload;
    }

    try {
      const res = await apiClient<ClinicalMessageItem>(`/patients/conversations/${threadId}/messages`, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      // Guardar en caché local
      this.appendLocalMessage(threadId, res);
      return res;
    } catch {
      // Fallback offline optimista
      const localMessage: ClinicalMessageItem = {
        id: `local-${Date.now()}`,
        conversationId: threadId,
        senderId: 'current-patient',
        senderRole: 'PATIENT',
        senderName: 'Tú',
        type,
        content,
        payload,
        status: 'SENT',
        createdAt: new Date().toISOString(),
      };

      this.appendLocalMessage(threadId, localMessage);
      return localMessage;
    }
  }

  async editMessage(threadId: string, messageId: string, newContent: string): Promise<ClinicalMessageItem | null> {
    try {
      const res = await apiClient<ClinicalMessageItem>(
        `/patients/conversations/${threadId}/messages/${messageId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ content: newContent }),
        }
      );
      this.updateLocalMessage(threadId, res);
      return res;
    } catch {
      // Actualización optimista local
      const raw = localStorage.getItem(this.getLocalKey(threadId));
      if (!raw) return null;
      const list: ClinicalMessageItem[] = JSON.parse(raw);
      const index = list.findIndex((m) => m.id === messageId);
      if (index === -1) return null;

      list[index].content = newContent;
      list[index].isEdited = true;
      localStorage.setItem(this.getLocalKey(threadId), JSON.stringify(list));
      return list[index];
    }
  }

  async deleteMessage(threadId: string, messageId: string): Promise<boolean> {
    try {
      await apiClient(`/patients/conversations/${threadId}/messages/${messageId}`, {
        method: 'DELETE',
      });
    } catch {
      // Fallback optimista
    }

    // Remover siempre de almacenamiento local
    const raw = localStorage.getItem(this.getLocalKey(threadId));
    if (raw) {
      const list: ClinicalMessageItem[] = JSON.parse(raw);
      const filtered = list.filter((m) => m.id !== messageId);
      localStorage.setItem(this.getLocalKey(threadId), JSON.stringify(filtered));
    }
    return true;
  }

  private appendLocalMessage(threadId: string, message: ClinicalMessageItem) {
    try {
      const raw = localStorage.getItem(this.getLocalKey(threadId));
      const list: ClinicalMessageItem[] = raw ? JSON.parse(raw) : [];
      list.push(message);
      localStorage.setItem(this.getLocalKey(threadId), JSON.stringify(list));
    } catch {
      // Manejo seguro de memoria
    }
  }

  private updateLocalMessage(threadId: string, message: ClinicalMessageItem) {
    try {
      const raw = localStorage.getItem(this.getLocalKey(threadId));
      if (!raw) return;
      const list: ClinicalMessageItem[] = JSON.parse(raw);
      const idx = list.findIndex((m) => m.id === message.id);
      if (idx !== -1) {
        list[idx] = message;
        localStorage.setItem(this.getLocalKey(threadId), JSON.stringify(list));
      }
    } catch {
      // Ignorar error
    }
  }
}

export const clinicalMessagesService = new ClinicalMessagesService();