// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionResumenCard.tsx
// DESCRIPCIÓN: Paso 9: Resumen estructurado por bloques con botones de edición rápida en cuadrícula 2 columnas.
// =========================================================================

import React from 'react';
import {
  FileCheck,
  Edit3,
  User,
  ClipboardList,
  Activity,
  Eye,
  ShieldCheck,
  GraduationCap,
  CalendarClock,
  Send,
  Save,
  Loader2,
} from 'lucide-react';
import type { NuevaAtencionFormState } from '../../../../../../modules/atencion/types/atencion.types';

interface AtencionResumenCardProps {
  formData: NuevaAtencionFormState;
  onEditStep: (step: number) => void;
  onGuardar: () => void;
  isLoading?: boolean;
}

export const AtencionResumenCard: React.FC<AtencionResumenCardProps> = ({
  formData,
  onEditStep,
  onGuardar,
  isLoading = false,
}) => {
  const { patient, motivoCategoria, motivoDescripcion, evaluacion, acciones, seguimiento } = formData;
  const nombreCompleto = patient ? `${patient.firstName} ${patient.lastName}`.trim() : 'No seleccionado';

  const sintomasActivos = Object.entries(evaluacion.sintomas)
    .filter(([k, v]) => Boolean(v) && k !== 'otroDetalle' && k !== 'evolucionDias')
    .map(([k]) => {
      const labels: Record<string, string> = {
        fiebre: 'Fiebre',
        tos: 'Tos',
        dolorGeneral: 'Dolor de cuerpo',
        dificultadRespiratoria: 'Dificultad respiratoria',
        diarrea: 'Diarrea',
        vomitos: 'Vómitos',
        mareos: 'Mareos',
        dolorCabeza: 'Dolor de cabeza',
        dolorAbdominal: 'Dolor abdominal',
        otro: evaluacion.sintomas.otroDetalle ? `Otro (${evaluacion.sintomas.otroDetalle})` : 'Otro',
      };
      return labels[k] || k;
    });

  const accionesActivas = Object.entries(acciones)
    .filter(
      ([k, v]) =>
        Boolean(v) &&
        !k.startsWith('educacion') &&
        k !== 'otraAccionDetalle' &&
        k !== 'recomendacionesGenerales'
    )
    .map(([k]) => {
      const labels: Record<string, string> = {
        tomaSignos: 'Toma de signos vitales',
        primerosAuxilios: 'Primeros auxilios',
        curacionBasica: 'Curación básica',
        orientacionSanitaria: 'Orientación sanitaria',
        adherenciaTratamiento: 'Verificación de tratamiento',
        apoyoVacunacion: 'Apoyo en vacunación',
        otraAccion: acciones.otraAccionDetalle ? `Otra (${acciones.otraAccionDetalle})` : 'Otra acción',
      };
      return labels[k] || k;
    });

  const temasEducativos = Object.entries(acciones)
    .filter(([k, v]) => Boolean(v) && k.startsWith('educacion'))
    .map(([k]) => {
      const labels: Record<string, string> = {
        educacionHigiene: 'Higiene y saneamiento',
        educacionNutricion: 'Nutrición saludable',
        educacionDengue: 'Prevención de dengue',
        educacionSignosAlarma: 'Signos de alarma',
      };
      return labels[k] || k;
    });

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all duration-200 h-full flex flex-col justify-between space-y-2.5">
      {/* 1. Cabecera */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs shrink-0">
          <FileCheck className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block">
            Paso 8 de 8 • Revisión Final
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Resumen Integral de la Atención
          </h2>
        </div>
      </div>

      {/* 2. Cuadrícula de Resumen 4x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {/* 1. Paciente */}
        <div className="p-2.5 sm:p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-teal-600 shrink-0" /> 1. Persona Atendida
            </span>
            <p className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">{nombreCompleto}</p>
            <p className="text-[11px] text-slate-500 font-mono truncate">
              DUI: {patient?.dui || 'Sin DUI registrado'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="text-xs font-bold text-[#2B7A78] hover:text-[#1B5250] bg-white border border-slate-200/90 px-2 py-1 rounded-lg shadow-2xs hover:bg-slate-50 flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
          >
            <Edit3 className="w-3 h-3" /> <span>Editar</span>
          </button>
        </div>

        {/* 2. Motivo */}
        <div className="p-2.5 sm:p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <ClipboardList className="w-3.5 h-3.5 text-teal-600 shrink-0" /> 2. Motivo de Atención
            </span>
            <p className="font-bold text-slate-800 text-xs truncate">
              Categoría: <span className="text-teal-700">{motivoCategoria || 'No especificada'}</span>
            </p>
            <p className="text-[11px] text-slate-600 italic truncate">
              {motivoDescripcion ? `"${motivoDescripcion}"` : 'Sin descripción adicional'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="text-xs font-bold text-[#2B7A78] hover:text-[#1B5250] bg-white border border-slate-200/90 px-2 py-1 rounded-lg shadow-2xs hover:bg-slate-50 flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
          >
            <Edit3 className="w-3 h-3" /> <span>Editar</span>
          </button>
        </div>

        {/* 3. Valoración Clínica */}
        <div className="p-2.5 sm:p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-teal-600 shrink-0" /> 3. Valoración Clínica
            </span>
            <div className="flex flex-wrap gap-1">
              {evaluacion.signosVitales.systolic && (
                <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md font-bold text-slate-800 text-[10px] shadow-2xs">
                  PA: {evaluacion.signosVitales.systolic}/{evaluacion.signosVitales.diastolic}
                </span>
              )}
              {evaluacion.signosVitales.heartRate && (
                <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md font-bold text-slate-800 text-[10px] shadow-2xs">
                  FC: {evaluacion.signosVitales.heartRate} lpm
                </span>
              )}
              {evaluacion.signosVitales.temperature && (
                <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md font-bold text-slate-800 text-[10px] shadow-2xs">
                  T: {evaluacion.signosVitales.temperature}°C
                </span>
              )}
              {evaluacion.signosVitales.oxygenSat && (
                <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md font-bold text-slate-800 text-[10px] shadow-2xs">
                  SpO₂: {evaluacion.signosVitales.oxygenSat}%
                </span>
              )}
              {evaluacion.signosVitales.weight && (
                <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md font-bold text-slate-800 text-[10px] shadow-2xs">
                  P: {evaluacion.signosVitales.weight} kg
                </span>
              )}
            </div>
            {sintomasActivos.length > 0 && (
              <p className="text-[11px] text-slate-700 truncate">
                <span className="font-bold">Síntomas:</span> {sintomasActivos.join(', ')}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            className="text-xs font-bold text-[#2B7A78] hover:text-[#1B5250] bg-white border border-slate-200/90 px-2 py-1 rounded-lg shadow-2xs hover:bg-slate-50 flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
          >
            <Edit3 className="w-3 h-3" /> <span>Editar</span>
          </button>
        </div>

        {/* 4. Observaciones */}
        <div className="p-2.5 sm:p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-teal-600 shrink-0" /> 4. Observaciones en Terreno
            </span>
            <p className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed">
              {evaluacion.observacionesClinicas || 'Sin observaciones adicionales registradas.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(4)}
            className="text-xs font-bold text-[#2B7A78] hover:text-[#1B5250] bg-white border border-slate-200/90 px-2 py-1 rounded-lg shadow-2xs hover:bg-slate-50 flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
          >
            <Edit3 className="w-3 h-3" /> <span>Editar</span>
          </button>
        </div>

        {/* 5. Acciones */}
        <div className="p-2.5 sm:p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" /> 5. Acciones Realizadas
            </span>
            <p className="text-[11px] text-slate-700 font-medium truncate">
              {accionesActivas.length > 0 ? accionesActivas.join(', ') : 'Ninguna acción específica.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(5)}
            className="text-xs font-bold text-[#2B7A78] hover:text-[#1B5250] bg-white border border-slate-200/90 px-2 py-1 rounded-lg shadow-2xs hover:bg-slate-50 flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
          >
            <Edit3 className="w-3 h-3" /> <span>Editar</span>
          </button>
        </div>

        {/* 6. Educación */}
        <div className="p-2.5 sm:p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-teal-600 shrink-0" /> 6. Educación Sanitaria
            </span>
            <p className="text-[11px] text-slate-700 font-medium truncate">
              {temasEducativos.length > 0 ? temasEducativos.join(', ') : 'Orientación general.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(6)}
            className="text-xs font-bold text-[#2B7A78] hover:text-[#1B5250] bg-white border border-slate-200/90 px-2 py-1 rounded-lg shadow-2xs hover:bg-slate-50 flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
          >
            <Edit3 className="w-3 h-3" /> <span>Editar</span>
          </button>
        </div>

        {/* 7. Seguimiento */}
        <div className="p-2.5 sm:p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <CalendarClock className="w-3.5 h-3.5 text-teal-600 shrink-0" /> 7. Seguimiento
            </span>
            <p className="text-xs font-bold text-slate-900 truncate">
              {seguimiento.requiereSeguimiento ? `Sí — ${seguimiento.fechaSeguimiento}` : 'No requerido'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(7)}
            className="text-xs font-bold text-[#2B7A78] hover:text-[#1B5250] bg-white border border-slate-200/90 px-2 py-1 rounded-lg shadow-2xs hover:bg-slate-50 flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
          >
            <Edit3 className="w-3 h-3" /> <span>Editar</span>
          </button>
        </div>

        {/* 8. Referencia */}
        <div className="p-2.5 sm:p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Send className="w-3.5 h-3.5 text-amber-600 shrink-0" /> 8. Referencia
            </span>
            <p className="text-xs font-bold text-slate-900 truncate">
              {seguimiento.requiereReferencia
                ? `Sí — ${seguimiento.establecimientoDestinoNombre || 'Establecimiento'}`
                : 'No requerida'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(8)}
            className="text-xs font-bold text-[#2B7A78] hover:text-[#1B5250] bg-white border border-slate-200/90 px-2 py-1 rounded-lg shadow-2xs hover:bg-slate-50 flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
          >
            <Edit3 className="w-3 h-3" /> <span>Editar</span>
          </button>
        </div>
      </div>

      {/* 3. Pie de Acción */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <FileCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="text-[11px] sm:text-xs">
            Verifica que los datos sean correctos antes de guardar.
          </span>
        </div>

        <button
          type="button"
          onClick={onGuardar}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Guardar Atención</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AtencionResumenCard;