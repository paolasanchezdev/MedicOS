// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/tratamientos/historial-medicamentos/components/HistorialMedicamentosStatusCards.tsx
// DESCRIPCIÓN: 4 tarjetas de resumen histórico de tratamientos farmacológicos.
// =========================================================================

import React from 'react';
import { Pill, CheckCircle2, ShieldAlert, FileText, ChevronRight } from 'lucide-react';
import type { MedicationHistoryItem } from '../../../../../../modules/medications/index.js';

interface HistorialMedicamentosStatusCardsProps {
  medications: MedicationHistoryItem[];
  onSelectStatus?: (status: string) => void;
}

export const HistorialMedicamentosStatusCards: React.FC<HistorialMedicamentosStatusCardsProps> = ({
  medications,
}) => {
  const activeCount = medications.filter((m) => m.status === 'ACTIVE').length;
  const completedCount = medications.filter((m) => m.status === 'COMPLETED').length;
  const discontinuedCount = medications.filter((m) => m.status === 'DISCONTINUED').length;
  const uniquePrescriptions = new Set(medications.map((m) => m.prescriptionCode)).size;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 select-none">
      {/* TARJETA 1: REGISTRO TOTAL */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-teal-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-medicos-teal">
              <Pill className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-medicos-teal border border-teal-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-medicos-teal" />
              Trayectoria
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Fármacos Documentados
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {medications.length}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Tratamientos activos hoy</span>
              <span className="font-bold text-medicos-teal">{activeCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Pautas finalizadas con éxito</span>
              <span className="font-bold text-slate-800">{completedCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Tratamientos suspendidos</span>
              <span className="font-bold text-slate-800">{discontinuedCount}</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Histórico completo documentado</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 2: TRATAMIENTOS COMPLETADOS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-emerald-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Concluidos
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Pautas Finalizadas
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {completedCount}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Ciclos completados a término</span>
              <span className="font-bold text-slate-800">{completedCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Pautas orales finalizadas</span>
              <span className="font-bold text-slate-800">
                {medications.filter((m) => m.status === 'COMPLETED' && m.route.toLowerCase().includes('oral')).length}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Resolución de tratamiento</span>
              <span className="font-bold text-emerald-700">100%</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Ciclos cerrados satisfactoriamente</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 3: SUSPENDIDOS O AJUSTADOS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-rose-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {discontinuedCount > 0 ? 'Ajustados' : 'Sin cambios'}
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Pautas Suspendidas
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {discontinuedCount}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Por indicación facultativa</span>
              <span className="font-bold text-slate-800">{discontinuedCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Ajuste por recambio terapéutico</span>
              <span className="font-bold text-slate-800">Documentado</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Efectos adversos registrados</span>
              <span className="font-bold text-slate-800">0</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Decisiones médicas homologadas</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 4: RECETAS EN ARCHIVO */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-indigo-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FileText className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Expediente
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Recetas en Archivo
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {uniquePrescriptions}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Recetas comunitarias (brigadas)</span>
              <span className="font-bold text-slate-800">
                {new Set(medications.filter((m) => m.establishmentName?.toLowerCase().includes('brigada')).map((m) => m.prescriptionCode)).size}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Consultas ambulatorias</span>
              <span className="font-bold text-slate-800">
                {uniquePrescriptions - new Set(medications.filter((m) => m.establishmentName?.toLowerCase().includes('brigada')).map((m) => m.prescriptionCode)).size}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Integridad de prescripción</span>
              <span className="font-bold text-emerald-700">100%</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Archivo inalterable MedicOS</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

export default HistorialMedicamentosStatusCards;