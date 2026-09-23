// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/descarga-expediente/components/EstadoExpedienteCard.tsx
// DESCRIPCIÓN: Acreditación oficial del expediente sin tecnicismos ni UUIDs.
// =========================================================================

import React from 'react';
import { ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';

interface EstadoExpedienteCardProps {
  totalNodes: number;
  totalEdges: number;
  originDevice?: string;
}

export const EstadoExpedienteCard: React.FC<EstadoExpedienteCardProps> = ({
  totalNodes,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-teal-200/80 p-3.5 sm:p-4 shadow-xs select-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-linear-to-r from-teal-50/40 via-white to-white">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#1c5752] shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#1c5752]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Expediente Clínico Electrónico Unificado
            </h4>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Sincronizado
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Información respaldada y verificada en la Red Nacional de Salud Territorial de El Salvador.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs shrink-0 self-end sm:self-auto">
        <span className="text-[11px] font-bold text-[#1c5752] bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200/70 flex items-center gap-1.5">
          <RefreshCw className="w-3 h-3 text-[#1c5752]" />
          <span>{totalNodes} registros activos consolidados</span>
        </span>
      </div>
    </div>
  );
};

export default EstadoExpedienteCard;