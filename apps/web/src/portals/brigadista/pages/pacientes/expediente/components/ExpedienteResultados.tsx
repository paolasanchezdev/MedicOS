// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/expediente/components/ExpedienteResultados.tsx
// DESCRIPCIÓN: Listado de pacientes recientes y búsqueda en vivo con diseño limpio Admin.
// =========================================================================

import React from 'react';
import { MapPin, Phone, UserX, Clock, ChevronRight, FileText } from 'lucide-react';
import type { PatientRecord } from '../../../../../../modules/patients';

interface ExpedienteResultadosProps {
  patients: PatientRecord[];
  onSelectPatient: (patientId: string) => void;
  isSearching: boolean;
  query: string;
}

function formatDate(d?: string | Date): string {
  if (!d) return '—';
  try {
    const dateObj = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(dateObj.getTime())) return String(d);
    return dateObj.toLocaleDateString('es-SV', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return String(d);
  }
}

export const ExpedienteResultados: React.FC<ExpedienteResultadosProps> = ({
  patients,
  onSelectPatient,
  isSearching,
  query,
}) => {
  if (patients.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-10 text-center space-y-2 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
          <UserX className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">
          {query ? `Sin coincidencias para "${query}"` : 'No hay pacientes registrados'}
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
          Verifica que el DUI o nombre esté escrito correctamente en el buscador en vivo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Encabezado del listado */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {isSearching ? (
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Coincidencias encontradas ({patients.length})
            </span>
          ) : (
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-[#1B5250]" />
              Pacientes Recientes en la Brigada
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          Selecciona un paciente para ver su historial
        </span>
      </div>

      {/* Lista de filas con el estilo de item reciente de TarjetaPacientes */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] divide-y divide-slate-100 overflow-hidden">
        {patients.map((p) => {
          const fullName = `${p.firstName} ${p.lastName}`.trim();
          const cleanDui = p.dui ? p.dui.replace(/[^0-9]/g, '') : '';
          const expedienteNum = cleanDui ? `EXP-2026-${cleanDui.slice(-4)}` : `EXP-${p.id.slice(0, 6).toUpperCase()}`;

          return (
            <div
              key={p.id}
              onClick={() => onSelectPatient(p.id)}
              className="p-4 sm:px-5 hover:bg-slate-50/90 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
            >
              {/* Identidad */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs group-hover:bg-[#1B5250] group-hover:text-white transition-colors">
                  {p.firstName[0]}
                  {p.lastName[0]}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1B5250] transition-colors truncate">
                      {fullName}
                    </h4>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200/60">
                      {p.dui || 'Sin DUI'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap font-medium">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-slate-400" />
                      {expedienteNum}
                    </span>
                    <span>&bull;</span>
                    <span>Nacimiento: {formatDate(p.dateOfBirth)}</span>
                    {p.phone && (
                      <>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 font-mono font-semibold text-slate-600">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {p.phone}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Ubicación y Botón de Acción */}
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right text-xs text-slate-500 hidden md:block max-w-50 truncate">
                  <span className="flex items-center sm:justify-end gap-1 text-[11px] font-medium">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{p.address || 'Sin dirección'}</span>
                  </span>
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all">
                  <span>Ver expediente</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};