// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/educacion-ia/articulos/components/ArticuloDestacadoCard.tsx
// DESCRIPCIÓN: Tarjeta destacada panorámica con imagen editorial e integración clínica.
// =========================================================================

import React from 'react';
import { Sparkles, Clock, ShieldCheck, ChevronRight, Bookmark } from 'lucide-react';
import type { HealthArticle } from '../../../../../../modules/health-education/types/health-education.types.js';

interface ArticuloDestacadoCardProps {
  article: HealthArticle;
  onOpenArticle: (article: HealthArticle) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  isSaved: boolean;
}

export const ArticuloDestacadoCard: React.FC<ArticuloDestacadoCardProps> = ({
  article,
  onOpenArticle,
  onToggleSave,
  isSaved,
}) => {
  return (
    <div
      onClick={() => onOpenArticle(article)}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col md:flex-row cursor-pointer select-none"
    >
      {/* Imagen Destacada */}
      <div className="relative md:w-5/12 h-48 md:h-auto overflow-hidden bg-slate-900 shrink-0">
        <img
          src={
            article.coverImage ||
            'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1000&q=80'
          }
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent md:hidden" />

        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700 text-white text-[11px] font-extrabold tracking-wide uppercase shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            Lectura Destacada
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
              {article.categoryLabel}
            </span>

            <button
              type="button"
              onClick={(e) => onToggleSave(article.id, e)}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isSaved
                  ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={isSaved ? 'Guardado en favoritos' : 'Guardar artículo'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>

          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              <span>{article.readingTimeMinutes} minutos de lectura</span>
            </p>

            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-1 group-hover:text-teal-800 transition-colors">
              {article.title}
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium line-clamp-3">
              {article.summary}
            </p>
          </div>
        </div>

        {/* Pie */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Revisión técnica {article.reviewedYear}</span>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-teal-700 group-hover:text-teal-800 transition-colors">
            <span>Leer guía completa</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArticuloDestacadoCard;