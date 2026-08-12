import React from 'react';
import ActividadItem, { type ElementoActividad } from './ActividadItem';

interface ActividadRecienteProps {
  actividades: ElementoActividad[];
  onVerDetalle: (item: ElementoActividad) => void;
}

const obtenerClaveMes = (fechaISO: string): string => {
  try {
    const date = new Date(fechaISO);
    return new Intl.DateTimeFormat('es-SV', { month: 'long', year: 'numeric' }).format(date).toUpperCase();
  } catch {
    return 'OTRAS FECHAS';
  }
};

export const ActividadReciente: React.FC<ActividadRecienteProps> = ({
  actividades,
  onVerDetalle,
}) => {
  const grupos = actividades.reduce<Record<string, ElementoActividad[]>>((acc, item) => {
    const clave = obtenerClaveMes(item.fechaISO);
    if (!acc[clave]) {
      acc[clave] = [];
    }
    acc[clave].push(item);
    return acc;
  }, {});

  const clavesMeses = Object.keys(grupos);

  return (
    <div className="space-y-6">
      {clavesMeses.map((mes) => (
        <div key={mes} className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-medicos-muted tracking-wider">{mes}</span>
            <div className="h-px bg-medicos-soft-border flex-1" />
          </div>
          <div className="space-y-3">
            {grupos[mes].map((item) => (
              <ActividadItem key={item.id} item={item} onVerDetalle={onVerDetalle} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActividadReciente;