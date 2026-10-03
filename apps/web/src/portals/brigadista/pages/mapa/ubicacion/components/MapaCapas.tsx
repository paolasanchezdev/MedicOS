// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/mapa/ubicacion/components/MapaCapas.tsx
// DESCRIPCIÓN: Selector de capas territoriales activas sobre el mapa.
// =========================================================================

import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Check, Building2, Home, User, Share2 } from 'lucide-react';

export interface EstadoCapasMapa {
  establecimientos: boolean;
  visitas: boolean;
  pacientes: boolean;
  referencias: boolean;
}

interface MapaCapasProps {
  capas: EstadoCapasMapa;
  onToggleCapa: (capa: keyof EstadoCapasMapa) => void;
  conteos: {
    establecimientos: number;
    visitas: number;
    pacientes: number;
    referencias: number;
  };
}

export const MapaCapas: React.FC<MapaCapasProps> = ({
  capas,
  onToggleCapa,
  conteos,
}) => {
  const [expandido, setExpandido] = useState(false);

  const opciones = [
    { id: 'establecimientos', label: 'Establecimientos de Salud', icono: Building2, color: 'text-blue-600', count: conteos.establecimientos },
    { id: 'visitas', label: 'Visitas Domiciliarias', icono: Home, color: 'text-[#166E7A]', count: conteos.visitas },
    { id: 'pacientes', label: 'Padrón de Pacientes', icono: User, color: 'text-indigo-600', count: conteos.pacientes },
    { id: 'referencias', label: 'Referencias Activas (F-01)', icono: Share2, color: 'text-amber-600', count: conteos.referencias },
  ] as const;

  return (
    <div className="absolute top-4 right-4 z-1000 w-56 sm:w-64 shadow-lg">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setExpandido(!expandido)}
          className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-black text-slate-800 hover:bg-slate-50 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#166E7A]" />
            <span>Capas del Territorio</span>
          </div>
          {expandido ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {expandido && (
          <div className="p-2 space-y-1 border-t border-slate-100 animate-in fade-in duration-100">
            {opciones.map((op) => {
              const activa = capas[op.id];
              const Icono = op.icono;

              return (
                <div
                  key={op.id}
                  onClick={() => onToggleCapa(op.id)}
                  className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition text-xs ${activa ? 'bg-teal-50/80 font-bold text-[#166E7A]' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icono className={`w-3.5 h-3.5 shrink-0 ${op.color}`} />
                    <span className="truncate">{op.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {op.count}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${activa ? 'bg-[#166E7A] border-[#166E7A] text-white' : 'border-slate-300 bg-white'
                        }`}
                    >
                      {activa && <Check className="w-3 h-3 stroke-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};