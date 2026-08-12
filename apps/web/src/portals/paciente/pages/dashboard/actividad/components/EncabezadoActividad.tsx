import React from 'react';
import { Activity } from 'lucide-react';

interface EncabezadoActividadProps {
  totalActividades?: number;
}

export const EncabezadoActividad: React.FC<EncabezadoActividadProps> = ({ totalActividades }) => {
  return (
    <div className="bg-medicos-surface rounded-2xl border border-medicos-soft-border p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-medicos-dark-blue flex items-center gap-2 tracking-tight">
            <Activity className="w-6 h-6 text-medicos-teal" /> Mi actividad médica
          </h1>
          <p className="text-xs text-medicos-muted font-medium">
            Consulta y revisa el historial detallado de actividades relacionadas con tu atención en salud.
          </p>
        </div>
        {typeof totalActividades === 'number' && (
          <div className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-medicos-light-bg text-medicos-teal border border-medicos-soft-border w-fit shadow-xs">
            {totalActividades} {totalActividades === 1 ? 'registro' : 'registros'}
          </div>
        )}
      </div>
    </div>
  );
};

export default EncabezadoActividad;