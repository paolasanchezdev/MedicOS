import React from 'react';
import { Users, Clock } from 'lucide-react';

interface PacientePendiente {
  id: string;
  nombre: string;
  tipo: string;
  detalle: string;
  hora: string;
}

interface PacientesPendientesProps {
  data?: PacientePendiente[];
}

export const PacientesPendientesCard: React.FC<PacientesPendientesProps> = ({ data = [] }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-600" />
          Pacientes en Espera
        </h3>
        <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full">
          {data.length}
        </span>
      </div>

      <div className="mt-3 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-70">
        {data.length > 0 ? (
          data.map((paciente) => (
            <div key={paciente.id} className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-800">{paciente.nombre}</p>
                <p className="text-xs text-slate-500 truncate max-w-50">{paciente.detalle}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {paciente.hora}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            Sin pacientes en lista de espera.
          </div>
        )}
      </div>
    </div>
  );
};