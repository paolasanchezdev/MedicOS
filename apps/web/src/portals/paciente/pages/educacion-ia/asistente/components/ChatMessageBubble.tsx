// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/educacion-ia/asistente/components/ChatMessageBubble.tsx
// DESCRIPCIÓN: Burbuja de conversación con formateador visual para listas,
//              títulos sin '#' ni '---', y negritas estilo iOS Health.
// =========================================================================

import React from 'react';
import { Sparkles, User } from 'lucide-react';
import type { ChatMessage } from '../../../../../../modules/ai-assistant/index.js';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

function renderFormattedLine(rawLine: string) {
  let line = rawLine.trim();

  // Filtrar separadores horizontales Markdown
  if (line === '---' || line === '***' || line === '___') {
    return <hr className="my-2 border-slate-100" />;
  }

  // Detectar y transformar encabezados Markdown (###, ##, #)
  const headingMatch = line.match(/^#{1,4}\s+(.*)$/);
  if (headingMatch && headingMatch[1]) {
    line = headingMatch[1];
    return (
      <p className="font-extrabold text-slate-900 text-xs sm:text-sm mt-2 mb-1 tracking-tight">
        {renderInlineText(line)}
      </p>
    );
  }

  // Detectar listas con viñetas
  const bulletMatch = line.match(/^([*•-]\s+)(.*)$/);
  if (bulletMatch && bulletMatch[2]) {
    return (
      <div className="flex items-start gap-2 my-0.5 pl-1">
        <span className="text-teal-600 font-black leading-tight">•</span>
        <div className="flex-1">{renderInlineText(bulletMatch[2])}</div>
      </div>
    );
  }

  // Detectar listas numeradas
  const numberedMatch = line.match(/^(\d+[.\\)]\s+)(.*)$/);
  if (numberedMatch && numberedMatch[1] && numberedMatch[2]) {
    return (
      <div className="flex items-start gap-2 my-0.5 pl-1">
        <span className="text-teal-700 font-extrabold text-xs leading-tight tabular-nums">
          {numberedMatch[1]}
        </span>
        <div className="flex-1">{renderInlineText(numberedMatch[2])}</div>
      </div>
    );
  }

  return <div>{renderInlineText(line)}</div>;
}

function renderInlineText(text: string) {
  // Dividir por negritas (**texto**) e itálicas (*texto*)
  const tokens = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

  return tokens.map((token, idx) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={idx} className="font-black text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return (
        <span key={idx} className="italic text-slate-700">
          {token.slice(1, -1)}
        </span>
      );
    }
    return <span key={idx}>{token}</span>;
  });
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const timeStr = new Date(message.timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const lines = message.content.split('\n').filter((l) => l.trim().length > 0);

  return (
    <div className={`flex gap-3 items-end select-none ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center shrink-0 mb-1 shadow-2xs">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      <div className={`flex flex-col space-y-1 max-w-[88%] sm:max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-5 py-3.5 rounded-3xl text-xs sm:text-sm leading-relaxed ${
            isUser
              ? 'bg-teal-700 text-white rounded-br-xs shadow-2xs font-medium'
              : 'bg-white border border-slate-200/70 text-slate-800 rounded-bl-xs shadow-2xs space-y-1.5'
          }`}
        >
          {lines.map((line, idx) => (
            <React.Fragment key={idx}>
              {renderFormattedLine(line)}
            </React.Fragment>
          ))}
        </div>

        <span className="text-[10px] text-slate-400 font-medium px-1">
          {timeStr}
        </span>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mb-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default ChatMessageBubble;