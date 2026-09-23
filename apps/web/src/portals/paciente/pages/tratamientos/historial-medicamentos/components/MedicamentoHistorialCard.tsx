// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/tratamientos/historial-medicamentos/components/MedicamentoHistorialCard.tsx
// DESCRIPCIÓN: Ficha individual de medicamento histórico sin sobrecarga.
// =========================================================================

import React from 'react';
import { Pill, ArrowRight, Calendar, Building2 } from 'lucide-react';
import type { MedicationHistoryItem } from '../../../../../../modules/medications/index.js';

interface MedicamentoHistorialCardProps {
  medication: MedicationHistoryItem;
  onViewDetails: (item: MedicationHistoryItem) => void;
}

export const MedicamentoHistorialCard: React.FC<MedicamentoHistorialCardProps> = ({
  medication,
  onViewDetails,
}) => {
  const inicio = new Date(medication.startDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  });
  const fin = new Date(medication.endDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const renderStatusBadge = () => {
    switch (medication.status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-teal-50 text-medicos-teal border border-teal-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-medicos-teal" />
            ACTIVO
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            ✓ Finalizado
          </span>
        );
      case 'DISCONTINUED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            ⊘ Suspendido
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => onViewDetails(medication)}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-300 p-4 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between space-y-3 cursor-pointer select-none"
    >
      <div className="space-y-2">
        {/* Cabecera del Medicamento */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-medicos-teal flex items-center justify-center shrink-0">
              <Pill className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 truncate leading-tight">
              {medication.medicine}
            </h3>
          </div>
          <div className="shrink-0">{renderStatusBadge()}</div>
        </div>

        {/* Concentración y Vía */}
        <p className="text-xs font-semibold text-slate-600 pl-9">
          {medication.dosage} &bull; Vía {medication.route.toLowerCase()}
        </p>

        {/* Periodo de toma */}
        <div className="pl-9 text-[11.5px] text-slate-500 font-medium flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
          <span>Del {inicio} al {fin}</span>
        </div>

        {/* Origen */}
        <div className="pl-9 text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{medication.establishmentName || 'Consulta médica'}</span>
        </div>
      </div>

      {/* Pie con Acción */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[10px] font-mono font-bold text-slate-400">
          #{medication.prescriptionCode}
        </span>

        <span className="inline-flex items-center gap-1 font-bold text-medicos-teal hover:text-[#16646e] transition">
          <span>Ver detalle</span>
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};

export default MedicamentoHistorialCard;