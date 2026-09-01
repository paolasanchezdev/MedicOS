// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/registro/components/VacunacionResumenCard.tsx
// DESCRIPCIÓN: Resumen de confirmación previo al guardado en base de datos.
// =========================================================================

import React from 'react';
import { ShieldCheck, User, Syringe, Layers, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import type { NuevaVacunacionFormState } from '../../../../../../../modules/vaccinations';

export interface VacunacionResumenCardProps {
  formData: NuevaVacunacionFormState;
}

export const VacunacionResumenCard: React.FC<VacunacionResumenCardProps> = ({ formData }) => {
  const {
    patient,
    selectedVaccine,
    doseNumber,
    lotNumber,
    expirationDate,
    administrationRoute,
    anatomicalSite,
    administeredDate,
    administeredTime,
    adverseReactions,
    observations,
  } = formData;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
      {/* Cabecera */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs">
          <ShieldCheck className="w-4 h-4 stroke-2" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            4. Confirmación de Inmunización
          </h3>
          <p className="text-[11px] text-slate-400">
            Verifica los datos antes de guardar en el registro oficial
          </p>
        </div>
      </div>

      {/* Grid de Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Paciente */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <User className="w-3 h-3 text-teal-600" /> Persona Vacunada
          </span>
          <p className="font-extrabold text-slate-900 text-sm">
            {patient ? `${patient.firstName} ${patient.lastName}` : 'No seleccionado'}
          </p>
          <p className="text-[11px] font-mono text-slate-500">
            {patient?.dui ? `DUI: ${patient.dui}` : 'Sin documento'}
          </p>
        </div>

        {/* Vacuna y Dosis */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Syringe className="w-3 h-3 text-teal-600" /> Biológico y Dosis
          </span>
          <p className="font-extrabold text-slate-900 text-sm">
            {selectedVaccine?.name || 'No seleccionada'}
          </p>
          <p className="text-[11px] font-bold text-teal-800">
            Dosis {doseNumber} de {selectedVaccine?.totalDoses || 1}
          </p>
        </div>

        {/* Lote y Vencimiento */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3 text-teal-600" /> Lote y Vencimiento
          </span>
          <p className="font-mono font-extrabold text-slate-800">
            Lote: {lotNumber || 'No especificado'}
          </p>
          <p className="text-[11px] text-slate-500">
            Vence: {expirationDate || 'No especificado'}
          </p>
        </div>

        {/* Vía y Fecha */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3 text-teal-600" /> Vía, Sitio y Horario
          </span>
          <p className="font-bold text-slate-800">
            {administrationRoute} &bull; {anatomicalSite}
          </p>
          <p className="text-[11px] text-slate-500">
            {administeredDate} a las {administeredTime}
          </p>
        </div>
      </div>

      {adverseReactions && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-0.5">
          <span className="font-bold text-amber-900 block items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            Reacción Inmediata / ESAVI:
          </span>
          <p className="text-amber-800">{adverseReactions}</p>
        </div>
      )}

      {observations && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-0.5">
          <span className="font-bold text-slate-700 block">Consejería y Observaciones:</span>
          <p className="text-slate-600">{observations}</p>
        </div>
      )}

      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Listo para confirmar. Al guardar, el registro se integrará en el expediente clínico del paciente.</span>
      </div>
    </div>
  );
};

export default VacunacionResumenCard;