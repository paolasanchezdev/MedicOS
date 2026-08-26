// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/consultas/nueva/components/PacienteFichaClinica.tsx
// DESCRIPCIÓN: Barra superior ergonómica y compacta del paciente en consulta activa.
// =========================================================================

import React from 'react';
import { UserCheck, Calendar, Users, Clock } from 'lucide-react';
import type { PacienteEnAtencion } from './ColaAtencionDual';

export interface PacienteFichaClinicaProps {
  paciente: PacienteEnAtencion;
}

export const PacienteFichaClinica: React.FC<PacienteFichaClinicaProps> = ({ paciente }) => {
  const parts = paciente.reason ? paciente.reason.split('|') : [];
  const symptomsPart = parts[0]?.replace('Síntomas:', '').trim() || '';
  const notesPart = parts[1]?.replace('Detalles:', '').trim() || '';
  const symptomsList = symptomsPart ? symptomsPart.split(',').map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-2.5">
      {/* FILA 1: DATOS CLAVE DEL PACIENTE */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 bg-[#0e7490] text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
            <UserCheck size={16} />
          </div>
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <h2 className="text-sm font-black text-slate-900 truncate">{paciente.name}</h2>
            <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              DUI: {paciente.dui}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {paciente.age > 0 ? `${paciente.age}a` : 'Edad N/A'} • {paciente.gender} • Sangre:{' '}
              <strong className="text-slate-700">{paciente.bloodType}</strong>
            </span>
          </div>
        </div>

        {/* ORIGEN Y TURNO */}
        <div className="flex items-center gap-1.5 shrink-0">
          {paciente.origin === 'BRIGADA' ? (
            <span className="px-2.5 py-1 bg-teal-50 border border-teal-200/80 text-teal-800 text-[11px] font-bold rounded-lg flex items-center gap-1">
              <Users size={12} /> Triage Brigada
            </span>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-1 bg-teal-50 border border-teal-200/80 text-teal-900 text-[11px] font-bold rounded-lg flex items-center gap-1">
                <Calendar size={12} className="text-[#0e7490]" /> Cita Programada
              </span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-[11px] font-mono font-extrabold rounded-lg flex items-center gap-1 border border-slate-200">
                <Clock size={12} className="text-[#0e7490]" /> {paciente.time} hrs
              </span>
            </div>
          )}
        </div>
      </div>

      {/* FILA 2: SÍNTOMAS Y NOTAS CONCRETAS */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Motivo:</span>
        {symptomsList.length > 0 ? (
          <div className="flex flex-wrap gap-1 items-center">
            {symptomsList.map((sym, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[11px] rounded-md shadow-2xs"
              >
                {sym}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-slate-600 italic text-[11px]">Consulta general</span>
        )}

        {notesPart && (
          <span className="text-[11px] text-slate-500 font-medium truncate max-w-md ml-1" title={notesPart}>
            — <em>"{notesPart}"</em>
          </span>
        )}
      </div>
    </div>
  );
};

export default PacienteFichaClinica;