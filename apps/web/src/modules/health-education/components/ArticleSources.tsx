// =========================================================================
// ARCHIVO: apps/web/src/modules/health-education/components/ArticleSources.tsx
// DESCRIPCIÓN: Listado oficial de fuentes sanitarias (MINSAL, OMS, OPS).
// =========================================================================

import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import type { ArticleSource } from '../types/health-education.types.js';

interface ArticleSourcesProps {
  sources: ArticleSource[];
  reviewedYear: number;
  reviewedBy: string;
}

export const ArticleSources: React.FC<ArticleSourcesProps> = ({
  sources,
  reviewedYear,
  reviewedBy,
}) => {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-3 select-none">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-teal-700" />
        <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
          Fuentes Oficiales y Revisión Técnica
        </h4>
      </div>

      <div className="text-xs text-slate-600 space-y-1">
        <p>
          <strong className="text-slate-800">Última revisión:</strong> {reviewedYear} ({reviewedBy})
        </p>
        <p className="text-[11px] text-slate-500">
          Contenido curado conforme a los protocolos sanitarios institucionales de referencia.
        </p>
      </div>

      <div className="pt-2 border-t border-slate-200/60 space-y-2">
        {sources.map((src) => (
          <div
            key={src.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 text-xs"
          >
            <div>
              <p className="font-bold text-slate-800">{src.name}</p>
              <p className="text-[10.5px] text-slate-500">{src.institution} • {src.year}</p>
            </div>
            {src.url ? (
              <a
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:underline"
              >
                <span>Consultar</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-[10.5px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                Oficial MINSAL
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleSources;