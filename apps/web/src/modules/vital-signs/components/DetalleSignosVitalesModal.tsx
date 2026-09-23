// =========================================================================
// ARCHIVO: apps/web/src/modules/vital-signs/components/DetalleSignosVitalesModal.tsx
// DESCRIPCIÓN: Modal clínico reutilizable con desglose de parámetros fisiológicos.
// =========================================================================

import React from 'react';
import { X, Heart, Activity, Thermometer, Wind, Calendar, Building2, ShieldCheck, AlertCircle } from 'lucide-react';
import type { VitalSignsRecord } from '../types/vital-signs.types.js';

interface DetalleSignosVitalesModalProps {
  record: VitalSignsRecord | null;
  onClose: () => void;
}

export const DetalleSignosVitalesModal: React.FC<DetalleSignosVitalesModalProps> = ({
  record,
  onClose,
}) => {
  if (!record) return null;

  const fechaStr = new Date(record.recordedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
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
              <Activity className="w-3 h-3" />
              Medición Fisiológica Oficial
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
              Control de Signos Vitales
            </h2>
            <p className="text-xs text-teal-100 font-semibold">{fechaStr}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-teal-100 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Metadatos de Registro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-medicos-teal shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Fecha y Hora
                </span>
                <span className="font-bold text-slate-800">{fechaStr}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-medicos-teal shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Establecimiento / Contexto
                </span>
                <span className="font-bold text-slate-800 truncate block max-w-45">
                  {record.establishmentName || 'Atención Médica Central'}
                </span>
              </div>
            </div>
          </div>

          {/* Grilla de Mediciones */}
          <div className="space-y-2">
            <span className="text-[10.5px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Parámetros Registrados
            </span>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {/* Presión Arterial */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                  <Activity className="w-3.5 h-3.5 text-rose-500" />
                  Presión Arterial
                </span>
                <p className="text-base font-black text-slate-900 tabular-nums">
                  {record.systolic} / {record.diastolic}{' '}
                  <span className="text-xs font-semibold text-slate-500">mmHg</span>
                </p>
                <span className="text-[10px] text-slate-400 font-medium">Ref: 90-120 / 60-80</span>
              </div>

              {/* Frecuencia Cardíaca */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  Frecuencia Cardíaca
                </span>
                <p className="text-base font-black text-slate-900 tabular-nums">
                  {record.heartRate}{' '}
                  <span className="text-xs font-semibold text-slate-500">lpm</span>
                </p>
                <span className="text-[10px] text-slate-400 font-medium">Ref: 60 - 100 lpm</span>
              </div>

              {/* Temperatura */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  Temperatura
                </span>
                <p className="text-base font-black text-slate-900 tabular-nums">
                  {record.temperature.toFixed(1)}{' '}
                  <span className="text-xs font-semibold text-slate-500">°C</span>
                </p>
                <span className="text-[10px] text-slate-400 font-medium">Ref: 36.0 - 37.2 °C</span>
              </div>

              {/* Saturación de Oxígeno */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                  <Wind className="w-3.5 h-3.5 text-sky-500" />
                  Saturación (SpO₂)
                </span>
                <p className="text-base font-black text-slate-900 tabular-nums">
                  {record.oxygenSat}{' '}
                  <span className="text-xs font-semibold text-slate-500">%</span>
                </p>
                <span className="text-[10px] text-slate-400 font-medium">Ref: 95 - 100%</span>
              </div>
            </div>
          </div>

          {/* Antropometría si existe */}
          {(record.weight || record.height) && (
            <div className="space-y-2">
              <span className="text-[10.5px] font-extrabold text-slate-500 uppercase tracking-wider block">
                Datos Antropométricos
              </span>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Peso
                  </span>
                  <span className="font-black text-slate-900 tabular-nums">
                    {record.weight ? `${record.weight} kg` : '—'}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Estatura
                  </span>
                  <span className="font-black text-slate-900 tabular-nums">
                    {record.height ? `${record.height > 3 ? record.height / 100 : record.height} m` : '—'}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    IMC Calculado
                  </span>
                  <span className="font-black text-medicos-teal tabular-nums">
                    {record.bmi ? `${record.bmi} kg/m²` : '—'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Advertencia Clínica */}
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">
              Los signos vitales reflejan el estado fisiológico en el momento exacto de la toma. La interpretación médica requiere valoración integral por un profesional de salud.
            </p>
          </div>
        </div>

        {/* Pie */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Medición Homologada</span>
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

export default DetalleSignosVitalesModal;