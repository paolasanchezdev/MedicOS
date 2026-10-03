// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/mapa/ubicacion/components/MapaBusqueda.tsx
// DESCRIPCIÓN: Buscador en tiempo real flotante sobre el mapa territorial.
// =========================================================================

import React, { useState } from 'react';
import { Search, X, Building2, Home, User, Share2 } from 'lucide-react';

export interface ElementoBusquedaMapa {
  id: string;
  tipo: 'ESTABLECIMIENTO' | 'VISITA' | 'PACIENTE' | 'REFERENCIA';
  titulo: string;
  subtitulo?: string;
  coordenadas: { lat: number; lng: number };
  distanciaKm?: number;
}

interface MapaBusquedaProps {
  elementos: ElementoBusquedaMapa[];
  onSeleccionar: (elemento: ElementoBusquedaMapa) => void;
}

export const MapaBusqueda: React.FC<MapaBusquedaProps> = ({
  elementos,
  onSeleccionar,
}) => {
  const [query, setQuery] = useState('');
  const [desplegado, setDesplegado] = useState(false);

  const filtrados = query.trim()
    ? elementos.filter(
        (el) =>
          el.titulo.toLowerCase().includes(query.toLowerCase()) ||
          el.subtitulo?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (el: ElementoBusquedaMapa) => {
    onSeleccionar(el);
    setDesplegado(false);
    setQuery('');
  };

  const renderIcono = (tipo: ElementoBusquedaMapa['tipo']) => {
    switch (tipo) {
      case 'ESTABLECIMIENTO':
        return <Building2 className="w-3.5 h-3.5 text-blue-600" />;
      case 'VISITA':
        return <Home className="w-3.5 h-3.5 text-[#166E7A]" />;
      case 'PACIENTE':
        return <User className="w-3.5 h-3.5 text-indigo-600" />;
      case 'REFERENCIA':
        return <Share2 className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="absolute top-4 left-4 z-1000 w-72 sm:w-96 shadow-lg">
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 overflow-hidden">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onFocus={() => setDesplegado(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setDesplegado(true);
          }}
          placeholder="Buscar comunidad, hospital, paciente o visita..."
          className="w-full pl-9 pr-8 py-2.5 text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none font-medium"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {desplegado && query.trim().length > 0 && (
        <div className="mt-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl max-h-64 overflow-y-auto divide-y divide-slate-100 animate-in fade-in duration-100">
          {filtrados.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-400 font-medium">
              No se encontraron coincidencias en el mapa.
            </div>
          ) : (
            filtrados.slice(0, 10).map((item) => (
              <div
                key={`${item.tipo}-${item.id}`}
                onClick={() => handleSelect(item)}
                className="p-2.5 hover:bg-teal-50/70 transition cursor-pointer flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-slate-50 shrink-0">
                    {renderIcono(item.tipo)}
                  </div>
                  <div className="truncate">
                    <p className="font-extrabold text-slate-900 truncate leading-tight">
                      {item.titulo}
                    </p>
                    <p className="text-[10.5px] text-slate-500 truncate">{item.subtitulo}</p>
                  </div>
                </div>

                {item.distanciaKm !== undefined && (
                  <span className="text-[10px] font-bold text-[#166E7A] bg-teal-50 px-1.5 py-0.5 rounded shrink-0">
                    {item.distanciaKm} km
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};