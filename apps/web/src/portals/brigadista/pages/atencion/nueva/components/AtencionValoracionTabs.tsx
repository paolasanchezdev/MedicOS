// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionValoracionTabs.tsx
// DESCRIPCIÓN: Contenedor con Tabs deslizables para Signos, Síntomas y Antecedentes calibrado para igualar la altura de la tarjeta lateral.
// =========================================================================

import React, { useState } from 'react';
import { Activity, Stethoscope, History } from 'lucide-react';
import type { SignosVitalesFormState, SintomasFormState } from '../../../../../../modules/atencion/types/atencion.types';
import type { PatientRecord } from '../../../../../../modules/patients/types/patient.types';

import { AtencionSignosVitalesCard } from './AtencionSignosVitalesCard';
import { AtencionSintomasCard } from './AtencionSintomasCard';
import { AtencionAntecedentesCard } from './AtencionAntecedentesCard';

interface AtencionValoracionTabsProps {
  patient: PatientRecord | null;
  signosVitales: SignosVitalesFormState;
  sintomas: SintomasFormState;
  nuevoAntecedente: string;
  esEmbarazada: boolean;
  semanasGestacion: string;
  onChangeSigno: (field: keyof SignosVitalesFormState, value: string) => void;
  onChangeSintoma: (field: keyof SintomasFormState, value: boolean | string) => void;
  onChangeNuevoAntecedente: (val: string) => void;
  onChangeEmbarazo: (esEmbarazada: boolean, semanas: string) => void;
}

export const AtencionValoracionTabs: React.FC<AtencionValoracionTabsProps> = ({
  patient,
  signosVitales,
  sintomas,
  nuevoAntecedente,
  esEmbarazada,
  semanasGestacion,
  onChangeSigno,
  onChangeSintoma,
  onChangeNuevoAntecedente,
  onChangeEmbarazo,
}) => {
  const [activeTab, setActiveTab] = useState<'signos' | 'sintomas' | 'antecedentes'>('signos');

  return (
    <div className="h-full flex flex-col justify-between gap-3">
      {/* 1. Fila Superior de Tabs con Botones Deslizables Oficiales */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-none">Paso 3 • Valoración Integral</h2>
            <p className="text-xs text-slate-500 mt-1">Selecciona el bloque de valoración clínica</p>
          </div>
        </div>

        {/* Controles Segmentados Deslizables */}
        <div className="flex items-center bg-slate-50/80 border border-slate-200/60 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('signos')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'signos'
                ? 'bg-white text-slate-800 shadow-xs border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${activeTab === 'signos' ? 'text-teal-600' : ''}`} />
            <span>Signos Vitales</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sintomas')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'sintomas'
                ? 'bg-white text-slate-800 shadow-xs border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Stethoscope className={`w-3.5 h-3.5 ${activeTab === 'sintomas' ? 'text-blue-600' : ''}`} />
            <span>Síntomas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('antecedentes')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'antecedentes'
                ? 'bg-white text-slate-800 shadow-xs border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <History className={`w-3.5 h-3.5 ${activeTab === 'antecedentes' ? 'text-purple-600' : ''}`} />
            <span>Antecedentes</span>
          </button>
        </div>
      </div>

      {/* 2. Tarjeta de Contenido Calibrada para Llenar la Altura Total */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all duration-200 flex-1 flex flex-col justify-between">
        {activeTab === 'signos' && (
          <AtencionSignosVitalesCard
            signosVitales={signosVitales}
            onChangeSigno={onChangeSigno}
          />
        )}

        {activeTab === 'sintomas' && (
          <AtencionSintomasCard
            sintomas={sintomas}
            onChangeSintoma={onChangeSintoma}
          />
        )}

        {activeTab === 'antecedentes' && (
          <AtencionAntecedentesCard
            patient={patient}
            nuevoAntecedente={nuevoAntecedente}
            esEmbarazada={esEmbarazada}
            semanasGestacion={semanasGestacion}
            onChangeNuevoAntecedente={onChangeNuevoAntecedente}
            onChangeEmbarazo={onChangeEmbarazo}
          />
        )}
      </div>
    </div>
  );
};

export default AtencionValoracionTabs;