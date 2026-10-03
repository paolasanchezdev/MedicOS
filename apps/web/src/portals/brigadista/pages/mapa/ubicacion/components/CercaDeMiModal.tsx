// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/mapa/ubicacion/components/CercaDeMiModal.tsx
// DESCRIPCIÓN: Modal de elementos cercanos ordenados por distancia esférica.
// =========================================================================

import React from 'react';
import { X, Navigation } from 'lucide-react';
import type { ElementoBusquedaMapa } from './MapaBusqueda';

interface CercaDeMiModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementos: ElementoBusquedaMapa[];
  onSeleccionar: (el: ElementoBusquedaMapa) => void;
}

export const CercaDeMiModal: React.FC<CercaDeMiModalProps> = ({
  isOpen,
  onClose,
  elementos,
  onSeleccionar,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1200 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-[#166E7A] border border-teal-200">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                Cerca de tu Ubicación
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Elementos territoriales ordenados por distancia radial
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 overflow-y-auto divide-y divide-slate-100 flex-1 text-xs">
          {elementos.length === 0 ? (
            <div className="p-6 text-center text-slate-400">
              No se detectaron elementos activos con coordenadas conocidas en las cercanías.
            </div>
          ) : (
            elementos.map((el) => (
              <div
                key={`${el.tipo}-${el.id}`}
                onClick={() => {
                  onSeleccionar(el);
                  onClose();
                }}
                className="p-2.5 hover:bg-teal-50/70 transition cursor-pointer flex items-center justify-between gap-2 rounded-xl"
              >
                <div className="min-w-0 space-y-0.5">
                  <span className="text-[9.5px] font-bold text-[#166E7A] uppercase block">
                    {el.tipo}
                  </span>
                  <p className="font-extrabold text-slate-900 truncate text-xs">{el.titulo}</p>
                  <p className="text-[10.5px] text-slate-500 truncate">{el.subtitulo}</p>
                </div>

                {el.distanciaKm !== undefined && (
                  <span className="text-[10.5px] font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg shrink-0">
                    {el.distanciaKm} km
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};