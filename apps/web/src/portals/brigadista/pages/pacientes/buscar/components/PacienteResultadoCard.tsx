// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/buscar/components/PacienteResultadoCard.tsx
// DESCRIPCIÓN: Ficha identificativa de paciente mobile-first con avatar interno,
//              alta densidad de información y navegación táctil al expediente.
// =========================================================================

import React from 'react';
import { User, ChevronRight, CheckCircle2, MapPin, Phone, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { PatientRecord } from '../../../../../../modules/patients';

interface PacienteResultadoCardProps {
  patient: PatientRecord;
}

export const PacienteResultadoCard: React.FC<PacienteResultadoCardProps> = ({ patient }) => {
  const navigate = useNavigate();

  const handleVerExpediente = () => {
    navigate(`/brigadista/pacientes/expediente?id=${patient.id}`);
  };

  const fullName = `${patient.firstName} ${patient.lastName}`.trim();
  const cleanDui = patient.dui ? patient.dui.replace(/[^0-9]/g, '') : '';
  const numExpediente = cleanDui
    ? `EXP-2026-${cleanDui.slice(-4)}`
    : `EXP-${patient.id.slice(0, 6).toUpperCase()}`;

  return (
    <article
      onClick={handleVerExpediente}
      className="group bg-white/95 hover:bg-white rounded-2xl border border-slate-200/90 hover:border-[#2B7A78]/60 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 active:scale-[0.99]"
      aria-label={`Expediente de ${fullName}`}
    >
      {/* Información Principal: Avatar Integrado y Datos */}
      <div className="flex items-start gap-3 min-w-0">
        {/* Avatar Integrado en la Tarjeta */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#1B5250] font-bold shrink-0 mt-0.5 group-hover:bg-[#2B7A78] group-hover:text-white group-hover:border-[#2B7A78] transition-colors shadow-2xs">
          <User className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          {/* Nombre y Badge de Estado */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-[#2B7A78] transition-colors leading-tight truncate">
              {fullName}
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Padrón</span>
            </span>
          </div>

          {/* Fila de DUI, Expediente y Teléfono */}
          <div className="flex items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 font-medium flex-wrap">
            <span className="font-mono text-slate-800 font-bold">
              {patient.dui ? `DUI: ${patient.dui}` : 'Sin DUI'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-[#1B5250] font-semibold text-[11px] flex items-center gap-1">
              <FileText className="w-3 h-3 text-teal-600 hidden sm:inline" />
              {numExpediente}
            </span>
            {patient.phone && (
              <>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="inline-flex items-center gap-1 text-slate-700 font-mono">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {patient.phone}
                </span>
              </>
            )}
          </div>

          {/* Comunidad / Dirección */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-0.5">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate leading-tight max-w-xs sm:max-w-md" title={patient.address}>
              {patient.address || 'Comunidad no registrada'}
            </span>
          </div>
        </div>
      </div>

      {/* Botón de Acción Móvil */}
      <div className="pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex items-center justify-between sm:justify-end gap-2 shrink-0">
        <span className="text-[11px] font-bold text-slate-400 sm:hidden">
          Toca para abrir historial
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleVerExpediente();
          }}
          className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-slate-50 group-hover:bg-[#2B7A78] text-slate-700 group-hover:text-white text-xs font-bold rounded-xl border border-slate-200/90 group-hover:border-[#2B7A78] transition-all cursor-pointer shadow-2xs shrink-0"
        >
          <span>Expediente</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </article>
  );
};

export default PacienteResultadoCard;