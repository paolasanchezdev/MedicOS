import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export type TipoFiltroActividad = 'todas' | 'consultas' | 'citas' | 'vitales';

export interface FiltrosState {
  tipo: TipoFiltroActividad;
  fechaDesde: string;
  fechaHasta: string;
  busqueda: string;
}

interface FiltrosActividadProps {
  filtros: FiltrosState;
  onChange: (nuevosFiltros: FiltrosState) => void;
  onLimpiar: () => void;
}

export const FiltrosActividad: React.FC<FiltrosActividadProps> = ({
  filtros,
  onChange,
  onLimpiar,
}) => {
  const handleTipoChange = (tipo: TipoFiltroActividad) => {
    onChange({ ...filtros, tipo });
  };

  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filtros, busqueda: e.target.value });
  };

  const handleFechaDesdeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filtros, fechaDesde: e.target.value });
  };

  const handleFechaHastaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filtros, fechaHasta: e.target.value });
  };

  const tieneFiltrosActivos =
    filtros.tipo !== 'todas' ||
    filtros.fechaDesde !== '' ||
    filtros.fechaHasta !== '' ||
    filtros.busqueda !== '';

  return (
    <div className="bg-medicos-surface border border-medicos-soft-border rounded-2xl p-5 space-y-4 shadow-xs">
      {/* Botones de Categorías / Pestañas */}
      <div className="flex flex-wrap gap-2 border-b border-medicos-soft-border pb-4">
        <button
          type="button"
          onClick={() => handleTipoChange('todas')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-medicos-teal ${
            filtros.tipo === 'todas'
              ? 'bg-medicos-teal text-white shadow-xs'
              : 'bg-medicos-light-bg text-medicos-muted hover:text-medicos-dark-blue border border-medicos-soft-border'
          }`}
        >
          Todas
        </button>
        <button
          type="button"
          onClick={() => handleTipoChange('consultas')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-medicos-teal ${
            filtros.tipo === 'consultas'
              ? 'bg-medicos-teal text-white shadow-xs'
              : 'bg-medicos-light-bg text-medicos-muted hover:text-medicos-dark-blue border border-medicos-soft-border'
          }`}
        >
          Consultas
        </button>
        <button
          type="button"
          onClick={() => handleTipoChange('citas')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-medicos-teal ${
            filtros.tipo === 'citas'
              ? 'bg-medicos-teal text-white shadow-xs'
              : 'bg-medicos-light-bg text-medicos-muted hover:text-medicos-dark-blue border border-medicos-soft-border'
          }`}
        >
          Citas / Seguimiento
        </button>
        <button
          type="button"
          onClick={() => handleTipoChange('vitales')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-medicos-teal ${
            filtros.tipo === 'vitales'
              ? 'bg-medicos-teal text-white shadow-xs'
              : 'bg-medicos-light-bg text-medicos-muted hover:text-medicos-dark-blue border border-medicos-soft-border'
          }`}
        >
          Signos Vitales
        </button>
      </div>

      {/* Campos de Búsqueda y Fechas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-1">
        <div>
          <label htmlFor="busqueda-actividad" className="block text-xs font-bold text-medicos-dark-blue mb-1.5">
            Buscar
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-medicos-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="busqueda-actividad"
              type="text"
              value={filtros.busqueda}
              onChange={handleBusquedaChange}
              placeholder="Buscar por médico, diagnóstico..."
              className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-medicos-light-bg border border-medicos-soft-border rounded-xl focus:ring-2 focus:ring-medicos-teal outline-none text-medicos-dark-blue placeholder:text-medicos-muted transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="fecha-desde" className="block text-xs font-bold text-medicos-dark-blue mb-1.5">
            Desde
          </label>
          <input
            id="fecha-desde"
            type="date"
            value={filtros.fechaDesde}
            onChange={handleFechaDesdeChange}
            className="w-full px-3.5 py-2.5 text-xs bg-medicos-light-bg border border-medicos-soft-border rounded-xl focus:ring-2 focus:ring-medicos-teal outline-none text-medicos-dark-blue transition-all"
          />
        </div>

        <div>
          <label htmlFor="fecha-hasta" className="block text-xs font-bold text-medicos-dark-blue mb-1.5">
            Hasta
          </label>
          <input
            id="fecha-hasta"
            type="date"
            value={filtros.fechaHasta}
            onChange={handleFechaHastaChange}
            className="w-full px-3.5 py-2.5 text-xs bg-medicos-light-bg border border-medicos-soft-border rounded-xl focus:ring-2 focus:ring-medicos-teal outline-none text-medicos-dark-blue transition-all"
          />
        </div>
      </div>

      {tieneFiltrosActivos && (
        <div className="flex justify-end pt-2 border-t border-medicos-soft-border">
          <button
            type="button"
            onClick={onLimpiar}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-medicos-muted hover:text-medicos-dark-blue transition-colors focus:outline-none focus:ring-2 focus:ring-medicos-teal rounded-lg px-3 py-1.5 bg-medicos-light-bg border border-medicos-soft-border"
          >
            <RotateCcw className="w-3.5 h-3.5 text-medicos-teal" />
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default FiltrosActividad;