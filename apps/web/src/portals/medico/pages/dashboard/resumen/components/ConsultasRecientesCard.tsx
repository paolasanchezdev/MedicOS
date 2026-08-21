// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/dashboard/resumen/components/ConsultasRecientesCard.tsx
// DESCRIPCIÓN: Tarjeta de consultas con etiquetas explícitas para máxima claridad clínica.
// =========================================================================

import React from 'react';
import { History, MapPin, Calendar, Clock, Stethoscope, CheckCircle2 } from 'lucide-react';

interface ConsultaReciente {
  id: string;
  paciente: string;
  fecha?: string;
  hora?: string;
  lugar?: string;
  tipo?: string;
  fechaHora?: string;
  estado: string;
}

interface ConsultasRecientesProps {
  data?: ConsultaReciente[];
}

export const ConsultasRecientesCard: React.FC<ConsultasRecientesProps> = ({ data = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col h-full w-full">
      {/* Encabezado */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-2">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-600" />
          Consultas Finalizadas Recientemente
        </h3>
        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
          Últimas {data.length} atenciones
        </span>
      </div>

      {/* Lista de Consultas */}
      <div className="flex-1 overflow-y-auto">
        {data.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {data.map((item) => {
              const fechaDisplay = item.fecha || item.fechaHora?.split(',')[0] || '16/8/2026';
              const horaDisplay = item.hora || item.fechaHora?.split(',')[1] || '17:07';
              const lugarDisplay = item.lugar || 'Brigada Médica Principal';
              const tipoDisplay = item.tipo || 'Consulta Médica General';

              return (
                <div 
                  key={item.id} 
                  className="py-3 px-3 hover:bg-slate-50/60 transition-colors rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                  {/* Izquierda: Paciente y Tipo */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-snug">{item.paciente}</p>
                      <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                        <Stethoscope className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{tipoDisplay}</span>
                      </p>
                    </div>
                  </div>

                  {/* Centro: Bloque de datos con etiquetas */}
                  <div className="flex items-center gap-6 bg-slate-50/50 px-4 py-2 rounded-xl border border-slate-100">
                    {/* Fecha */}
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Fecha</span>
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                        <Calendar className="w-3 h-3 text-emerald-600" />
                        {fechaDisplay}
                      </div>
                    </div>

                    {/* Hora */}
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Hora</span>
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        {horaDisplay}
                      </div>
                    </div>

                    {/* Ubicación */}
                    <div className="flex flex-col hidden sm:flex">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Ubicación</span>
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span className="truncate max-w-[150px]" title={lugarDisplay}>{lugarDisplay}</span>
                      </div>
                    </div>
                  </div>

                  {/* Derecha: Estado */}
                  <div className="flex items-center justify-end">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                      {item.estado}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <History className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs font-medium">No se han registrado atenciones recientes.</p>
          </div>
        )}
      </div>
    </div>
  );
};