// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionGuardarModal.tsx
// DESCRIPCIÓN: Diálogo modal de confirmación, guardado exitoso y contingencia offline.
//              Diseñado para el retorno operativo inmediato al centro de la Jornada.
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
  ArrowLeft,
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
  onVolverJornada?: () => void;
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
  onVolverJornada,
}) => {
  if (!isOpen) return null;

  const fechaHoy = fechaTexto || new Date().toLocaleDateString('es-SV', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const handleRetornoJornada = () => {
    if (onVolverJornada) {
      onVolverJornada();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 text-center relative animate-in fade-in zoom-in-95 duration-200">
        {/* Estado 1: Confirmación antes de persistir */}
        {estado === 'CONFIRMAR' && (
          <>
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
              <HelpCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">¿Guardar y finalizar atención?</h3>
              <p className="text-xs text-slate-500">
                La información clínica se registrará formalmente en el turno de hoy.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-left text-xs space-y-1">
              <p className="text-slate-600">
                <span className="font-bold text-slate-800">Persona:</span> {pacienteNombre}
              </p>
              <p className="text-slate-600">
                <span className="font-bold text-slate-800">Fecha del Turno:</span> {fechaHoy}
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Continuar Editando
              </button>
              <button
                type="button"
                onClick={onConfirmarGuardar}
                className="flex-1 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer active:scale-95"
              >
                Confirmar y Cerrar
              </button>
            </div>
          </>
        )}

        {/* Estado 2: Guardando en proceso */}
        {estado === 'GUARDANDO' && (
          <div className="py-6 space-y-3">
            <Loader2 className="w-10 h-10 text-[#2B7A78] animate-spin mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Guardando atención comunitaria...</h3>
            <p className="text-xs text-slate-500">Estructurando registro SOAP y vinculando a la jornada activa.</p>
          </div>
        )}

        {/* Estado 3: Éxito Online */}
        {estado === 'EXITO' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">✓ Atención Registrada con Éxito</h3>
              <p className="text-xs text-slate-500">
                El paciente fue marcado como atendido en la jornada y sus datos quedaron sincronizados.
              </p>
            </div>

            <div className="space-y-2 pt-3">
              <button
                type="button"
                onClick={handleRetornoJornada}
                className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a la Jornada (Siguiente Paciente)</span>
              </button>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onVerExpediente}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver Expediente</span>
                </button>
                <button
                  type="button"
                  onClick={onNuevaAtencion}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Nueva Atención</span>
                </button>
              </div>
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
              <h3 className="text-base font-bold text-slate-900">✓ Atención Guardada Localmente</h3>
              <p className="text-xs text-slate-500">
                Registro guardado sin conexión. Quedará en la cola de salida para sincronizar al restablecer la red.
              </p>
            </div>

            <div className="space-y-2 pt-3">
              <button
                type="button"
                onClick={handleRetornoJornada}
                className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a la Jornada (Siguiente Paciente)</span>
              </button>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onVerExpediente}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver Expediente</span>
                </button>
                <button
                  type="button"
                  onClick={onNuevaAtencion}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Nueva Atención</span>
                </button>
              </div>
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
              <h3 className="text-base font-bold text-slate-900">Error al Guardar</h3>
              <p className="text-xs text-red-600 font-medium">
                {mensajeError || 'No fue posible registrar la atención en este momento.'}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Volver y Revisar Datos
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AtencionGuardarModal;