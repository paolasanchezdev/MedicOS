// =========================================================================
// ARCHIVO: PreferenciasHeader.tsx
// DESCRIPCIÓN: Header institucional verde oficial con badge y estado de guardado.
// =========================================================================

import React from 'react';
import { Sliders, Check, Loader2 } from 'lucide-react';
import type { SaveStatus } from '../../../../../../modules/patients/hooks/usePatientPreferences.js';

interface PreferenciasHeaderProps {
  saveStatus: SaveStatus;
}

export const PreferenciasHeader: React.FC<PreferenciasHeaderProps> = ({ saveStatus }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#1c5752] p-6 sm:p-7 text-white shadow-xs">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-medium text-teal-100 border border-white/10">
            <Sliders className="w-3.5 h-3.5 text-teal-200" />
            <span>Configuración y Ajustes · Portal Paciente</span>
          </div>

          <h1 className="text-2xl sm:text-[26px] font-black tracking-tight text-white">
            Preferencias de la cuenta
          </h1>
          <p className="text-xs sm:text-[13px] text-teal-100/90 font-normal leading-relaxed">
            Personaliza cómo deseas recibir notificaciones, interactuar con la interfaz y adaptar el portal a tus necesidades.
          </p>
        </div>

        {/* Micro-indicador de guardado reactivo */}
        <div className="shrink-0 flex items-center">
          {saveStatus === 'saving' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-teal-100 text-xs font-semibold backdrop-blur-xs border border-white/15 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Guardando...</span>
            </div>
          )}

          {saveStatus === 'saved' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#1c5752] text-xs font-bold shadow-xs">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Cambios guardados</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreferenciasHeader;