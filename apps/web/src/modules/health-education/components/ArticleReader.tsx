// =========================================================================
// ARCHIVO: apps/web/src/modules/health-education/components/ArticleReader.tsx
// DESCRIPCIÓN: Lector editorial clínico con diseño estilo Apple Health.
//              Tipografía limpia, tarjetas de conceptos y soporte offline.
// =========================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Clock,
  Bookmark,
  ArrowRight,
  Syringe,
  Activity,
  Heart,
  Baby,
  ClipboardList,
  Sparkles,
  Share2,
  Check,
  Building2,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { HealthArticle } from '../types/health-education.types.js';
import { ArticleChecklist } from './ArticleChecklist.js';
import { ArticleQuiz } from './ArticleQuiz.js';
import { ArticleSources } from './ArticleSources.js';

interface ArticleReaderProps {
  article: HealthArticle | null;
  onClose: () => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  isSaved: boolean;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  article,
  onClose,
  onToggleSave,
  isSaved,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [failedImageId, setFailedImageId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getActionIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Vaccine':
        return <Syringe className="w-5 h-5 text-sky-600" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-emerald-600" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-600" />;
      case 'Baby':
        return <Baby className="w-5 h-5 text-indigo-600" />;
      case 'Clipboard':
      default:
        return <ClipboardList className="w-5 h-5 text-teal-600" />;
    }
  };

  // Parsea títulos estructurados (ej. "EL CONSENTIMIENTO:", "MITO 1:") al estilo de tarjetas iOS Health
  const parsedParagraphs = useMemo(() => {
    if (!article) return [];

    return article.paragraphs.map((para, index) => {
      const match = para.match(/^([A-ZÁÉÍÓÚÑ0-9\s—]+:)(.*)$/);
      if (match) {
        return {
          id: index,
          isHighlight: true,
          label: match[1].replace(':', '').trim(),
          text: match[2].trim(),
        };
      }
      return {
        id: index,
        isHighlight: false,
        label: null,
        text: para,
      };
    });
  }, [article]);

  if (!article) return null;

  const imageError = failedImageId === article.id;
  const localImagePath = article.coverImage || `/images/articulos/${article.id}.jpg`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 overflow-hidden animate-in fade-in duration-200 select-none">
      <div className="bg-[#FCFCFD] sm:rounded-3xl border-0 sm:border border-slate-200/80 max-w-3xl w-full h-full sm:h-auto sm:max-h-[92vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 flex flex-col relative scroll-smooth">
        
        {/* Barra superior estilo Apple iOS modal */}
        <div className="sticky top-0 z-30 bg-[#FCFCFD]/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-2.5 flex flex-col justify-center">
          <div className="w-10 h-1 rounded-full bg-slate-300/80 mx-auto mb-2 sm:block hidden" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 truncate pr-4">
              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {article.categoryLabel}
              </span>
              <span className="text-xs font-extrabold text-slate-800 truncate hidden sm:inline">
                {article.title}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Copiar enlace"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={(e) => onToggleSave(article.id, e)}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  isSaved
                    ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                    : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-50'
                }`}
                title={isSaved ? 'Guardado en mis favoritos' : 'Guardar artículo'}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Portada Hero Apple Health */}
        <div className="p-4 sm:p-6 pb-0">
          <div className="relative w-full h-52 sm:h-72 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-xs">
            {!imageError ? (
              <img
                src={localImagePath}
                alt={article.title}
                onError={() => setFailedImageId(article.id)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-slate-900 via-teal-950 to-slate-900 flex flex-col items-center justify-center text-teal-100/60 p-6 text-center">
                <BookOpen className="w-12 h-12 mb-2 text-teal-400/80 stroke-1" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Biblioteca Oficial MedicOS
                </span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-300">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  {article.readingTimeMinutes} min de lectura
                </span>
                <span>•</span>
                <span>Revisión clínica {article.reviewedYear}</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                {article.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Cuerpo Editorial del Artículo */}
        <div className="p-4 sm:p-6 space-y-6">

          {/* Tarjeta Resumen Ejecutivo Estilo Apple Highlights */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Enfoque de Salud
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {article.summary}
            </p>
          </div>

          {/* Párrafos y Cajas de Conceptos */}
          <div className="space-y-4 text-slate-700">
            {parsedParagraphs.map((item) => {
              if (item.isHighlight) {
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-slate-50/90 border border-slate-200/70 p-4 sm:p-5 space-y-1.5 transition hover:bg-slate-100/70"
                  >
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-50 border border-teal-200/80 text-teal-900 text-[11px] font-extrabold tracking-wide uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      {item.label}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed pt-1">
                      {item.text}
                    </p>
                  </div>
                );
              }

              return (
                <p
                  key={item.id}
                  className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed text-justify"
                >
                  {item.text}
                </p>
              );
            })}
          </div>

          {/* Puntos Clave de Salud */}
          {article.keyPoints && article.keyPoints.length > 0 && (
            <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 font-black text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Recomendaciones Clave
                </h3>
              </div>

              <div className="space-y-2.5">
                {article.keyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actividades Interactivas (Checklist o Quiz) */}
          {article.checklist && article.checklist.length > 0 && (
            <div className="pt-1">
              <ArticleChecklist items={article.checklist} />
            </div>
          )}

          {article.quiz && (
            <div className="pt-1">
              <ArticleQuiz quiz={article.quiz} />
            </div>
          )}

          {/* Acción Integrada de MedicOS (Estilo Tarjeta de Control Apple Watch) */}
          {article.medicosAction && (
            <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 shadow-2xs">
                  {getActionIcon(article.medicosAction.iconName)}
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                    Función Relacionada
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {article.medicosAction.label}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {article.medicosAction.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(article.medicosAction!.route);
                }}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
              >
                <span>Acceder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Fuentes Sanitarias Oficiales */}
          <ArticleSources
            sources={article.sources}
            reviewedYear={article.reviewedYear}
            reviewedBy={article.reviewedBy}
          />
        </div>

        {/* Pie de Cierre */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-slate-200/60 px-6 py-3 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <Building2 className="w-3.5 h-3.5 text-teal-700" />
            <span>Red Nacional de Salud • MedicOS</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            Finalizar lectura
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleReader;