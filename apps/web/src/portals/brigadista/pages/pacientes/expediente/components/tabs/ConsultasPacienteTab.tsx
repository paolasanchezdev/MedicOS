// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/expediente/components/tabs/ConsultasPacienteTab.tsx
// DESCRIPCIÓN: Pestaña de historial clínico optimizada para móviles: títulos
//              multilínea sin truncamiento y badges responsivos.
// =========================================================================

import React, { useState, useMemo } from 'react';
import {
  Stethoscope,
  Calendar,
  ChevronRight,
  Activity,
  CalendarClock,
  Building2,
  CheckCircle2,
  User,
  MapPin,
  HeartPulse,
} from 'lucide-react';
import type { ConsultationRecord } from '../../../../../../../modules/patients';
import { DetalleAtencionModal } from '../../../../../../../modules/atencion';

interface ConsultasPacienteTabProps {
  consultations: ConsultationRecord[];
}

function formatDate(d?: string | Date): string {
  if (!d) return '—';
  try {
    const dateObj = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(dateObj.getTime())) return String(d);
    return dateObj.toLocaleDateString('es-SV', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(d);
  }
}

function formatCategoryLabel(catRaw: string): string {
  const normalized = catRaw.toUpperCase().replace(/[[\]]/g, '').trim();
  const map: Record<string, string> = {
    MATERNO_INFANTIL: 'Materno-Infantil',
    SINTOMAS: 'Malestar / Síntomas',
    CRONICO: 'Control Crónico',
    VACUNACION: 'Inmunización / Vacunas',
    PREVENCION: 'Promoción y Prevención',
    GENERAL: 'Consulta General',
    URGENCIA: 'Evaluación Prioritaria',
  };
  return map[normalized] || normalized.replace(/_/g, ' ');
}

