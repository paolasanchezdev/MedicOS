import React from 'react';
import { Activity, Stethoscope, Pill, CalendarCheck, FileSpreadsheet } from 'lucide-react';

export interface EventoSaludItem {
  id: string;
  fecha: string | Date;
  titulo: string;
  descripcion: string;
  tipo: 'CONSULTA' | 'SIGNOS_VITALES' | 'PRESCRIPCION' | 'CITA_PROGRAMADA';
}

interface Props {
  eventos?: EventoSaludItem[] | null;
}

export const LineaTiempoSalud: React.FC<Props> = ({ eventos }) => {
  const tieneEventos = eventos && eventos.length > 0;

  const obtenerIcono = (tipo: EventoSaludItem['tipo']) => {
    switch (tipo) {
      case 'CONSULTA':
        return <Stethoscope className="w-3.5 h-3.5 text-medicos-teal" />;
      case 'SIGNOS_VITALES':
        return <Activity className="w-3.5 h-3.5 text-medicos-teal" />;
      case 'PRESCRIPCION':
        return <Pill className="w-3.5 h-3.5 text-medicos-teal" />;
      case 'CITA_PROGRAMADA':
        return <CalendarCheck className="w-3.5 h-3.5 text-medicos-teal" />;
      default:
        return <FileSpreadsheet className="w-3.5 h-3.5 text-medicos-muted" />;
    }
  };

  return (
    <div className="bg-medicos-surface rounded-2xl border border-medicos-soft-border p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-medicos-soft-border pb-3">
        <h3 className="text-xs font-bold text-medicos-dark-blue uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-medicos-teal" /> Línea del Tiempo de Salud
        </h3>
        <span className="text-[10px] font-semibold text-medicos-muted uppercase">Cronología Médica</span>
      </div>

      {tieneEventos ? (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-medicos-soft-border">
          {eventos.map((ev) => {
            const fechaObj = new Date(ev.fecha);
            const fechaFormateada = !isNaN(fechaObj.getTime())
              ? fechaObj.toLocaleDateString('es-SV', { month: 'short', day: 'numeric', year: 'numeric' })
              : String(ev.fecha);

            return (
              <div key={ev.id} className="relative space-y-0.5">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-medicos-light-bg border border-medicos-soft-border flex items-center justify-center shadow-2xs">
                  {obtenerIcono(ev.tipo)}
                </div>
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="font-bold text-medicos-dark-blue">{ev.titulo}</span>
                  <span className="text-[10px] font-medium text-medicos-muted shrink-0">{fechaFormateada}</span>
                </div>
                <p className="text-[11px] text-medicos-muted leading-snug font-medium">{ev.descripcion}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-6 text-center space-y-1.5">
          <div className="w-10 h-10 rounded-full bg-medicos-light-bg text-medicos-teal flex items-center justify-center mx-auto border border-medicos-soft-border mb-2">
            <Activity className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-medicos-dark-blue">Sin historial cronológico registrado</p>
          <p className="text-[11px] text-medicos-muted max-w-xs mx-auto font-medium">
            A medida que asistas a consultas y registres constantes vitales, se mostrará el historial cronológico.
          </p>
        </div>
      )}
    </div>
  );
};

export default LineaTiempoSalud;