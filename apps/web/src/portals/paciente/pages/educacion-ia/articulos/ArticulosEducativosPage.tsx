// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/educacion-ia/articulos/ArticulosEducativosPage.tsx
// DESCRIPCIÓN: Página principal conectada con el catálogo de 28 artículos y el lector modal.
// =========================================================================

import React, { useState, useMemo } from 'react';
import type {
  HealthArticle,
  HealthArticleCategory,
} from '../../../../../modules/health-education/types/health-education.types.js';
import { ALL_HEALTH_ARTICLES } from '../../../../../modules/health-education/data/articles.js';
import { ArticleReader } from '../../../../../modules/health-education/components/ArticleReader.js';
import {
  ArticulosHeader,
  ArticulosSearch,
  ArticulosCategorias,
  ArticuloCard,
  ArticuloDestacadoCard,
} from './components/index.js';
import { BookX } from 'lucide-react';

export const ArticulosEducativosPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | HealthArticleCategory>('ALL');
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('medicos_saved_articles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showingSavedOnly, setShowingSavedOnly] = useState(false);
  const [readingArticle, setReadingArticle] = useState<HealthArticle | null>(null);

  const toggleSaveArticle = (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedArticleIds((prev) => {
      const next = prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId];
      try {
        localStorage.setItem('medicos_saved_articles', JSON.stringify(next));
      } catch {
        // Almacenamiento seguro
      }
      return next;
    });
  };

  const filteredArticles = useMemo(() => {
    return ALL_HEALTH_ARTICLES.filter((art) => {
      if (showingSavedOnly && !savedArticleIds.includes(art.id)) {
        return false;
      }
      if (activeCategory !== 'ALL' && art.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = art.title.toLowerCase().includes(q);
        const matchSummary = art.summary.toLowerCase().includes(q);
        const matchCategory = art.categoryLabel.toLowerCase().includes(q);
        const matchTag = art.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchCategory && !matchTag) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, activeCategory, savedArticleIds, showingSavedOnly]);

  const featuredArticle = useMemo(() => {
    if (showingSavedOnly || searchQuery.trim() !== '' || activeCategory !== 'ALL') {
      return null;
    }
    return ALL_HEALTH_ARTICLES.find((a) => a.isFeatured) || null;
  }, [showingSavedOnly, searchQuery, activeCategory]);

  const gridArticles = useMemo(() => {
    if (featuredArticle) {
      return filteredArticles.filter((a) => a.id !== featuredArticle.id);
    }
    return filteredArticles;
  }, [filteredArticles, featuredArticle]);

  return (
    <div className="w-full space-y-6 max-w-350 mx-auto select-none animate-in fade-in duration-200">
      {/* 1. Header Oficial */}
      <ArticulosHeader
        savedCount={savedArticleIds.length}
        onToggleSavedView={() => setShowingSavedOnly((prev) => !prev)}
        showingSavedOnly={showingSavedOnly}
      />

      {/* 2. Buscador y Filtros */}
      <div className="space-y-3">
        <ArticulosSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalResults={filteredArticles.length}
        />

        {!showingSavedOnly && (
          <ArticulosCategorias
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        )}
      </div>

      {/* 3. Contenido Principal */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <BookX className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-800">
            {showingSavedOnly ? 'No tienes artículos guardados' : 'No se encontraron artículos'}
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {showingSavedOnly
              ? 'Puedes marcar artículos con el icono de marcador para consultarlos cuando lo necesites.'
              : 'Intenta con otros términos como "dengue", "vacunas", "embarazo" o selecciona otra categoría.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tarjeta Destacada */}
          {featuredArticle && (
            <ArticuloDestacadoCard
              article={featuredArticle}
              onOpenArticle={(art) => setReadingArticle(art)}
              onToggleSave={toggleSaveArticle}
              isSaved={savedArticleIds.includes(featuredArticle.id)}
            />
          )}

          {/* Rejilla de Artículos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gridArticles.map((article) => (
              <ArticuloCard
                key={article.id}
                article={article}
                onOpenArticle={(art) => setReadingArticle(art)}
                onToggleSave={toggleSaveArticle}
                isSaved={savedArticleIds.includes(article.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. Modal Lector Panorámico */}
      <ArticleReader
        article={readingArticle}
        onClose={() => setReadingArticle(null)}
        onToggleSave={toggleSaveArticle}
        isSaved={readingArticle ? savedArticleIds.includes(readingArticle.id) : false}
      />
    </div>
  );
};

export default ArticulosEducativosPage;