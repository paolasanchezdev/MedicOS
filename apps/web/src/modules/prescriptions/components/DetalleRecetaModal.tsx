// =========================================================================
// ARCHIVO: apps/web/src/modules/prescriptions/components/DetalleRecetaModal.tsx
// DESCRIPCIÓN: Modal clínico reutilizable con desglose posológico de receta.
// =========================================================================

import React from 'react';
import { X, Pill, Clock, Calendar, User, MapPin, ShieldCheck, AlertCircle } from 'lucide-react';
import type { PrescriptionRecord } from '../types/prescription.types.js';
import { RecetaEstadoBadge } from './RecetaEstadoBadge.js';

interface DetalleRecetaModalProps {
  prescription: PrescriptionRecord | null;
  onClose: () => void;
}

export const DetalleRecetaModal: React.FC<DetalleRecetaModalProps> = ({
  prescription,
  onClose,
}) => {
  if (!prescription) return null;

  const fechaEmisionStr = new Date(prescription.issuedAt || prescription.createdAt).toLocaleDateString(
    'es-ES',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="bg-linear-to-r from-medicos-dark-blue to-medicos-teal text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-[10.5px] font-bold text-teal-100">
                <Pill className="w-3 h-3" />
                Prescripción Médica Oficial
              </span>
              <RecetaEstadoBadge status={prescription.status} />
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
              Receta #{prescription.code}
            </h2>
            <p className="text-xs text-teal-100/90 font-medium">
              Emitida el {fechaEmisionStr}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-teal-100 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido Clínico */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Datos del Facultativo / Lugar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2.5">
              <User className="w-4 h-4 text-medicos-teal shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Prescrito por
                </span>
                <span className="font-bold text-slate-800">
                  {prescription.doctor
                    ? `Dr(a). ${prescription.doctor.firstName} ${prescription.doctor.lastName}`
                    : 'Personal Médico Autorizado'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-medicos-teal shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Establecimiento / Brigada
                </span>
                <span className="font-bold text-slate-800">
                  {prescription.brigade?.name || 'Consulta Médica Central'}
                </span>
              </div>
            </div>
          </div>

          {/* Fármacos Prescritos */}
          <div className="space-y-2.5">
            <span className="text-[10.5px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Medicamentos ({prescription.items.length})
            </span>

            {prescription.items.map((item) => {
              const startStr = new Date(item.startDate).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });
              const endStr = new Date(item.endDate).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={item.id}
                  className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                        {item.medicine}
                      </h4>
                      <span className="text-xs font-bold text-medicos-teal">
                        {item.dosage} &bull; Vía {item.route}
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-teal-50 text-medicos-teal border border-teal-200/70 shrink-0">
                      {item.isExpired ? 'Tratamiento Finalizado' : `${item.daysRemaining} días restantes`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.frequency}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.duration}</span>
                    </div>
                  </div>

                  {item.instructions && (
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                      <strong className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Instrucciones
                      </strong>
                      <p className="font-medium">{item.instructions}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>Inicio: <strong className="text-slate-600">{startStr}</strong></span>
                    <span>Finaliza: <strong className="text-slate-600">{endStr}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Observaciones Clínicas */}
          {prescription.notes && (
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Notas Médicas Adicionales
              </span>
              <p className="text-slate-700 font-medium">{prescription.notes}</p>
            </div>
          )}

          {/* Advertencia Sanitaria */}
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">
              Cumple con la posología y horario indicados. No suspendas el tratamiento antes del tiempo prescrito sin consultar a un profesional de la salud.
            </p>
          </div>
        </div>

        {/* Pie */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Documento Clínico Válido</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-medicos-teal hover:bg-[#16646e] text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Cerrar receta
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleRecetaModal;