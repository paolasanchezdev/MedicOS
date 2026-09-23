// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/descarga-expediente/components/ResumenExpedienteCard.tsx
// DESCRIPCIÓN: Tarjeta de acreditación e identificación con DUI ofuscado y
//              formateo de fecha de nacimiento inmune al desfase UTC-6.
// =========================================================================

import React from 'react';
import { User, Calendar, Activity, GitFork } from 'lucide-react';
import type { ClinicalGraphNode } from '../../../../../../modules/clinical-knowledge/types/clinical-graph.types.js';

interface ResumenExpedienteCardProps {
  patientNode: ClinicalGraphNode | null;
  lastConsultationDate?: string;
  nextAppointmentDate?: string;
  onOpenGraphView?: () => void;
}

/**
 * Formatea la fecha de nacimiento de forma determinista sin sufrir
 * conversiones por zona horaria local (UTC-6 El Salvador).
 */
function formatBirthDate(rawDate?: unknown): string {
  if (!rawDate || typeof rawDate !== 'string') {
    return 'No registrada';
  }

  // 1. Extraer directamente de cadenas ISO (ej. 1985-05-15 o 1985-05-15T00:00:00.000Z)
  const isoMatch = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${parseInt(day, 10)}/${parseInt(month, 10)}/${year}`;
  }

  // 2. Respaldo utilizando estrictamente valores UTC
  const d = new Date(rawDate);
  if (isNaN(d.getTime())) {
    return 'No registrada';
  }

  return `${d.getUTCDate()}/${d.getUTCMonth() + 1}/${d.getUTCFullYear()}`;
}

export const ResumenExpedienteCard: React.FC<ResumenExpedienteCardProps> = ({
  patientNode,
  lastConsultationDate,
  nextAppointmentDate,
  onOpenGraphView,
}) => {
  const metadata = patientNode?.metadata || {};
  const rawDui = typeof metadata.dui === 'string' ? metadata.dui : (patientNode?.sublabel || '');
  
  // Ofuscación del DUI por seguridad visual
  const maskedDui = rawDui.length > 4 ? `••••••••-${rawDui.slice(-1)}` : '••••••••';
  const birthDate = formatBirthDate(metadata.dateOfBirth);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200/90 p-5 shadow-xs select-none space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#2B7A78] shrink-0 font-bold">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#2B7A78]">
                Expediente Clínico Territorial
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ● Activo
              </span>
            </div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              {patientNode?.label || 'Paciente Registrado'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              DUI: <span className="font-mono text-slate-700">{maskedDui}</span> · Fecha de nacimiento: {birthDate}
            </p>
          </div>
        </div>

        {onOpenGraphView && (
          <button
            type="button"
            onClick={onOpenGraphView}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100/70 border border-teal-200 text-[#2B7A78] text-xs font-bold transition cursor-pointer active:scale-95"
          >
            <GitFork className="w-3.5 h-3.5 rotate-180" />
            <span>Explorar en Mapa Relacional</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
          <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Última Atención</span>
          <span className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#2B7A78]" />
            {lastConsultationDate || 'Sin registros de consulta'}
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
          <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Próxima Cita</span>
          <span className="font-bold text-[#2B7A78] flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3.5 h-3.5" />
            {nextAppointmentDate || 'Sin cita programada'}
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
          <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Estado del Expediente</span>
          <span className="font-bold text-emerald-700 flex items-center gap-1.5 mt-0.5">
            <Activity className="w-3.5 h-3.5" />
            Activo · Conectado a Red Territorial
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResumenExpedienteCard;