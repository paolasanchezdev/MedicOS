import React from 'react';
import { AlertCircle, RefreshCw, Inbox, SearchX } from 'lucide-react';

interface EstadoActividadProps {
  tipo: 'cargando' | 'vacio' | 'sin_resultados' | 'error';
  mensajeError?: string;
  onReintentar?: () => void;
}

export const EstadoActividad: React.FC<EstadoActividadProps> = ({
  tipo,
  mensajeError,
  onReintentar,
}) => {
  if (tipo === 'cargando') {
    return (
      <div className="space-y-3 py-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="p-4 bg-white border border-slate-200 rounded-xl animate-pulse space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-3 bg-slate-100 rounded w-2/3" />
            <div className="h-3 bg-slate-100 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (tipo === 'vacio') {
    return (
      <div className="text-center py-12 px-4 bg-white border border-slate-200 rounded-xl space-y-2">
        <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-slate-800">No hay actividad registrada</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Cuando realices una actividad relacionada con tu atención médica, aparecerá aquí.
        </p>
      </div>
    );
  }

  if (tipo === 'sin_resultados') {
    return (
      <div className="text-center py-12 px-4 bg-white border border-slate-200 rounded-xl space-y-2">
        <SearchX className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-slate-800">No se encontraron actividades</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Prueba con otro tipo de actividad o rango de fechas.
        </p>
      </div>
    );
  }

  return (
    <div className="my-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-left">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <div className="text-xs text-rose-900">
          <p className="font-bold">Error de sincronización</p>
          <p className="text-rose-700">{mensajeError || 'No fue posible cargar tu actividad.'}</p>
        </div>
      </div>
      {onReintentar && (
        <button
          type="button"
          onClick={onReintentar}
          className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reintentar
        </button>
      )}
    </div>
  );
};

export default EstadoActividad;