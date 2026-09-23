// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/tratamientos/recetas-activas/RecetasActivasPage.tsx
// DESCRIPCIÓN: Vista oficial de Recetas Activas con tarjetas KPI y diseño compacto.
// =========================================================================

import React, { useState } from 'react';
import { useAuth } from '../../../../../core/context/useAuth.js';
import {
  useActivePrescriptions,
  type PrescriptionRecord,
  DetalleRecetaModal,
} from '../../../../../modules/prescriptions/index.js';
import {
  RecetasActivasHeader,
  RecetasActivasStatusCards,
  RecetaActivaCard,
  ProximoFinalizarCard,
  RecetasActivasEmpty,
} from './components/index.js';
import { Info, AlertCircle, RefreshCw } from 'lucide-react';

export const RecetasActivasPage: React.FC = () => {
  const { user } = useAuth();
  const patientId = user?.id || '';

  const {
    prescriptions,
    totalMedicines,
    totalPrescriptions,
    nextExpiringItem,
    loading,
    error,
    refresh,
  } = useActivePrescriptions(patientId);

  const [selectedRx, setSelectedRx] = useState<PrescriptionRecord | null>(null);

  if (loading && prescriptions.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1700px] mx-auto animate-pulse">
        <div className="h-28 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
        </div>
        <div className="h-56 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error && prescriptions.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10 max-w-md mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Error al consultar recetas</h2>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-medicos-teal hover:bg-[#16646e] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reintentar</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      {/* 1. Cabecera Verde Institucional */}
      <RecetasActivasHeader
        totalMedicines={totalMedicines}
        totalPrescriptions={totalPrescriptions}
        hasNextExpiring={Boolean(nextExpiringItem)}
      />

      {/* 2. Grid Superior de Tarjetas KPI */}
      <RecetasActivasStatusCards
        prescriptions={prescriptions}
        totalMedicines={totalMedicines}
        totalPrescriptions={totalPrescriptions}
        nextExpiringItem={nextExpiringItem}
      />

      {/* 3. Cuerpo Principal en 2 Columnas */}
      {prescriptions.length === 0 ? (
        <RecetasActivasEmpty />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-8 space-y-3">
            {prescriptions.map((rx) => (
              <RecetaActivaCard
                key={rx.id}
                prescription={rx}
                onOpenDetail={setSelectedRx}
              />
            ))}
          </div>

          <div className="lg:col-span-4 space-y-3">
            <ProximoFinalizarCard
              item={nextExpiringItem}
              prescriptions={prescriptions}
              onOpenPrescription={setSelectedRx}
            />

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-start gap-3 select-none">
              <div className="w-7 h-7 rounded-xl bg-teal-50 border border-teal-100 text-medicos-teal flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                <strong className="text-slate-900 font-bold">Sobre tus recetas:</strong> Las indicaciones corresponden a prescripciones oficiales registradas por personal médico autorizado. No modifiques ni suspendas tu dosis sin indicación profesional.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Desacoplado */}
      <DetalleRecetaModal
        prescription={selectedRx}
        onClose={() => setSelectedRx(null)}
      />
    </div>
  );
};

export default RecetasActivasPage;