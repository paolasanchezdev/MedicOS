// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/dashboard/resumen/components/TarjetaTratamientosActivos.tsx
// DESCRIPCIÓN: Tarjeta de prescripciones y tratamientos activos estilo MedicOS.
// =========================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, ChevronRight, Calendar, UserCheck } from 'lucide-react';

export interface TratamientoActualData {
  indicaciones: string;
  fechaConsulta?: string | Date | null;
  doctorNombre?: string | null;
  medicamentos?: Array<{
    nombre: string;
    dosis: string;
    frecuencia: string;
    duracion?: string;
  }>;
}

interface Props {
  tratamiento: TratamientoActualData | null;
}

export const TarjetaTratamientosActivos: React.FC<Props> = ({ tratamiento }) => {
  const tieneTratamiento =
    tratamiento &&
    (Boolean(tratamiento.indicaciones?.trim()) ||
      (tratamiento.medicamentos && tratamiento.medicamentos.length > 0));

  if (!tieneTratamiento || !tratamiento) {
    return (
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full">
        <div>
          {/* Cabecera */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-500 shadow-2xs">
              <Pill className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
              Sin prescripciones
            </span>
          </div>

          {/* Métrica / Título */}
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tratamiento y Recetas
            </p>
            <p className="text-base font-bold text-slate-800 tracking-tight mt-1">
              No registras tratamientos activos
            </p>
            <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1">
              Cuando un médico prescriba un medicamento o plan de dosificación en una brigada médica, aparecerá registrado en este módulo.
            </p>
          </div>
        </div>

        {/* Acción inferior */}
        <Link
          to="/paciente/tratamientos/recetas-activas"
          className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-[#2a726d] hover:text-[#23605c] transition-colors group/btn"
        >
          <span>Ver catálogo de medicamentos</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    );
  }

  const fechaObj = tratamiento.fechaConsulta ? new Date(tratamiento.fechaConsulta) : null;
  const fechaFormateada = fechaObj && !isNaN(fechaObj.getTime())
    ? fechaObj.toLocaleDateString('es-SV', { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full">
      <div>
        {/* Cabecera */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-xs">
            <Pill className="w-5 h-5" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Tratamiento Activo
          </span>
        </div>

        {/* Título */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Esquema Terapéutico
          </p>
          <p className="text-base font-bold text-slate-900 tracking-tight mt-1">
            Prescripción Vigente
          </p>
        </div>

        {/* Contenido / Medicamentos o Plan */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
          {tratamiento.medicamentos && tratamiento.medicamentos.length > 0 ? (
            <div className="space-y-2">
              {tratamiento.medicamentos.slice(0, 3).map((med, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-900 truncate">{med.nombre}</p>
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {med.dosis} &bull; {med.frecuencia}
                    </p>
                  </div>
                  {med.duracion && (
                    <span className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded-md border border-slate-200/60 text-slate-700 shadow-2xs shrink-0">
                      {med.duracion}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Indicaciones Médicas
              </p>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                {tratamiento.indicaciones}
              </p>
            </div>
          )}

          {/* Metadatos (Doctor y Fecha) */}
          {(tratamiento.doctorNombre || fechaFormateada) && (
            <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-medium gap-2">
              {tratamiento.doctorNombre && (
                <span className="flex items-center gap-1.5 truncate">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Dr(a). {tratamiento.doctorNombre}</span>
                </span>
              )}
              {fechaFormateada && (
                <span className="flex items-center gap-1 shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Emisión: {fechaFormateada}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Acción inferior */}
      <Link
        to="/paciente/tratamientos/recetas-activas"
        className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-[#2a726d] hover:text-[#23605c] transition-colors group/btn"
      >
        <span>Ver detalle de recetas y tomas</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </Link>
    </div>
  );
};

export default TarjetaTratamientosActivos;