// =========================================================================
// ARCHIVO: apps/web/src/modules/ai-assistant/hooks/useAIAssistant.ts
// DESCRIPCIÓN: Hook gestor de conversación clínica, contextos y respuestas.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { aiAssistantService } from '../services/ai-assistant.service.js';
import type {
  ChatMessage,
  ClinicalContextItem,
} from '../types/ai-assistant.types.js';

export function useAIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hola, soy tu Asistente Educativo de Salud en MedicOS 👋. Puedo ayudarte a comprender términos médicos, para qué sirve un examen o preparar preguntas para tu próxima consulta médica.',
      timestamp: new Date().toISOString(),
      suggestedQuestions: [
        '¿Qué mide un hemograma completo?',
        '¿Cómo prepararme para mi próxima consulta?',
        '¿Por qué es importante tomar mis medicamentos a tiempo?',
      ],
    },
  ]);

  const [contexts, setContexts] = useState<ClinicalContextItem[]>([]);
  const [selectedContext, setSelectedContext] = useState<ClinicalContextItem | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    aiAssistantService
      .getContexts()
      .then((data) => {
        if (isSubscribed) setContexts(data);
      })
      .catch(() => {});

    return () => {
      isSubscribed = false;
    };
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isSending) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text.trim(),
        timestamp: new Date().toISOString(),
        contextType: selectedContext?.type || 'GENERAL',
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsSending(true);
      setError(null);

      try {
        const history = messages.map((m) => ({ role: m.role, content: m.content }));
        const assistantMsg = await aiAssistantService.sendMessage(
          text.trim(),
          selectedContext?.type,
          selectedContext?.id,
          history
        );
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        setError((err as Error).message || 'No fue posible conectar con el asistente de salud.');
      } finally {
        setIsSending(false);
      }
    },
    [isSending, messages, selectedContext]
  );

  const resetChat = useCallback(() => {
    setSelectedContext(null);
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content:
          'Iniciamos una nueva consulta educativa. ¿Sobre qué tema de salud o examen de tu expediente te gustaría aprender?',
        timestamp: new Date().toISOString(),
        suggestedQuestions: [
          '¿Qué significa mi resultado de hemoglobina?',
          '¿Qué preguntas debo hacerle a mi médico?',
          '¿Por qué debo mantenerme hidratado?',
        ],
      },
    ]);
  }, []);

  return {
    messages,
    contexts,
    selectedContext,
    setSelectedContext,
    isSending,
    error,
    sendMessage,
    resetChat,
  };
}