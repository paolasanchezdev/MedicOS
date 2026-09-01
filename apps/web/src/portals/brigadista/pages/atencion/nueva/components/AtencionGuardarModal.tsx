// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionGuardarModal.tsx
// DESCRIPCIÓN: Diálogo modal de confirmación, guardado exitoso y contingencia offline.
// =========================================================================

import React from 'react';
import {
  HelpCircle,
  CheckCircle2,
  CloudOff,
  AlertTriangle,
  Loader2,
  FileText,
  PlusCircle,
  X,
} from 'lucide-react';

export type GuardarModalEstado = 'CONFIRMAR' | 'GUARDANDO' | 'EXITO' | 'EXITO_OFFLINE' | 'ERROR';

interface AtencionGuardarModalProps {
  isOpen: boolean;
  estado: GuardarModalEstado;
  pacienteNombre?: string;
  fechaTexto?: string;
  mensajeError?: string | null;
  onClose: () => void;
  onConfirmarGuardar: () => void;
  onVerExpediente: () => void;
  onNuevaAtencion: () => void;
}

export const AtencionGuardarModal: React.FC<AtencionGuardarModalProps> = ({
  isOpen,
  estado,
  pacienteNombre = 'Persona no especificada',
  fechaTexto,
  mensajeError,
  onClose,
  onConfirmarGuardar,
  onVerExpediente,
  onNuevaAtencion,
}) => {
  if (!isOpen) return null;

  const fechaHoy = fechaTexto || new Date().toLocaleDateString('es-SV', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 text-center relative animate-in fade-in zoom-in-95 duration-200">
        {/* Estado 1: Confirmación antes de persistir */}
        {estado === 'CONFIRMAR' && (
          <>
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
              <HelpCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">¿Guardar atención?</h3>
              <p className="text-xs text-slate-500">
                La información registrada se incorporará al expediente del paciente.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-left text-xs space-y-1">
              <p className="text-slate-600">
                <span className="font-bold text-slate-800">Persona:</span> {pacienteNombre}
              </p>
              <p className="text-slate-600">
                <span className="font-bold text-slate-800">Fecha:</span> {fechaHoy}
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirmarGuardar}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
              >
                Guardar atención
              </button>
            </div>
          </>
        )}

        {/* Estado 2: Guardando en proceso */}
        {estado === 'GUARDANDO' && (
          <div className="py-6 space-y-3">
            <Loader2 className="w-10 h-10 text-teal-600 animate-spin mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Guardando atención...</h3>
            <p className="text-xs text-slate-500">Estructurando datos y sincronizando con MedicOS.</p>
          </div>
        )}

        {/* Estado 3: Éxito Online */}
        {estado === 'EXITO' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">✓ Atención registrada</h3>
              <p className="text-xs text-slate-500">
                La atención fue guardada y sincronizada correctamente en el servidor.
              </p>
            </div>

            <div className="flex space-x-3 pt-3">
              <button
                type="button"
                onClick={onVerExpediente}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ver expediente</span>
              </button>
              <button
                type="button"
                onClick={onNuevaAtencion}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Nueva atención</span>
              </button>
            </div>
          </>
        )}

        {/* Estado 4: Éxito Offline */}
        {estado === 'EXITO_OFFLINE' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <CloudOff className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">✓ Atención guardada localmente</h3>
              <p className="text-xs text-slate-500">
                La información quedará pendiente de sincronización con el servidor.
              </p>
            </div>

            <div className="flex space-x-3 pt-3">
              <button
                type="button"
                onClick={onVerExpediente}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ver expediente</span>
              </button>
              <button
                type="button"
                onClick={onNuevaAtencion}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Nueva atención</span>
              </button>
            </div>
          </>
        )}

        {/* Estado 5: Error */}
        {estado === 'ERROR' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Error al guardar</h3>
              <p className="text-xs text-red-600 font-medium">
                {mensajeError || 'No fue posible registrar la atención en este momento.'}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Volver y revisar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};