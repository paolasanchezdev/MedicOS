// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/educacion-ia/articulos/components/ArticuloCard.tsx
// DESCRIPCIÓN: Tarjeta de artículo con soporte de imagen local y fallback limpio.
// =========================================================================

import React, { useState } from 'react';
import { Clock, ShieldCheck, Bookmark, ChevronRight, BookOpen } from 'lucide-react';
import type { HealthArticle } from '../../../../../../modules/health-education/types/health-education.types.js';

interface ArticuloCardProps {
  article: HealthArticle;
  onOpenArticle: (article: HealthArticle) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  isSaved: boolean;
}

export const ArticuloCard: React.FC<ArticuloCardProps> = ({
  article,
  onOpenArticle,
  onToggleSave,
  isSaved,
}) => {
  const [imageError, setImageError] = useState(false);
  const localImagePath = article.coverImage || `/images/articulos/${article.id}.jpg`;

  return (
    <div
      onClick={() => onOpenArticle(article)}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between cursor-pointer select-none"
    >
      <div>
        {/* Contenedor de Imagen Local / Fallback */}
        <div className="relative h-40 w-full overflow-hidden bg-slate-100">
          {!imageError ? (
            <img
              src={localImagePath}
              alt={article.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-400">
              <BookOpen className="w-8 h-8 text-teal-400/60 stroke-1" />
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent" />

          {/* Badge de Categoría */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-white/95 backdrop-blur-md text-slate-800 shadow-2xs border border-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
              {article.categoryLabel}
            </span>
          </div>

          {/* Botón de Guardar */}
          <button
            type="button"
            onClick={(e) => onToggleSave(article.id, e)}
            className={`absolute top-3 right-3 p-1.5 rounded-xl backdrop-blur-md border transition cursor-pointer ${
              isSaved
                ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                : 'bg-white/90 text-slate-500 border-white/60 hover:bg-white hover:text-slate-800'
            }`}
            title={isSaved ? 'Guardado en favoritos' : 'Guardar artículo'}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {/* Textos y Metadatos */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <Clock className="w-3 h-3 text-teal-600" />
            <span>{article.readingTimeMinutes} min de lectura</span>
          </div>

          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight mt-1 leading-snug group-hover:text-teal-800 transition-colors line-clamp-2">
            {article.title}
          </h3>

          <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
            {article.summary}
          </p>
        </div>
      </div>

      {/* Pie de Tarjeta */}
      <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-700 shrink-0" />
          <span className="truncate">{article.sources[0]?.institution || 'MINSAL'} • {article.reviewedYear}</span>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 group-hover:text-teal-800 transition-colors shrink-0">
          <span>Leer</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
};

export default ArticuloCard;