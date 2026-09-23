// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/educacion-ia/asistente/AsistenteSaludIAPage.tsx
// DESCRIPCIÓN: Vista oficial del Asistente de Salud IA con header verde,
//              espacio amplio sin cortes y privacidad de marca oficial.
// =========================================================================

import React, { useRef, useEffect } from 'react';
import { useAuth } from '../../../../../core/context/useAuth.js';
import { useAIAssistant } from '../../../../../modules/ai-assistant/index.js';
import {
  AsistenteHeader,
  SelectorContextoClinico,
  ChatMessageBubble,
  ChatInputBar,
} from './components/index.js';
import { Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';

export const AsistenteSaludIAPage: React.FC = () => {
  const { user } = useAuth();
  const {
    messages,
    contexts,
    selectedContext,
    setSelectedContext,
    isSending,
    error,
    sendMessage,
    resetChat,
  } = useAIAssistant();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');
  const activeSuggestions = lastAssistantMsg?.suggestedQuestions || [];

  return (
    <div className="w-full space-y-4 max-w-350 mx-auto select-none animate-in fade-in duration-200">
      {/* 1. Cabecera Verde Institucional de MedicOS */}
      <AsistenteHeader
        patientName={user?.firstName}
        onResetChat={resetChat}
      />

      {/* 2. Selector de Contexto Clínico */}
      {contexts.length > 0 && (
        <SelectorContextoClinico
          contexts={contexts}
          selectedContext={selectedContext}
          onSelectContext={setSelectedContext}
        />
      )}

      {/* 3. Área de Conversación Amplia */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 min-h-115 max-h-[58vh] overflow-y-auto space-y-4 shadow-2xs">
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}

        {isSending && (
          <div className="flex gap-2.5 items-center text-xs font-semibold text-teal-800 bg-teal-50 px-4 py-2.5 rounded-2xl w-fit animate-pulse border border-teal-100 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-spin" />
            <span>Preparando explicación educativa personalizada...</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Barra Inferior de Entrada y Sugerencias Rápidas */}
      <div className="space-y-2">
        <ChatInputBar
          onSendMessage={sendMessage}
          isSending={isSending}
          activeSuggestions={activeSuggestions}
        />

        <div className="px-2 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Orientación pedagógica de salud. No sustituye la consulta médica profesional.</span>
          </span>
          <span className="font-semibold text-slate-400">MedicOS</span>
        </div>
      </div>
    </div>
  );
};

export default AsistenteSaludIAPage;