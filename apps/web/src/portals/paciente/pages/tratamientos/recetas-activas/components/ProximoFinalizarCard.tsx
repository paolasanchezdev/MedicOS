// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/tratamientos/recetas-activas/components/ProximoFinalizarCard.tsx
// DESCRIPCIÓN: Tarjeta lateral destacada de medicamento próximo a finalizar.
// =========================================================================

import React from 'react';
import { Clock, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { PrescriptionItem, PrescriptionRecord } from '../../../../../../modules/prescriptions/index.js';

interface ProximoFinalizarCardProps {
  item: PrescriptionItem | null;
  prescriptions: PrescriptionRecord[];
  onOpenPrescription: (rx: PrescriptionRecord) => void;
}

export const ProximoFinalizarCard: React.FC<ProximoFinalizarCardProps> = ({
  item,
  prescriptions,
  onOpenPrescription,
}) => {
  if (!item) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-2 select-none">
        <div className="flex items-center gap-2 text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
            Próximo a Finalizar
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          No tienes tratamientos inmediatos por concluir. Todas tus indicaciones activas continúan en curso regular.
        </p>
      </div>
    );
  }

  const relatedRx = prescriptions.find((p) => p.id === item.prescriptionId);
  const finStr = new Date(item.endDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-2xs space-y-4 select-none">
      {/* Etiqueta Superior */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Próximo a Finalizar
        </span>

        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
          {item.daysRemaining === 0 ? 'Concluye hoy' : `Faltan ${item.daysRemaining} días`}
        </span>
      </div>

      {/* Medicamento y Posología */}
      <div className="space-y-1">
        <h3 className="text-base font-black text-slate-900 leading-tight">
          {item.medicine}
        </h3>
        <p className="text-xs text-slate-500 font-semibold">
          {item.dosage} &bull; {item.frequency}
        </p>
      </div>

      {/* Fecha Límite */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Fecha de Finalización
        </span>
        <p className="text-xs font-black text-slate-800 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-medicos-teal" />
          {finStr}
        </p>
      </div>

      {/* Enlace a Detalle */}
      {relatedRx && (
        <button
          type="button"
          onClick={() => onOpenPrescription(relatedRx)}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200/80 transition cursor-pointer"
        >
          <span>Ver receta completa</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default ProximoFinalizarCard;