// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/buscar/components/PacienteResultadoCard.tsx
// DESCRIPCIÓN: Ficha identificativa segura de paciente con acceso directo al expediente.
// =========================================================================

import React from 'react';
import { User, ChevronRight, CheckCircle2, MapPin, Phone } from 'lucide-react';
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

  return (
    <div
      onClick={handleVerExpediente}
      className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-[#2B7A78]/50 transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-700 font-bold shrink-0 group-hover:bg-teal-50 group-hover:text-[#2B7A78] group-hover:border-teal-200 transition-colors">
          <User className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-[#2B7A78] transition-colors">
              {patient.firstName} {patient.lastName}
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <CheckCircle2 className="w-3 h-3" />
              Registrado
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
            <span className="font-mono text-slate-700 font-semibold">
              DUI: {patient.dui || 'Sin DUI registrado'}
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="font-mono text-slate-400 text-[11px]">
              ID: {patient.id.slice(0, 8)}...
            </span>
            {patient.phone && (
              <>
                <span className="text-slate-300">&bull;</span>
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {patient.phone}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 pt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-md">{patient.address}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleVerExpediente();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 group-hover:bg-[#2B7A78] text-slate-700 group-hover:text-white text-xs font-bold rounded-xl border border-slate-200/80 group-hover:border-[#2B7A78] transition-all cursor-pointer shadow-2xs"
        >
          <span>Ver expediente</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};