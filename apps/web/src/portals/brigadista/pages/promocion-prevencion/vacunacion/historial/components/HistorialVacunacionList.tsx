// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/historial/components/HistorialVacunacionList.tsx
// DESCRIPCIÓN: Tabla y tarjetas responsivas del historial de vacunas aplicadas.
// =========================================================================

import React from 'react';
import { Syringe, Eye, CheckCircle2 } from 'lucide-react';
import type { VaccinationRecord } from '../../../../../../../modules/vaccinations';

export interface HistorialVacunacionListProps {
  items: VaccinationRecord[];
  onSelectRecord: (record: VaccinationRecord) => void;
}

function formatDate(d: string): string {
  try {
    return new Date(d).toLocaleDateString('es-SV', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return d;
  }
}

export const HistorialVacunacionList: React.FC<HistorialVacunacionListProps> = ({
  items,
  onSelectRecord,
}) => {
  if (items.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-10 text-center space-y-2">
        <Syringe className="w-8 h-8 text-slate-300 mx-auto" />
        <h4 className="text-sm font-bold text-slate-800">No se encontraron aplicaciones</h4>
        <p className="text-xs text-slate-400">
          No hay registros de vacunas que coincidan con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider hidden md:table-header-group">
            <tr>
              <th className="py-3.5 px-4">Paciente</th>
              <th className="py-3.5 px-4">Vacuna</th>
              <th className="py-3.5 px-4">Dosis</th>
              <th className="py-3.5 px-4">Lote</th>
              <th className="py-3.5 px-4">Fecha</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {items.map((v) => {
              const patientName =
                `${v.patient?.firstName || ''} ${v.patient?.lastName || ''}`.trim() ||
                'Persona Atendida';

              return (
                <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-extrabold text-slate-900">{patientName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {v.patient?.dui ? `DUI: ${v.patient.dui}` : 'Sin DUI'}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{v.vaccineName}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200/60">
                      Dosis {v.doseNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{v.lotNumber}</td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {formatDate(v.administeredAt)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Aplicada
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSelectRecord(v)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 text-xs font-bold transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver detalle</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};