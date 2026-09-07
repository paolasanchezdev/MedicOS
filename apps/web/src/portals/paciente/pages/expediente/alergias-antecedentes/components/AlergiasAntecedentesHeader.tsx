// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/alergias-antecedentes/components/AlergiasAntecedentesHeader.tsx
// DESCRIPCIÓN: Cabecera médica oficial con grupo sanguíneo y alerta de alergias.
// =========================================================================

import React from 'react';
import { ShieldAlert, Droplet, ShieldCheck } from 'lucide-react';

interface AlergiasAntecedentesHeaderProps {
  bloodType: string;
  allergiesCount: number;
}

export const AlergiasAntecedentesHeader: React.FC<AlergiasAntecedentesHeaderProps> = ({
  bloodType,
  allergiesCount,
}) => {
  const formatBloodType = (bt: string) => {
    return bt
      .replace('_POSITIVE', '+')
      .replace('_NEGATIVE', '-')
      .replace('UNKNOWN', 'Por confirmar');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-5 sm:p-6 text-white shadow-sm border border-teal-700/50">
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
            <span>Perfil Clínico Inalterable &bull; MedicOS</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Alergias y Antecedentes Médicos
          </h1>

          <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-xl">
            Información esencial para tu seguridad en cualquier atención de urgencia o consulta programada.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Badge de Tipo de Sangre */}
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs font-bold text-white shadow-2xs">
            <Droplet className="w-4 h-4 text-rose-300" />
            <span className="font-normal text-teal-100">Grupo:</span>
            <span className="font-black text-rose-200">{formatBloodType(bloodType)}</span>
          </div>

          {/* Badge de Alergias */}
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs font-bold text-white shadow-2xs">
            <ShieldAlert className="w-4 h-4 text-amber-300" />
            <span className="tabular-nums">{allergiesCount}</span>
            <span className="font-normal text-teal-100">alergia(s) activa(s)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlergiasAntecedentesHeader;