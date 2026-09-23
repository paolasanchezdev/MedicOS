// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/educacion-ia/asistente/components/ChatInputBar.tsx
// DESCRIPCIÓN: Barra de entrada inferior sin scrollbars visibles y con pastillas limpias.
// =========================================================================

import React, { useState } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
  isSending: boolean;
  activeSuggestions: string[];
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  isSending,
  activeSuggestions,
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSending) return;
    onSendMessage(text);
    setText('');
  };

  return (
    <div className="space-y-2 select-none">
      {/* Sugerencias de 1 toque sin scrollbar tosco */}
      {activeSuggestions.length > 0 && !isSending && (
        <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 px-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            Preguntas rápidas:
          </span>
          {activeSuggestions.map((q, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => onSendMessage(q)}
              className="px-3.5 py-1.5 bg-white hover:bg-teal-50 border border-slate-200/80 hover:border-teal-300 rounded-full text-xs font-semibold text-slate-700 hover:text-teal-900 transition shrink-0 cursor-pointer shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input de texto estilo iOS */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200/90 p-2 shadow-xs flex items-center gap-2"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isSending}
          placeholder="Escribe tu consulta sobre exámenes, medicamentos o estilo de vida..."
          className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 outline-none bg-transparent"
        />

        <button
          type="submit"
          disabled={!text.trim() || isSending}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shrink-0 shadow-2xs"
          title="Enviar consulta"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Consultar</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInputBar;