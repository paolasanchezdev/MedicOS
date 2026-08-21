// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/dashboard/actividad/components/DetalleActividad.tsx
// DESCRIPCIÓN: Modal de detalle corregido con importación de tipo.
// =========================================================================

import React from 'react';
import { X, User, Stethoscope, Clock, ShieldCheck, FileText, Smartphone, HardDrive } from 'lucide-react';
// Soluciona error TS verbatimModuleSyntax
import type { ActividadMedicoItem } from '../ActividadMedicoPage';
import { EstadoActividad } from './EstadoActividad';

interface DetalleActividadProps {
  item: ActividadMedicoItem | null;
  onClose: () => void;
}

export const DetalleActividad: React.FC<DetalleActividadProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera Modal */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Detalle de Actividad Clínica</h3>
              <p className="text-xs text-slate-500">ID Evento: {item.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 space-y-5 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
          {/* Ficha Paciente */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Paciente Atendido</p>
                <h4 className="text-sm font-bold text-slate-800">{item.patientName || 'Paciente No Registrado'}</h4>
                <p className="text-[11px] text-slate-500 font-mono">DUI: {item.patientDui || 'N/A'}</p>
              </div>
            </div>
            <EstadoActividad status={item.status || 'COMPLETED'} isOffline={item.isOffline} />
          </div>

          {/* Resumen Clínico */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              Registro / Diagnóstico
            </label>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed font-medium">
              {item.description || 'Sin observaciones registradas.'}
            </div>
          </div>

          {/* Desglose de Datos */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <p className="text-[10px] font-bold uppercase text-slate-400">Acción Registrada</p>
              <p className="font-bold text-slate-800 mt-0.5">{item.actionLabel || item.action}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <p className="text-[10px] font-bold uppercase text-slate-400">Fecha y Hora</p>
              <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {new Date(item.createdAt).toLocaleString('es-SV')}
              </p>
            </div>
          </div>

          {/* Contexto Técnico y Dispositivo */}
          <div className="p-4 bg-slate-100/60 rounded-xl border border-slate-200 space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5 font-semibold">
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                Dispositivo de Origen:
              </span>
              <span className="font-mono">{item.deviceSn || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5 font-semibold">
                <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                Sincronización Outbox:
              </span>
              {item.isOffline ? (
                <span className="font-bold text-amber-700">Pendiente</span>
              ) : (
                <span className="font-bold text-emerald-700">Completada</span>
              )}
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                Módulo / Sede:
              </span>
              <span className="font-semibold text-slate-700">Atención Clínica Tepezontes, La Paz</span>
            </div>
          </div>
        </div>

        {/* Pie del Modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};