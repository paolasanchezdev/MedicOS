// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/educacion-ia/articulos/components/ArticulosCategorias.tsx
// DESCRIPCIÓN: Pestañas de filtrado estilo iOS Health por categoría oficial.
// =========================================================================

import React from 'react';
import { HEALTH_CATEGORIES } from '../../../../../../modules/health-education/data/categories.js';
import type { HealthArticleCategory } from '../../../../../../modules/health-education/types/health-education.types.js';

interface ArticulosCategoriasProps {
  activeCategory: 'ALL' | HealthArticleCategory;
  onSelectCategory: (cat: 'ALL' | HealthArticleCategory) => void;
}

export const ArticulosCategorias: React.FC<ArticulosCategoriasProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1 select-none">
      {HEALTH_CATEGORIES.map((cat) => {
        const isSelected = activeCategory === cat.id;

        return (
          <button
            type="button"
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
              isSelected
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};

export default ArticulosCategorias;