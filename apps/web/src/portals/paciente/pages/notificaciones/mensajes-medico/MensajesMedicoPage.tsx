// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/notificaciones/mensajes-medico/MensajesMedicoPage.tsx
// DESCRIPCIÓN: Panel clínico con cabecera oficial estilo MedicOS, cero scroll
//              en la ventana exterior y scrolls internos completamente invisibles.
// =========================================================================

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, RotateCw, HelpCircle, Activity, Pill, TestTube2 } from 'lucide-react';
import {
  clinicalMessagesService,
  type ClinicalConversationThread,
  type ClinicalMessageItem,
  type ClinicalMessageType,
  type ClinicalMessagePayload,
} from '../../../../../modules/clinical-messages/index.js';
import {
  MensajesMedicoHeader,
  ConversacionesList,
  ChatHeader,
  ChatClinicalContextCard,
  ChatMessageBubble,
  ChatInputBar,
  ModalAdjuntarClinico,
} from './components/index.js';

export const MensajesMedicoPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlThreadId = searchParams.get('threadId');

  const [threads, setThreads] = useState<ClinicalConversationThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ClinicalConversationThread | null>(null);
  const [messages, setMessages] = useState<ClinicalMessageItem[]>([]);
  const [loadingThreads, setLoadingThreads] = useState<boolean>(true);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMessage, setEditingMessage] = useState<ClinicalMessageItem | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const selectedThreadId = selectedThread?.id;

  const sortThreads = (list: ClinicalConversationThread[]): ClinicalConversationThread[] => {
    return [...list].sort((a, b) => {
      const timeA = new Date(a.lastMessage?.createdAt || a.relatedContext.date).getTime();
      const timeB = new Date(b.lastMessage?.createdAt || b.relatedContext.date).getTime();
      return timeB - timeA;
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let isMounted = true;

    clinicalMessagesService
      .getConversations()
      .then((list) => {
        if (!isMounted) return;
        const sorted = sortThreads(list);
        setThreads(sorted);
        if (sorted.length > 0) {
          const target = urlThreadId ? sorted.find((t) => t.id === urlThreadId) : null;
          setSelectedThread(target || sorted[0]);
          setLoadingMessages(true);
        }
        setLoadingThreads(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setThreads([]);
        setLoadingThreads(false);
      });

    return () => {
      isMounted = false;
    };
  }, [urlThreadId]);

  useEffect(() => {
    if (!selectedThreadId) return;
    let isMounted = true;

    clinicalMessagesService
      .getMessages(selectedThreadId)
      .then((msgs) => {
        if (!isMounted) return;
        setMessages(msgs);
        setLoadingMessages(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setMessages([]);
        setLoadingMessages(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedThreadId]);

  const handleSelectThread = (thread: ClinicalConversationThread) => {
    setSelectedThread(thread);
    setEditingMessage(null);
    setLoadingMessages(true);
  };

  const updateThreadWithNewMessage = (newMsg: ClinicalMessageItem) => {
    setMessages((prev) => [...prev, newMsg]);

    setThreads((prevThreads) => {
      const updatedList = prevThreads.map((t) => {
        if (t.id === newMsg.conversationId) {
          return { ...t, lastMessage: newMsg };
        }
        return t;
      });
      return sortThreads(updatedList);
    });
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedThread) return;

    const newMsg = await clinicalMessagesService.sendMessage(selectedThread.id, text, 'TEXT');
    updateThreadWithNewMessage(newMsg);
  };

  const handleAttachClinicalData = async (
    type: ClinicalMessageType,
    content: string,
    payload: ClinicalMessagePayload
  ) => {
    if (!selectedThread) return;

    const newMsg = await clinicalMessagesService.sendMessage(
      selectedThread.id,
      content,
      type,
      payload
    );
    updateThreadWithNewMessage(newMsg);
  };

  const handleStartEdit = (message: ClinicalMessageItem) => {
    setEditingMessage(message);
  };

  const handleSaveEdit = async (messageId: string, newContent: string) => {
    if (!selectedThread) return;

    const updated = await clinicalMessagesService.editMessage(selectedThread.id, messageId, newContent);
    if (!updated) return;

    setMessages((prev) => prev.map((m) => (m.id === messageId ? updated : m)));
    setEditingMessage(null);

    setThreads((prevThreads) =>
      prevThreads.map((t) => {
        if (t.id === selectedThread.id && t.lastMessage?.id === messageId) {
          return { ...t, lastMessage: updated };
        }
        return t;
      })
    );
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!selectedThread) return;

    await clinicalMessagesService.deleteMessage(selectedThread.id, messageId);

    setMessages((prev) => {
      const filtered = prev.filter((m) => m.id !== messageId);
      const newLatest = filtered.length > 0 ? filtered[filtered.length - 1] : undefined;

      setThreads((prevThreads) => {
        const updated = prevThreads.map((t) => {
          if (t.id === selectedThread.id) {
            return { ...t, lastMessage: newLatest };
          }
          return t;
        });
        return sortThreads(updated);
      });

      return filtered;
    });
  };

  return (
    <div className="h-[calc(100dvh-8.25rem)] min-h-130 flex flex-col gap-4 select-none animate-in fade-in duration-200 overflow-hidden">
      {/* 1. Cabecera Institucional Estilo Constancias Médicas */}
      <MensajesMedicoHeader />

      {/* 2. Caja Unificada del Chat (Ocupa exactamente el espacio disponible) */}
      {loadingThreads ? (
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 p-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center space-y-3">
          <RotateCw className="w-6 h-6 animate-spin text-[#1c5752]" />
          <p>Conectando con el canal de mensajes clínicos...</p>
        </div>
      ) : threads.length === 0 ? (
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 p-16 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No hay atenciones médicas registradas</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            El canal de comunicación clínica se activa automáticamente al recibir atención en una consulta presencial o brigada territorial.
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">
          {/* Panel Izquierdo: Lista de Médicos */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 h-full overflow-hidden min-h-0">
            <ConversacionesList
              threads={threads}
              selectedThreadId={selectedThreadId || null}
              onSelectThread={handleSelectThread}
              searchFilter={searchFilter}
              onSearchChange={setSearchFilter}
            />
          </div>

          {/* Panel Derecho: Área de Chat Estilo iOS */}
          <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-slate-100/35">
            {selectedThread ? (
              <>
                {/* Cabecera del Profesional */}
                <ChatHeader thread={selectedThread} />

                {/* Tarjeta Contextual de la Consulta Presencial */}
                <ChatClinicalContextCard thread={selectedThread} />

                {/* Área de Mensajes con Scroll Interno y Barra Oculta */}
                <div className="flex-1 min-h-0 p-4 sm:p-5 overflow-y-auto space-y-2.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <div className="text-center my-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                      Canal Clínico Vinculado · Consulta {selectedThread.relatedContext.code}
                    </span>
                  </div>

                  {loadingMessages ? (
                    <div className="py-16 text-center text-xs text-slate-400">
                      <RotateCw className="w-5 h-5 animate-spin text-[#1c5752] mx-auto" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="max-w-lg mx-auto my-6 p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3.5 text-center">
                      <div className="w-10 h-10 rounded-full bg-teal-50 text-[#1c5752] flex items-center justify-center mx-auto border border-teal-200">
                        <HelpCircle className="w-5 h-5 text-[#1c5752]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-slate-800">
                          ¿Qué puedes consultar con {selectedThread.doctorName}?
                        </h4>
                        <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                          Este canal es exclusivo para resolver dudas sobre tu atención previa. Puedes elegir una opción rápida o escribir libremente:
                        </p>
                      </div>

                      <div className="space-y-2 text-left pt-1">
                        <button
                          type="button"
                          onClick={() => handleSendMessage('Hola Dr(a)., tengo una duda sobre la dosis del medicamento indicado en mi consulta.')}
                          className="w-full p-3 rounded-2xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 text-xs text-slate-700 font-medium transition flex items-center gap-2.5 cursor-pointer shadow-2xs"
                        >
                          <Pill className="w-4 h-4 text-[#1c5752] shrink-0" />
                          <span>Consultar sobre el tratamiento o posología indicada</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsModalOpen(true)}
                          className="w-full p-3 rounded-2xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 text-xs text-slate-700 font-medium transition flex items-center gap-2.5 cursor-pointer shadow-2xs"
                        >
                          <Activity className="w-4 h-4 text-[#1c5752] shrink-0" />
                          <span>Reportar evolución o adjuntar mi Diario de Síntomas</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsModalOpen(true)}
                          className="w-full p-3 rounded-2xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 text-xs text-slate-700 font-medium transition flex items-center gap-2.5 cursor-pointer shadow-2xs"
                        >
                          <TestTube2 className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>Adjuntar un resultado de laboratorio para su valoración</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <ChatMessageBubble
                        key={msg.id}
                        message={msg}
                        onEditMessage={handleStartEdit}
                        onDeleteMessage={handleDeleteMessage}
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Barra de Entrada estilo Cápsula iOS */}
                <ChatInputBar
                  onSendMessage={handleSendMessage}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={() => setEditingMessage(null)}
                  editingMessage={editingMessage}
                  onOpenAttachModal={() => setIsModalOpen(true)}
                  disabled={loadingMessages}
                />
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Modal para adjuntar Diario de Síntomas o Laboratorio */}
      {selectedThread && (
        <ModalAdjuntarClinico
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAttach={handleAttachClinicalData}
          patientId={selectedThread.patientId}
        />
      )}
    </div>
  );
};

export default MensajesMedicoPage;