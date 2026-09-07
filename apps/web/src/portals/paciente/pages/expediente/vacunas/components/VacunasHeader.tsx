// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/vacunas/components/VacunasHeader.tsx
// DESCRIPCIÓN: Cabecera ejecutiva del Pasaporte de Vacunación Digital con
//              acceso directo al Esquema Nacional MINSAL 2026.
// =========================================================================

import React from 'react';
import { ShieldCheck, Syringe, BookOpen, QrCode } from 'lucide-react';

interface VacunasHeaderProps {
  totalApplied: number;
  onOpenEsquemaMinsal: () => void;
  onOpenCartillaQR: () => void;
}

export const VacunasHeader: React.FC<VacunasHeaderProps> = ({
  onOpenEsquemaMinsal,
  onOpenCartillaQR,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-5 sm:p-6 text-white shadow-sm border border-teal-700/50">
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
            <span>Pasaporte de Vacunación Digital &bull; MedicOS</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Syringe className="w-6 h-6 sm:w-7 sm:h-7 text-teal-200" />
            <span>Mi Protección y Vacunas</span>
          </h1>

          <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-xl">
            Tu cartilla oficial de inmunización, dosis aplicadas y refuerzos preventivos validados según el esquema nacional.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
          {/* Botón Ver Esquema MINSAL */}
          <button
            type="button"
            onClick={onOpenEsquemaMinsal}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl text-xs font-bold text-white transition shadow-2xs cursor-pointer select-none"
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>Esquema MINSAL 2026</span>
          </button>

          {/* Botón Cartilla Digital QR */}
          <button
            type="button"
            onClick={onOpenCartillaQR}
            className="flex items-center gap-2 px-3.5 py-2 bg-white text-[#1B5250] hover:bg-teal-50 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer select-none"
          >
            <QrCode className="w-4 h-4 text-[#2B7A78]" />
            <span>Cartilla Digital</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VacunasHeader;