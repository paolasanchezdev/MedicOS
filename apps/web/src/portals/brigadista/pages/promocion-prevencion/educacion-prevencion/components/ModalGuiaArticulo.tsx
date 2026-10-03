// =========================================================================
// ARCHIVO: ModalGuiaArticulo.tsx
// DESCRIPCIÓN: Consulta de puntos clave y guía didáctica oficial de un artículo.
// =========================================================================

import React from 'react';
import { X, BookOpen, CheckCircle } from 'lucide-react';
import type { ArticuloGuiaRef } from '../../../../../../modules/health-education/types/health-education.types';

interface ModalGuiaArticuloProps {
  isOpen: boolean;
  onClose: () => void;
  articulo: ArticuloGuiaRef | null;
}

export const ModalGuiaArticulo: React.FC<ModalGuiaArticuloProps> = ({
  isOpen,
  onClose,
  articulo,
}) => {
  if (!isOpen || !articulo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#166E7A]" />
            <div>
              <span className="px-1.5 py-0.2 rounded text-[9.5px] font-extrabold bg-teal-50 text-[#166E7A] border border-teal-200">
                {articulo.categoryLabel}
              </span>
              <h3 className="text-xs font-black text-slate-900 mt-0.5">
                {articulo.title}
              </h3>
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

        <div className="p-5 space-y-3.5 overflow-y-auto">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
            {articulo.summary}
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#166E7A]">
              Puntos Clave Orientados en la Actividad:
            </h4>
            <div className="space-y-1.5">
              {articulo.keyPoints.map((kp, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{kp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
          >
            Cerrar Guía
          </button>
        </div>
      </div>
    </div>
  );
};