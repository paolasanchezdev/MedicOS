import React from 'react';
import { UserCheck, Inbox, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBrigade } from "@modules/brigades/hooks/useBrigade";
import type { PatientAttentionStatus } from "@modules/brigades/types/brigade.types";

const getStatusBadge = (status: PatientAttentionStatus) => {
  switch (status) {
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Completado
        </span>
      );
    case 'IN_ATTENTION':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
          <Clock className="w-3 h-3 text-blue-600 animate-pulse" />
          En Atención
        </span>
      );
    case 'IN_WAITING':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
          <AlertCircle className="w-3 h-3 text-amber-600" />
          En Espera
        </span>
      );
  }
};

export const RecentPatientsTable: React.FC = () => {
  const { recentPatients } = useBrigade();

  return (
    <div className="bg-white rounded-3xl border border-slate-200/70 p-5 shadow-xs space-y-4">
      {/* Cabecera de la tabla */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shadow-xs">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Atenciones Recientes</h3>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
              Últimas consultas registradas en esta jornada
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200/60">
          {recentPatients?.length ?? 0} Registros
        </span>
      </div>

      {/* Contenido de la Tabla / Estado Vacío */}
      {recentPatients && recentPatients.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-2">Paciente</th>
                <th className="pb-3 px-2">Hora</th>
                <th className="pb-3 px-2">Tipo Atención</th>
                <th className="pb-3 px-2 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {recentPatients.map((patient) => (
                <tr key={patient.id} className="text-slate-700 hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-2">
                    <div className="font-bold text-slate-900">{patient.fullName}</div>
                    {(patient.age || patient.gender) && (
                      <div className="text-[10px] text-slate-400 font-normal">
                        {patient.age ? `${patient.age} años` : ''} 
                        {patient.age && patient.gender ? ' • ' : ''}
                        {patient.gender || ''}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-2 text-slate-500 font-mono text-[11px]">
                    {patient.visitTime}
                  </td>
                  <td className="py-3.5 px-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {patient.careType}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    {getStatusBadge(patient.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-10 text-center border border-dashed border-slate-200/80 rounded-2xl bg-slate-50/50">
          <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">No hay atenciones registradas aún</p>
          <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs mx-auto">
            Los registros aparecerán aquí automáticamente conforme se ingrese cada paciente en campo.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentPatientsTable;