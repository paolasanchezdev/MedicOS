// =========================================================================
// ARCHIVO: apps/web/src/modules/medications/components/DetalleMedicamentoModal.tsx
// DESCRIPCIÓN: Modal clínico reutilizable con desglose del medicamento.
// =========================================================================

import React from 'react';
import { X, Pill, Clock, Calendar, User, MapPin, ShieldCheck, AlertCircle } from 'lucide-react';
import type { MedicationHistoryItem } from '../types/medication.types.js';

interface DetalleMedicamentoModalProps {
  medication: MedicationHistoryItem | null;
  onClose: () => void;
}

export const DetalleMedicamentoModal: React.FC<DetalleMedicamentoModalProps> = ({
  medication,
  onClose,
}) => {
  if (!medication) return null;

  const inicioStr = new Date(medication.startDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const finStr = new Date(medication.endDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="bg-linear-to-r from-medicos-dark-blue to-medicos-teal text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-[10.5px] font-bold text-teal-100">
              <Pill className="w-3 h-3" />
              Ficha Histórica del Medicamento
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
              {medication.medicine}
            </h2>
            <p className="text-xs text-teal-100 font-semibold">
              {medication.dosage} &bull; Vía {medication.route}
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

        {/* Cuerpo */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Origen y Facultativo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2.5">
              <User className="w-4 h-4 text-medicos-teal shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Prescrito por
                </span>
                <span className="font-bold text-slate-800">
                  {medication.doctorName || 'Personal Médico Autorizado'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-medicos-teal shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Establecimiento / Origen
                </span>
                <span className="font-bold text-slate-800">
                  {medication.establishmentName || 'Consulta Médica'}
                </span>
              </div>
            </div>
          </div>

          {/* Posología */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Frecuencia
              </span>
              <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-medicos-teal" />
                {medication.frequency}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Duración
              </span>
              <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-medicos-teal" />
                {medication.duration}
              </span>
            </div>
          </div>

          {/* Periodo */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Período del Tratamiento
            </span>
            <div className="flex items-center justify-between text-slate-700 font-semibold">
              <span>Del {inicioStr}</span>
              <span>al {finStr}</span>
            </div>
          </div>

          {/* Indicaciones */}
          {medication.instructions && (
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Indicaciones Clínicas
              </span>
              <p className="text-slate-700 font-medium">{medication.instructions}</p>
            </div>
          )}

          {/* Referencia de Receta */}
          <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
            <span>Receta asociada: <strong className="text-slate-600 font-semibold">#{medication.prescriptionCode}</strong></span>
            <span>Registrado el {new Date(medication.prescribedAt).toLocaleDateString('es-ES')}</span>
          </div>

          <div className="bg-teal-50/60 border border-teal-200/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-teal-900">
            <AlertCircle className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">
              Este registro forma parte de tu historial farmacológico inalterable. Para reiniciar o renovar una indicación, consulta a tu médico tratante.
            </p>
          </div>
        </div>

        {/* Pie */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Registro Clínico Homologado</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-medicos-teal hover:bg-[#16646e] text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Cerrar ficha
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleMedicamentoModal;