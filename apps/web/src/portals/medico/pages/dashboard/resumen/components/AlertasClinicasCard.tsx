import React from 'react';
import { AlertTriangle, Activity } from 'lucide-react';

interface Alerta {
  id: string;
  prioridad: 'alta' | 'media' | 'baja';
  titulo: string;
  paciente: string;
  tiempo: string;
}

interface AlertasClinicasProps {
  data?: Alerta[];
}

export const AlertasClinicasCard: React.FC<AlertasClinicasProps> = ({ data = [] }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          Alertas Clínicas
        </h3>
        {data.length > 0 && (
          <span className="text-xs font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded">
            {data.length} Alertas
          </span>
        )}
      </div>

      <div className="mt-3 space-y-2.5 flex-1 overflow-y-auto max-h-70">
        {data.length > 0 ? (
          data.map((alerta) => (
            <div key={alerta.id} className="p-3 bg-rose-50/60 border border-rose-100 rounded-lg flex items-start gap-3">
              <Activity className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-rose-900">{alerta.titulo}</h4>
                  <span className="text-[10px] text-rose-600">{alerta.tiempo}</span>
                </div>
                <p className="text-xs text-rose-800 font-medium mt-0.5">{alerta.paciente}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            No se detectan signos vitales críticos.
          </div>
        )}
      </div>
    </div>
  );
};