// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/buscar/components/EstadoBusqueda.tsx
// DESCRIPCIÓN: Estados visuales (vacío, sin resultados, cargando, offline, error).
// =========================================================================

import React from 'react';
import { Search, AlertCircle, WifiOff, RefreshCw } from 'lucide-react';

interface EstadoBusquedaProps {
  tipo: 'INICIAL' | 'SIN_RESULTADOS' | 'ERROR' | 'OFFLINE';
  mensajeError?: string | null;
  onRetry?: () => void;
}

export const EstadoBusqueda: React.FC<EstadoBusquedaProps> = ({
  tipo,
  mensajeError,
  onRetry,
}) => {
  if (tipo === 'INICIAL') {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="w-12 h-12 bg-teal-50 text-[#2B7A78] rounded-2xl flex items-center justify-center mx-auto border border-teal-100 shadow-2xs">
          <Search className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-800">Inicia una búsqueda</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Introduce el nombre, número de DUI o ID del paciente en la barra superior para consultar su registro.
          </p>
        </div>
      </div>
    );
  }

  if (tipo === 'SIN_RESULTADOS') {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-100 shadow-2xs">
          <Search className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-800">No se encontraron pacientes</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Verifica que el nombre o número de DUI esté escrito correctamente e intenta de nuevo.
          </p>
        </div>
      </div>
    );
  }

  if (tipo === 'OFFLINE') {
    return (
      <div className="p-6 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-center gap-3 text-xs text-amber-900 shadow-2xs">
        <WifiOff className="w-5 h-5 text-amber-600 shrink-0" />
        <div className="space-y-0.5">
          <p className="font-bold">Modo sin conexión activo</p>
          <p className="text-amber-700 leading-relaxed">
            Las consultas se realizan sobre la base local sincronizada de MedicOS en la estación de trabajo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 text-center bg-white rounded-2xl border border-rose-200/80 shadow-2xs space-y-4">
      <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100 shadow-2xs">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-800">No fue posible completar la búsqueda</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {mensajeError || 'Ocurrió un error al consultar el padrón de pacientes.'}
        </p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reintentar</span>
        </button>
      )}
    </div>
  );
};