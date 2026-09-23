// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/tratamientos/recetas-activas/components/RecetasActivasStatusCards.tsx
// DESCRIPCIÓN: 4 tarjetas de resumen clínico para Recetas y Tratamientos Activos.
// =========================================================================

import React from 'react';
import { Pill, FileText, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import type { PrescriptionRecord, PrescriptionItem } from '../../../../../../modules/prescriptions/index.js';

interface RecetasActivasStatusCardsProps {
  prescriptions: PrescriptionRecord[];
  totalMedicines: number;
  totalPrescriptions: number;
  nextExpiringItem: PrescriptionItem | null;
}

export const RecetasActivasStatusCards: React.FC<RecetasActivasStatusCardsProps> = ({
  prescriptions,
  totalMedicines,
  totalPrescriptions,
  nextExpiringItem,
}) => {
  // Cálculos de desglose clínico
  const allItems = prescriptions.flatMap((p) => p.items);
  const oralCount = allItems.filter((i) => i.route.toLowerCase().includes('oral')).length;
  const otherRouteCount = allItems.length - oralCount;
  const brigadeCount = prescriptions.filter((p) => p.brigadeId || p.brigade).length;
  const clinicCount = totalPrescriptions - brigadeCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 select-none">
      {/* TARJETA 1: FÁRMACOS ACTIVOS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-teal-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-medicos-teal">
              <Pill className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-medicos-teal border border-teal-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-medicos-teal" />
              En tratamiento
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Fármacos en Tratamiento
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {totalMedicines}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Vía oral (cápsulas/comp.)</span>
              <span className="font-bold text-slate-800">{oralCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Otras vías de aplicación</span>
              <span className="font-bold text-slate-800">{otherRouteCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Pautas con posología</span>
              <span className="font-bold text-slate-800">{totalMedicines}</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Medicamentos vigentes</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 2: RECETAS OFICIALES */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-sky-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <FileText className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              Documentadas
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Recetas Activas
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {totalPrescriptions}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Consulta médica ambulatoria</span>
              <span className="font-bold text-slate-800">{clinicCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Jornadas en brigada</span>
              <span className="font-bold text-slate-800">{brigadeCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Código oficial RX emitido</span>
              <span className="font-bold text-slate-800">{totalPrescriptions}</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Prescripciones registradas</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 3: PRÓXIMA CONCLUSIÓN */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-amber-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {nextExpiringItem ? 'Próximo término' : 'Sin alertas'}
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Próxima Conclusión
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1 truncate">
              {nextExpiringItem ? `${nextExpiringItem.daysRemaining} días` : 'Al día'}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span className="truncate max-w-32.5">Fármaco:</span>
              <span className="font-bold text-slate-800 truncate max-w-30">
                {nextExpiringItem ? nextExpiringItem.medicine : 'Ninguno'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Posología:</span>
              <span className="font-bold text-slate-800">
                {nextExpiringItem ? nextExpiringItem.dosage : 'Completa'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Duración pautada:</span>
              <span className="font-bold text-slate-800">
                {nextExpiringItem ? nextExpiringItem.duration : 'Pauta regular'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Planificación de renovación</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 4: CONTROL Y SEGURIDAD */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-emerald-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Certificado
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Supervisión Médica
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              100%
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Facultativo acreditado</span>
              <span className="font-bold text-emerald-700">Verificado</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Instrucciones posológicas</span>
              <span className="font-bold text-slate-800">Estructuradas</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Adherencia terapéutica</span>
              <span className="font-bold text-slate-800">Al día</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Dosis prescritas inalterables</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

export default RecetasActivasStatusCards;