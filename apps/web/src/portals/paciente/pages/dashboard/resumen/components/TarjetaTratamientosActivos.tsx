import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, ChevronRight, Calendar, AlertCircle } from 'lucide-react';

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
  if (!tratamiento || (!tratamiento.indicaciones && (!tratamiento.medicamentos || tratamiento.medicamentos.length === 0))) {
    return (
      <div className="bg-medicos-surface rounded-2xl border border-medicos-soft-border p-5 shadow-xs flex flex-col justify-between h-full space-y-4">
        <div className="flex items-center justify-between border-b border-medicos-soft-border pb-3">
          <span className="text-xs font-bold text-medicos-dark-blue uppercase tracking-wider flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-medicos-teal" /> Prescripciones y Fármacos
          </span>
          <span className="text-[10px] font-semibold text-medicos-muted uppercase">Sin tratamientos</span>
        </div>

        <div className="py-6 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-medicos-light-bg text-medicos-teal flex items-center justify-center mx-auto">
            <Pill className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-medicos-dark-blue">No hay tratamientos o prescripciones activas</p>
          <p className="text-[11px] text-medicos-muted max-w-xs mx-auto">
            No tienes indicaciones farmacológicas ni recetas vigentes emitidas por un médico.
          </p>
        </div>

        <div className="pt-2 border-t border-medicos-soft-border flex items-center justify-end">
          <Link
            to="/paciente/tratamientos"
            className="px-3 py-1.5 rounded-lg border border-medicos-soft-border text-medicos-teal text-xs font-semibold hover:bg-medicos-light-bg transition-colors flex items-center gap-1"
          >
            Historial de recetas <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const fechaObj = tratamiento.fechaConsulta ? new Date(tratamiento.fechaConsulta) : null;
  const fechaFormateada = fechaObj && !isNaN(fechaObj.getTime())
    ? fechaObj.toLocaleDateString('es-SV', { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  return (
    <div className="bg-medicos-surface rounded-2xl border border-medicos-soft-border p-5 shadow-xs flex flex-col justify-between h-full space-y-4">
      <div className="flex items-center justify-between border-b border-medicos-soft-border pb-3">
        <span className="text-xs font-bold text-medicos-dark-blue uppercase tracking-wider flex items-center gap-1.5">
          <Pill className="w-4 h-4 text-medicos-teal" /> Tratamiento Vigente
        </span>
        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-medicos-light-bg text-medicos-teal border border-medicos-soft-border">
          ACTIVO
        </span>
      </div>

      <div className="space-y-3">
        {tratamiento.medicamentos && tratamiento.medicamentos.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-medicos-muted uppercase tracking-wider">Medicamentos Prescritos</p>
            <div className="space-y-1.5">
              {tratamiento.medicamentos.slice(0, 3).map((med, idx) => (
                <div key={idx} className="bg-medicos-light-bg p-2.5 rounded-xl border border-medicos-soft-border text-xs flex items-center justify-between">
                  <div>
                    <p className="font-bold text-medicos-dark-blue">{med.nombre}</p>
                    <p className="text-[11px] text-medicos-muted">{med.dosis} — {med.frecuencia}</p>
                  </div>
                  {med.duracion && (
                    <span className="text-[10px] font-medium bg-medicos-surface px-2 py-0.5 rounded border border-medicos-soft-border text-medicos-teal shrink-0">
                      {med.duracion}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-medicos-light-bg p-3 rounded-xl border border-medicos-soft-border">
            <p className="text-[11px] font-bold text-medicos-muted uppercase tracking-wider mb-1">Plan e Indicaciones Médicas</p>
            <p className="text-xs text-medicos-dark-blue leading-relaxed font-medium">
              {tratamiento.indicaciones}
            </p>
          </div>
        )}

        {(tratamiento.doctorNombre || fechaFormateada) && (
          <div className="text-[11px] text-medicos-muted space-y-0.5 pt-1">
            {tratamiento.doctorNombre && (
              <p className="font-semibold text-medicos-dark-blue">Indicado por: {tratamiento.doctorNombre}</p>
            )}
            {fechaFormateada && (
              <p className="flex items-center gap-1 text-medicos-muted">
                <Calendar className="w-3 h-3 text-medicos-teal" /> Emisión: {fechaFormateada}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-medicos-soft-border flex items-center justify-between">
        <span className="text-[10px] text-medicos-muted flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-medicos-teal" /> Cumplir horario indicado
        </span>
        <Link
          to="/paciente/tratamientos"
          className="px-3 py-1.5 rounded-lg border border-medicos-soft-border text-medicos-teal text-xs font-semibold hover:bg-medicos-light-bg transition-colors flex items-center gap-1"
        >
          Ver todas las recetas <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default TarjetaTratamientosActivos;