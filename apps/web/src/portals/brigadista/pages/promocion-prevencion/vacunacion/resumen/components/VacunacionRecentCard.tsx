// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/resumen/components/VacunacionRecentCard.tsx
// DESCRIPCIÓN: Tarjeta de últimas aplicaciones con diseño refinado estilo ActividadReciente.
// =========================================================================

import React from 'react';
import { Syringe, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { VaccinationRecord } from '../../../../../../../modules/vaccinations';

interface VacunacionRecentCardProps {
  recentApplications: VaccinationRecord[];
}

function formatDate(d: string): string {
  try {
    return new Date(d).toLocaleDateString('es-SV', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return d;
  }
}

export const VacunacionRecentCard: React.FC<VacunacionRecentCardProps> = ({
  recentApplications = [],
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs">
              <Syringe className="w-4 h-4 stroke-2" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Últimas Aplicaciones en Terreno
              </h3>
              <p className="text-[11px] text-slate-400">
                Registro en tiempo real durante la jornada
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/brigadista/promocion-prevencion/vacunacion/historial')}
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 transition cursor-pointer"
          >
            <span>Ver todo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lista de Registros */}
        <div className="mt-4 space-y-2.5">
          {recentApplications.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <Syringe className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">
                Aún no se registran vacunas aplicadas en la jornada activa.
              </p>
            </div>
          ) : (
            recentApplications.slice(0, 5).map((v) => {
              const patientName =
                `${v.patient?.firstName || ''} ${v.patient?.lastName || ''}`.trim() ||
                'Persona Atendida';

              return (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 border border-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-700 border border-teal-500/20 flex items-center justify-center font-bold text-xs shrink-0">
                      {v.patient?.firstName ? v.patient.firstName.charAt(0).toUpperCase() : 'V'}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-slate-900 truncate">{patientName}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 truncate">
                        <span className="font-semibold text-teal-800">{v.vaccineName}</span>
                        <span>&bull;</span>
                        <span className="font-mono text-slate-400">Dosis {v.doseNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-3">
                    <span className="text-[10px] text-slate-400 font-medium flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(v.administeredAt)}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                      Lote: {v.lotNumber}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          Protocolo MINSAL verificado
        </span>
        <button
          type="button"
          onClick={() => navigate('/brigadista/promocion-prevencion/vacunacion/historial')}
          className="font-bold text-teal-700 hover:text-teal-900 transition cursor-pointer"
        >
          Consultar historial &rarr;
        </button>
      </div>
    </div>
  );
};