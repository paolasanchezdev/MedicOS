// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/notificaciones/mensajes-medico/components/ChatInputBar.tsx
// DESCRIPCIÓN: Barra de redacción estilo iOS Messages con sincronización
//              de edición libre de renders en cascada (React 19 compliant).
// =========================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, Activity, TestTube2, Pencil, X, Check } from 'lucide-react';
import type { ClinicalMessageItem } from '../../../../../../modules/clinical-messages/types/clinical-messages.types.js';

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
  onSaveEdit: (messageId: string, newText: string) => void;
  onCancelEdit: () => void;
  editingMessage: ClinicalMessageItem | null;
  onOpenAttachModal: () => void;
  disabled?: boolean;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  onSaveEdit,
  onCancelEdit,
  editingMessage,
  onOpenAttachModal,
  disabled = false,
}) => {
  const currentEditingId = editingMessage ? editingMessage.id : null;
  const [prevEditingId, setPrevEditingId] = useState<string | null>(currentEditingId);
  const [inputText, setInputText] = useState(editingMessage ? editingMessage.content : '');
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Sincronización en render (evita cascading renders en useEffect)
  if (currentEditingId !== prevEditingId) {
    setPrevEditingId(currentEditingId);
    setInputText(editingMessage ? editingMessage.content : '');
  }

  // El efecto se encarga únicamente de manipular el foco del DOM
  useEffect(() => {
    if (editingMessage) {
      inputRef.current?.focus();
    }
  }, [editingMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || disabled) return;

    if (editingMessage) {
      onSaveEdit(editingMessage.id, inputText.trim());
    } else {
      onSendMessage(inputText.trim());
    }
    setInputText('');
  };

  const handleCancel = () => {
    setInputText('');
    onCancelEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape' && editingMessage) {
      handleCancel();
    }
  };

  return (
    <div className="border-t border-slate-200/80 bg-white/95 backdrop-blur-md p-3 sm:p-4 space-y-2.5">
      {/* Banner de Edición Activa estilo iOS */}
      {editingMessage && (
        <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-[#1c5752] animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 rounded-full bg-teal-100 text-[#1c5752]">
              <Pencil className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="font-bold block">Editando mensaje</span>
              <p className="text-[11px] text-slate-500 truncate max-w-sm sm:max-w-md">
                "{editingMessage.content}"
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            title="Cancelar edición (Esc)"
            className="p-1.5 rounded-full hover:bg-teal-200/50 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Píldoras Rápidas de Adjuntos */}
      {!editingMessage && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAttachModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-[#1c5752] border border-slate-200/60 text-[11px] font-bold transition cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-[#1c5752]" />
              <span>Diario de Síntomas</span>
            </button>
            <button
              type="button"
              onClick={onOpenAttachModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 border border-slate-200/60 text-[11px] font-bold transition cursor-pointer"
            >
              <TestTube2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Laboratorio</span>
            </button>
          </div>

          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
            Canal Clínico Privado
          </span>
        </div>
      )}

      {/* Barra de Entrada estilo Cápsula iOS */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {!editingMessage && (
          <button
            type="button"
            onClick={onOpenAttachModal}
            disabled={disabled}
            title="Adjuntar registro clínico"
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-[#1c5752] border border-slate-200/70 transition flex items-center justify-center cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}

        {/* Input Redondeado estilo Cápsula */}
        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              editingMessage
                ? 'Edita tu mensaje... (Enter para guardar, Esc para cancelar)'
                : 'Escribe tu consulta médica... (Enter para enviar)'
            }
            className="w-full py-2.5 px-4 text-xs text-slate-800 bg-slate-100/80 border border-slate-200/70 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1c5752]/20 focus:border-[#1c5752] focus:bg-white transition resize-none placeholder-slate-400 shadow-2xs"
          />
        </div>

        {/* Botón Circular de Envío / Guardado */}
        <button
          type="submit"
          disabled={!inputText.trim() || disabled}
          className="w-10 h-10 rounded-full bg-[#1c5752] hover:bg-[#164743] disabled:opacity-40 text-white transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95 shrink-0"
        >
          {editingMessage ? <Check className="w-4 h-4 text-white" /> : <Send className="w-4 h-4 text-white" />}
        </button>
      </form>
    </div>
  );
};

export default ChatInputBar;