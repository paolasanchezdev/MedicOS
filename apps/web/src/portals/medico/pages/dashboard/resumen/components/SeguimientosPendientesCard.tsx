import React from 'react';
import { Bookmark } from 'lucide-react';

interface Seguimiento {
  id: string;
  paciente: string;
  motivo: string;
  vencimiento: string;
}

interface SeguimientosProps {
  data?: Seguimiento[];
}

export const SeguimientosPendientesCard: React.FC<SeguimientosProps> = ({ data = [] }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-indigo-600" />
          Seguimientos Médicos
        </h3>
      </div>

      <div className="mt-3 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-70">
        {data.length > 0 ? (
          data.map((seg) => (
            <div key={seg.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">{seg.paciente}</p>
                <p className="text-xs text-slate-500 truncate max-w-45">{seg.motivo}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                seg.vencimiento === 'Hoy' || seg.vencimiento === 'Vencido'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {seg.vencimiento}
              </span>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            Sin controles o seguimientos pendientes.
          </div>
        )}
      </div>
    </div>
  );
};