import React from 'react';
import { Calendar, User, FileText } from 'lucide-react';

interface AgendaProximaProps {
  data?: {
    proxima: {
      id: string;
      hora: string;
      paciente: string;
      tipo: string;
      motivo: string;
    } | null;
    siguientes: Array<{
      hora: string;
      paciente: string;
    }>;
  };
}

export const AgendaProximaCard: React.FC<AgendaProximaProps> = ({ data }) => {
  const proxima = data?.proxima;
  const siguientes = data?.siguientes || [];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-600" />
          Próxima Consulta
        </h3>
        <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 rounded-md">En Agenda</span>
      </div>

      {proxima ? (
        <div className="mt-4 bg-slate-50 border border-slate-200/60 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-800 bg-teal-100/80 px-2.5 py-0.5 rounded">
              {proxima.hora}
            </span>
            <span className="text-xs text-slate-500">{proxima.tipo}</span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              {proxima.paciente}
            </h4>
            <p className="text-xs text-slate-600 mt-1 flex items-start gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <span>Motivo: {proxima.motivo || 'Sin motivo registrado'}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-slate-400 text-xs">
          No hay consultas pendientes agendadas para hoy.
        </div>
      )}

      {siguientes.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">A continuación</p>
          {siguientes.map((sig, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs text-slate-600 py-1">
              <span className="font-medium text-slate-800">{sig.hora}</span>
              <span className="truncate max-w-45">{sig.paciente}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};