// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/alergias-antecedentes/components/AntecedentesSection.tsx
// DESCRIPCIÓN: Tarjetas 2, 3 y 4 con diseño compacto y simétrico.
// =========================================================================

import React from 'react';
import { Activity, Users, Scissors, ChevronRight } from 'lucide-react';
import type {
  MedicalHistoryItem,
  FamilyHistoryItem,
  SurgicalHistoryItem,
  AnyAntecedente,
} from '../../../../../../modules/clinical-history/index.js';
import { AntecedenteCard } from './AntecedenteCard.js';

interface AntecedentesSectionProps {
  medicalHistory: MedicalHistoryItem[];
  familyHistory: FamilyHistoryItem[];
  surgicalHistory: SurgicalHistoryItem[];
  onViewDetail: (antecedente: AnyAntecedente) => void;
}

export const AntecedentesSection: React.FC<AntecedentesSectionProps> = ({
  medicalHistory,
  familyHistory,
  surgicalHistory,
  onViewDetail,
}) => {
  const medicalTotal = medicalHistory.length;
  const familyTotal = familyHistory.length;
  const surgicalTotal = surgicalHistory.length;

  return (
    <>
      {/* TARJETA 2: CONDICIONES PERSONALES */}
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-[#2B7A78] border border-teal-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2B7A78]" />
              {medicalTotal > 0 ? `${medicalTotal} Activos` : 'Al día'}
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Condiciones Personales
            </p>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5 leading-none">
              {medicalTotal}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs">
            {medicalTotal === 0 ? (
              <>
                <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
                  <span className="font-medium text-[11px]">Enfermedades crónicas</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.2 rounded-md border border-slate-200/60 shadow-2xs text-[11px]">
                    0
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
                  <span className="font-medium text-[11px]">Condiciones de base</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.2 rounded-md border border-slate-200/60 shadow-2xs text-[11px]">
                    0
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
                  <span className="font-medium text-[11px]">Limitaciones funcionales</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.2 rounded-md border border-slate-200/60 shadow-2xs text-[11px]">
                    0
                  </span>
                </div>
              </>
            ) : (
              medicalHistory.slice(0, 3).map((item) => (
                <AntecedenteCard
                  key={item.id}
                  antecedente={{ kind: 'MEDICAL', data: item }}
                  onViewDetail={onViewDetail}
                />
              ))
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={medicalTotal === 0}
          onClick={() => medicalTotal > 0 && onViewDetail({ kind: 'MEDICAL', data: medicalHistory[0]! })}
          className="mt-3 pt-2.5 border-t border-slate-100 w-full inline-flex items-center justify-between text-[11px] font-semibold text-[#2B7A78] hover:text-[#236866] disabled:text-slate-400 disabled:hover:text-slate-400 transition-colors group/btn cursor-pointer disabled:cursor-default"
        >
          <span>{medicalTotal > 0 ? 'Ver patologías registradas' : 'Sin patologías activas'}</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>

      {/* TARJETA 3: RIESGO HEREDO-FAMILIAR */}
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-xs">
              <Users className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              {familyTotal > 0 ? `${familyTotal} Factores` : 'Sin registros'}
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Riesgo Heredo-Familiar
            </p>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5 leading-none">
              {familyTotal}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs">
            {familyTotal === 0 ? (
              <>
                <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
                  <span className="font-medium text-[11px]">Línea materna</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.2 rounded-md border border-slate-200/60 shadow-2xs text-[11px]">
                    0
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
                  <span className="font-medium text-[11px]">Línea paterna</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.2 rounded-md border border-slate-200/60 shadow-2xs text-[11px]">
                    0
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
                  <span className="font-medium text-[11px]">1° y 2° grado</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.2 rounded-md border border-slate-200/60 shadow-2xs text-[11px]">
                    0
                  </span>
                </div>
              </>
            ) : (
              familyHistory.slice(0, 3).map((item) => (
                <AntecedenteCard
                  key={item.id}
                  antecedente={{ kind: 'FAMILY', data: item }}
                  onViewDetail={onViewDetail}
                />
              ))
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={familyTotal === 0}
          onClick={() => familyTotal > 0 && onViewDetail({ kind: 'FAMILY', data: familyHistory[0]! })}
          className="mt-3 pt-2.5 border-t border-slate-100 w-full inline-flex items-center justify-between text-[11px] font-semibold text-purple-600 hover:text-purple-700 disabled:text-slate-400 disabled:hover:text-slate-400 transition-colors group/btn cursor-pointer disabled:cursor-default"
        >
          <span>{familyTotal > 0 ? 'Ver antecedentes familiares' : 'Sin antecedentes registrados'}</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>

      {/* TARJETA 4: CIRUGÍAS PREVIAS */}
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
              <Scissors className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              {surgicalTotal > 0 ? `${surgicalTotal} Cirugía(s)` : '0 Cirugías'}
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Cirugías Previas
            </p>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5 leading-none">
              {surgicalTotal}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs">
            {surgicalTotal === 0 ? (
              <>
                <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
                  <span className="font-medium text-[11px]">Cirugías mayores</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.2 rounded-md border border-slate-200/60 shadow-2xs text-[11px]">
                    0
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
                  <span className="font-medium text-[11px]">Hospitalizaciones</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.2 rounded-md border border-slate-200/60 shadow-2xs text-[11px]">
                    0
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
                  <span className="font-medium text-[11px]">Traumatismos</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.2 rounded-md border border-slate-200/60 shadow-2xs text-[11px]">
                    0
                  </span>
                </div>
              </>
            ) : (
              surgicalHistory.slice(0, 3).map((item) => (
                <AntecedenteCard
                  key={item.id}
                  antecedente={{ kind: 'SURGICAL', data: item }}
                  onViewDetail={onViewDetail}
                />
              ))
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={surgicalTotal === 0}
          onClick={() => surgicalTotal > 0 && onViewDetail({ kind: 'SURGICAL', data: surgicalHistory[0]! })}
          className="mt-3 pt-2.5 border-t border-slate-100 w-full inline-flex items-center justify-between text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 disabled:text-slate-400 disabled:hover:text-slate-400 transition-colors group/btn cursor-pointer disabled:cursor-default"
        >
          <span>{surgicalTotal > 0 ? 'Ver registro quirúrgico' : 'Sin cirugías documentadas'}</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>
    </>
  );
};

export default AntecedentesSection;