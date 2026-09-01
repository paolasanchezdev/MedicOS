// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionAntecedentesCard.tsx
// DESCRIPCIÓN: Paso 3 (Pestaña 3): Antecedentes clínicos con diseño limpio, espaciado armonioso y alineación de altura exacta.
// =========================================================================

import React from 'react';
import {
  ShieldAlert,
  Baby,
  Pill,
  Info,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import type { PatientRecord } from '../../../../../../modules/patients/types/patient.types';

interface AtencionAntecedentesCardProps {
  patient: PatientRecord | null;
  nuevoAntecedente: string;
  esEmbarazada: boolean;
  semanasGestacion: string;
  onChangeNuevoAntecedente: (val: string) => void;
  onChangeEmbarazo: (esEmbarazada: boolean, semanas: string) => void;
}

export const AtencionAntecedentesCard: React.FC<AtencionAntecedentesCardProps> = ({
  patient,
  nuevoAntecedente,
  esEmbarazada,
  semanasGestacion,
  onChangeNuevoAntecedente,
  onChangeEmbarazo,
}) => {
  const alergiasHistoricas =
    patient?.clinicalRecord?.familyHistory || 'Ninguna alergia registrada en expediente.';
  const observacionesPrevias =
    patient?.clinicalRecord?.observations ||
    'Alergias: Ninguna | Enfermedades crónicas: Ninguna | Discapacidad: Ninguna';
  const esFemenino = patient?.sex === 'FEMALE';

  return (
    <div className="flex-1 flex flex-col justify-between space-y-4">
      {/* 1. Bloque Superior: Encabezado y Antecedentes Base */}
      <div className="space-y-4">
        {/* Encabezado limpio */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
              Historial y Hallazgos
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
              Antecedentes Clínicos y Situación Actual
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100/80 px-3 py-1 rounded-lg">
            Expediente nominal + Terreno
          </span>
        </div>

        {/* 1.1 Antecedentes Registrados Previamente en Expediente */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Alergias y Alertas */}
          <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/30 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2 text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-xs font-bold">Alergias y Alertas Previas</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed pl-6">
              {alergiasHistoricas}
            </p>
          </div>

          {/* Observaciones Clínicas Previas */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-700">
              <FileText className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="text-xs font-bold">Observaciones Clínicas del Expediente</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed pl-6">
              {observacionesPrevias}
            </p>
          </div>
        </div>

        {/* 1.2 Módulo de Gestación (Solo para pacientes femeninas) */}
        {esFemenino && (
          <div
            className={`p-3.5 rounded-xl border transition-all duration-200 shadow-2xs ${
              esEmbarazada
                ? 'bg-pink-50/70 border-pink-200 ring-2 ring-pink-500/10'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                    esEmbarazada
                      ? 'bg-pink-600 text-white shadow-2xs'
                      : 'bg-pink-50 text-pink-600'
                  }`}
                >
                  <Baby className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                    ¿La persona se encuentra en estado de gestación?
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Habilita el control y seguimiento materno-infantil en terreno.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {esEmbarazada && (
                  <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-pink-200 shadow-2xs">
                    <label className="text-xs font-bold text-pink-900 whitespace-nowrap">
                      Semanas:
                    </label>
                    <input
                      type="number"
                      placeholder="Ej. 24"
                      value={semanasGestacion}
                      onChange={(e) => onChangeEmbarazo(true, e.target.value)}
                      className="w-16 text-xs p-1 rounded-md border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-500 text-center font-bold text-pink-950"
                    />
                  </div>
                )}

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={esEmbarazada}
                    onChange={(e) => onChangeEmbarazo(e.target.checked, semanasGestacion)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:left-0.75 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-600" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 1.3 Nuevos Antecedentes / Medicamentos Reportados */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-teal-600" />
            <label className="text-xs sm:text-sm font-bold text-slate-800">
              Nuevos Antecedentes, Medicamentos Actuales o Alergias Reportadas
            </label>
          </div>
          <textarea
            rows={3}
            value={nuevoAntecedente}
            onChange={(e) => onChangeNuevoAntecedente(e.target.value)}
            placeholder="Ej. Refiere inicio de tratamiento antihipertensivo (Enalapril 10mg) hace 2 semanas; niega hospitalizaciones recientes o reacciones alérgicas nuevas..."
            className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white placeholder-slate-400 leading-relaxed shadow-2xs resize-none"
          />
        </div>
      </div>

      {/* 2. Bloque Inferior: Pie Institucional */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Info className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Los hallazgos se anexarán a esta atención sin sobrescribir el expediente histórico base.</span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 text-[11px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Ficha Clínica Protegida</span>
        </div>
      </div>
    </div>
  );
};

export default AtencionAntecedentesCard;