export const ConsultasPacienteTab: React.FC<ConsultasPacienteTabProps> = ({
  consultations = [],
}) => {
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRecord | null>(null);

  // Filtrado de seguridad: descartar cualquier registro de inmunización
  const pureConsultations = useMemo(() => {
    return consultations.filter(
      (c) =>
        !c.chiefComplaint?.includes('[VACUNACION]') &&
        !c.diagnosisDesc?.includes('[VACUNACION]') &&
        !c.diagnosisDesc?.toLowerCase().startsWith('inmunización')
    );
  }, [consultations]);

  if (pureConsultations.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-8 sm:p-12 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-700 flex items-center justify-center mx-auto shadow-2xs">
          <Stethoscope className="w-6 h-6 stroke-2" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-800">Sin consultas médicas registradas</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            El paciente no cuenta con consultas médicas previas. Los registros de vacunación se encuentran en su pestaña dedicada.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {pureConsultations.map((c) => {
          const nombreDoctor = c.doctor
            ? `${c.doctor.firstName || ''} ${c.doctor.lastName || ''}`.trim()
            : 'Personal de Salud Comunitario';

          const nombreBrigada = c.brigade?.name || 'Atención Comunitaria en Terreno';

          let categoriaExtraida = '';
          const matchCat = (c.diagnosisDesc || c.chiefComplaint || '').match(/\[(.*?)\]/);
          if (matchCat && matchCat[1]) {
            categoriaExtraida = formatCategoryLabel(matchCat[1]);
          }

          const tituloLimpio = (c.diagnosisDesc || 'Atención Comunitaria')
            .replace(/\[.*?\]/g, '')
            .trim();

          const partesMotivo = (c.chiefComplaint || '').split(' | ');
          let motivoLimpio = partesMotivo[0] || '';
          motivoLimpio = motivoLimpio
            .replace(/^Motivo:\s*/i, '')
            .replace(/\[.*?\]/g, '')
            .trim();

          let sintomas: string[] = [];
          const sintomaPart = partesMotivo.find((p) => p.startsWith('Síntomas reportados:'));
          if (sintomaPart) {
            sintomas = sintomaPart
              .replace('Síntomas reportados:', '')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
          }

          const partesPlan = (c.treatmentPlan || '').split(' | ');

          let totalAcciones = 0;
          const accionesPart = partesPlan.find((p) => p.startsWith('Acciones realizadas:'));
          if (accionesPart) {
            totalAcciones = accionesPart
              .replace('Acciones realizadas:', '')
              .split(',')
              .filter(Boolean).length;
          }

          let fechaSeguimiento = '';
          const seguimientoPart = partesPlan.find((p) => p.startsWith('Seguimiento programado:'));
          if (seguimientoPart) {
            const segTexto = seguimientoPart.replace('Seguimiento programado:', '').trim();
            const matchFecha = segTexto.match(/\d{4}-\d{2}-\d{2}/);
            fechaSeguimiento = matchFecha ? matchFecha[0] : 'Programado';
          }

          let hospitalDestino = '';
          const referenciaPart = partesPlan.find((p) => p.startsWith('Referencia emitida:'));
          if (referenciaPart) {
            const refTexto = referenciaPart.replace('Referencia emitida:', '').trim();
            const matchHospital = refTexto.match(/Destino\s*->\s*([^|]+)/i);
            hospitalDestino = matchHospital && matchHospital[1] ? matchHospital[1].trim() : 'Red Hospitalaria';
          }

          return (
            <div
              key={c.id}
              className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-3.5 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                {/* Cabecera Responsiva: en móvil los badges no estrangulan el título */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs shrink-0 mt-0.5">
                      <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 stroke-2" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {categoriaExtraida && (
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200/80 px-1.5 py-0.2 rounded-md">
                            {categoriaExtraida}
                          </span>
                        )}
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-snug wrap-break-word">
                          {tituloLimpio || 'Atención Médica Comunitaria'}
                        </h3>
                      </div>

                      <div className="text-[11px] sm:text-xs text-slate-500 font-medium flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                        <span className="flex items-center gap-1 text-slate-600">
                          <User className="w-3 h-3 text-slate-400" />
                          {nombreDoctor}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1 text-teal-700 font-semibold truncate max-w-55 sm:max-w-none">
                          <MapPin className="w-3 h-3 text-teal-600" />
                          {nombreBrigada}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badges de Estado y Fecha */}
                  <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto shrink-0 pl-11 sm:pl-0">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {c.status === 'COMPLETED' ? 'Finalizada' : c.status || 'Registrada'}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-600 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg sm:rounded-xl border border-slate-200/60 shadow-2xs">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {formatDate(c.consultationDate)}
                    </span>
                  </div>
                </div>

                {/* Motivo Clínico */}
                <div className="mt-2.5 sm:mt-3 p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-0.5">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-teal-600" />
                    Motivo Clínico de Atención
                  </span>
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                    {motivoLimpio || 'Evaluación integral y valoración en terreno.'}
                  </p>
                </div>

                {/* Microtarjetas de Métricas Clínicas en Grilla 2x2 en Celular */}
                <div className="mt-2.5 grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                      <HeartPulse className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-bold uppercase text-slate-400 block">Síntomas</span>
                      <p className="text-[11px] font-bold text-slate-900 truncate">
                        {sintomas.length > 0 ? `${sintomas.length} reg.` : 'Sin síntomas'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-bold uppercase text-slate-400 block">Acciones</span>
                      <p className="text-[11px] font-bold text-slate-900 truncate">
                        {totalAcciones > 0 ? `${totalAcciones} acciones` : 'Evaluación base'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-700 flex items-center justify-center shrink-0">
                      <CalendarClock className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-bold uppercase text-slate-400 block">Seguimiento</span>
                      <p className="text-[11px] font-bold text-slate-900 truncate">
                        {fechaSeguimiento ? formatDate(fechaSeguimiento) : 'No requerido'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-bold uppercase text-slate-400 block">Derivación</span>
                      <p className="text-[11px] font-bold text-slate-900 truncate" title={hospitalDestino || 'Sin derivación'}>
                        {hospitalDestino || 'Sin derivación'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de Apertura */}
              <button
                type="button"
                onClick={() => setSelectedConsultation(c)}
                className="pt-2.5 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors group/btn cursor-pointer"
              >
                <span>Ver expediente clínico completo y detalles</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 text-teal-600" />
              </button>
            </div>
          );
        })}
      </div>

      <DetalleAtencionModal
        attention={selectedConsultation}
        isOpen={Boolean(selectedConsultation)}
        onClose={() => setSelectedConsultation(null)}
      />
    </>
  );
};

export default ConsultasPacienteTab;