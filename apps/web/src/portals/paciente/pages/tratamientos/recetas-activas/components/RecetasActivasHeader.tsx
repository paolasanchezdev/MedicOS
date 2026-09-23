// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/tratamientos/recetas-activas/components/RecetasActivasHeader.tsx
// DESCRIPCIÓN: Cabecera médica oficial en verde institucional con badges
//              glassmorphism para recetas y fármacos activos.
// =========================================================================

import React from 'react';
import { Pill, FileText, Clock, ShieldCheck } from 'lucide-react';

interface RecetasActivasHeaderProps {
  totalMedicines: number;
  totalPrescriptions: number;
  hasNextExpiring?: boolean;
}

export const RecetasActivasHeader: React.FC<RecetasActivasHeaderProps> = ({
  totalMedicines,
  totalPrescriptions,
  hasNextExpiring = false,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-5 sm:p-6 text-white shadow-sm border border-teal-700/50 select-none">
      {/* Luz ambiental decorativa de fondo */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
            <span>Farmacoterapia Activa &bull; MedicOS</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Recetas y Tratamientos Activos
          </h1>

          <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-xl">
            Medicamentos e indicaciones farmacológicas actualmente vigentes prescritas en tu expediente médico.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Badge de Medicamentos Activos */}
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs font-bold text-white shadow-2xs">
            <Pill className="w-4 h-4 text-teal-200" />
            <span className="font-black text-white tabular-nums">{totalMedicines}</span>
            <span className="font-normal text-teal-100">medicamento(s) activo(s)</span>
          </div>

          {/* Badge de Recetas Vigentes */}
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs font-bold text-white shadow-2xs">
            <FileText className="w-4 h-4 text-teal-200" />
            <span className="font-black text-white tabular-nums">{totalPrescriptions}</span>
            <span className="font-normal text-teal-100">receta(s)</span>
          </div>

          {/* Badge de Próximo a Finalizar */}
          {hasNextExpiring && (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-500/20 backdrop-blur-md border border-amber-300/30 rounded-2xl text-xs font-bold text-amber-100 shadow-2xs">
              <Clock className="w-4 h-4 text-amber-300" />
              <span className="font-semibold text-amber-200">Próximo a finalizar</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecetasActivasHeader;