// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-knowledge/components/ClinicalGraphToolbar.tsx
// DESCRIPCIÓN: Barra de control para zoom y alternador Red/Árbol en modo claro.
// =========================================================================

import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, Network, GitFork, RotateCw } from 'lucide-react';
import type { GraphViewMode } from '../types/clinical-graph.types.js';

interface ClinicalGraphToolbarProps {
  viewMode: GraphViewMode;
  onViewModeChange: (mode: GraphViewMode) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const ClinicalGraphToolbar: React.FC<ClinicalGraphToolbarProps> = ({
  viewMode,
  onViewModeChange,
  onZoomIn,
  onZoomOut,
  onResetView,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="flex items-center gap-1.5 bg-white/95 border border-slate-200/90 p-1.5 rounded-2xl backdrop-blur-md select-none shadow-sm">
      
      {/* Selector Red vs Árbol */}
      <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 mr-1">
        <button
          type="button"
          onClick={() => onViewModeChange('network')}
          title="Vista de Red Relacional"
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
            viewMode === 'network'
              ? 'bg-[#1c5752] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Red</span>
        </button>

        <button
          type="button"
          onClick={() => onViewModeChange('tree')}
          title="Vista de Árbol Jerárquico"
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
            viewMode === 'tree'
              ? 'bg-[#1c5752] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GitFork className="w-3.5 h-3.5 rotate-180" />
          <span className="hidden sm:inline">Árbol</span>
        </button>
      </div>

      {/* Controles de Zoom (Visibles exclusivamente en Vista de Red) */}
      {viewMode === 'network' && (
        <>
          <button
            type="button"
            onClick={onZoomIn}
            title="Acercar"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onZoomOut}
            title="Alejar"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onResetView}
            title="Centrar mapa"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-slate-200 mx-0.5"></div>
        </>
      )}

      {/* Botón de recarga */}
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        title="Actualizar datos"
        className={`p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer ${
          isRefreshing ? 'animate-spin text-[#1c5752]' : ''
        }`}
      >
        <RotateCw className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ClinicalGraphToolbar;