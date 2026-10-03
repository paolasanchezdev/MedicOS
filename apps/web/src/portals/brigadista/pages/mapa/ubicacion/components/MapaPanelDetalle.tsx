// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/mapa/ubicacion/components/MapaPanelDetalle.tsx
// DESCRIPCIÓN: Panel contextual deslizable para interactuar con la entidad seleccionada.
// =========================================================================

import React from 'react';
import { X, Play, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ElementoBusquedaMapa } from './MapaBusqueda';

interface MapaPanelDetalleProps {
  elemento: ElementoBusquedaMapa | null;
  datosDetalle?: Record<string, unknown>;
  onClose: () => void;
  onIniciarVisita?: (visitaId: string) => void;
}

export const MapaPanelDetalle: React.FC<MapaPanelDetalleProps> = ({
  elemento,
  datosDetalle = {},
  onClose,
  onIniciarVisita,
}) => {
  const navigate = useNavigate();

  if (!elemento) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-1000 sm:w-96 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 shadow-2xl p-4.5 animate-in slide-in-from-bottom-2 sm:slide-in-from-right-2 duration-150 space-y-3">
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-[9.5px] font-black uppercase tracking-wider bg-teal-50 text-[#166E7A] border border-teal-200">
              {elemento.tipo}
            </span>
            {elemento.distanciaKm !== undefined && (
              <span className="text-[10px] font-bold text-slate-500">
                A {elemento.distanciaKm} km de ti
              </span>
            )}
          </div>
          <h4 className="text-sm font-black text-slate-900 truncate">
            {elemento.titulo}
          </h4>
          <p className="text-[11px] text-slate-500 truncate">{elemento.subtitulo}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Acciones e Información según Entidad */}
      <div className="text-xs space-y-2 text-slate-700">
        {elemento.tipo === 'ESTABLECIMIENTO' && (
          <div className="space-y-1.5">
            <p className="text-slate-600">
              Nivel: <strong>{String(datosDetalle['level'] || 'Básico')}</strong>
            </p>
            {Boolean(datosDetalle['phone']) && (
              <p className="flex items-center gap-1.5 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-[#166E7A]" />
                <span>{String(datosDetalle['phone'])}</span>
              </p>
            )}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/brigadista/referencias/nueva')}
                className="flex-1 py-2 rounded-xl bg-[#166E7A] hover:bg-[#105F68] text-white font-bold text-center text-xs transition cursor-pointer"
              >
                + Referir Paciente (F-01)
              </button>
              <button
                type="button"
                onClick={() => navigate('/brigadista/mapa/establecimientos')}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Ver Directorio
              </button>
            </div>
          </div>
        )}

        {elemento.tipo === 'VISITA' && (
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200 space-y-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Motivo:</span>
              <p className="font-extrabold text-slate-900">{elemento.subtitulo}</p>
              <p className="text-[11px] text-teal-800">
                Estado: <strong>{String(datosDetalle['status'] || 'SCHEDULED')}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {String(datosDetalle['status']) === 'SCHEDULED' && onIniciarVisita && (
                <button
                  type="button"
                  onClick={() => onIniciarVisita(elemento.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#166E7A] hover:bg-[#105F68] text-white font-bold text-xs transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Iniciar Visita en Terreno</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate('/brigadista/visitas/programadas')}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Ver Agenda
              </button>
            </div>
          </div>
        )}

        {elemento.tipo === 'PACIENTE' && (
          <div className="space-y-2">
            <p className="text-slate-600">
              DUI: <strong>{String(datosDetalle['dui'] || 'Sin DUI')}</strong>
            </p>
            <p className="text-slate-600 truncate">
              Comunidad: <strong>{String(datosDetalle['address'] || 'Asignada')}</strong>
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => navigate('/brigadista/pacientes/expediente')}
                className="flex-1 py-2 rounded-xl bg-[#166E7A] hover:bg-[#105F68] text-white font-bold text-xs text-center transition cursor-pointer"
              >
                Ver Expediente
              </button>
              <button
                type="button"
                onClick={() => navigate('/brigadista/visitas/programadas')}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Agendar Visita
              </button>
            </div>
          </div>
        )}

        {elemento.tipo === 'REFERENCIA' && (
          <div className="space-y-2">
            <p className="text-slate-600">
              Destino: <strong>{String(datosDetalle['establishmentName'] || 'Red de Salud')}</strong>
            </p>
            <p className="text-slate-600">
              Estado: <strong>{String(datosDetalle['status'] || 'PENDING')}</strong>
            </p>
            <button
              type="button"
              onClick={() => navigate('/brigadista/referencias/pendientes')}
              className="w-full py-2 rounded-xl bg-[#166E7A] hover:bg-[#105F68] text-white font-bold text-xs text-center transition cursor-pointer"
            >
              Consultar F-01
            </button>
          </div>
        )}
      </div>
    </div>
  );
};