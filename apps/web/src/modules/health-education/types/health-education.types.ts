// =========================================================================
// ARCHIVO: apps/web/src/modules/health-education/types/health-education.types.ts
// DESCRIPCIÓN: Tipos TypeScript con soporte para imágenes y metadatos editoriales.
// =========================================================================

export type HealthArticleCategory =
  | 'PREVENCION'
  | 'VACUNACION'
  | 'SALUD_MATERNA'
  | 'SALUD_SEXUAL_REPRODUCTIVA'
  | 'NUTRICION'
  | 'SALUD_MENTAL'
  | 'SALUD_FAMILIAR';

export interface ArticleSource {
  id: string;
  name: string;
  institution: string;
  url?: string;
  year: number;
}

export interface ArticleChecklistItem {
  id: string;
  label: string;
}

export interface ArticleQuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ArticleQuizData {
  question: string;
  options: ArticleQuizOption[];
}

export interface ArticleMedicOSAction {
  label: string;
  description: string;
  route: string;
  iconName: 'Vaccine' | 'Activity' | 'Heart' | 'Baby' | 'Clipboard';
}

export interface HealthArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: HealthArticleCategory;
  categoryLabel: string;
  readingTimeMinutes: number;
  reviewedYear: number;
  reviewedBy: string;
  isFeatured?: boolean;
  coverImage?: string;
  tags: string[];
  paragraphs: string[];
  keyPoints: string[];
  checklist?: ArticleChecklistItem[];
  quiz?: ArticleQuizData;
  medicosAction?: ArticleMedicOSAction;
  sources: ArticleSource[];
}

export interface CategoryOption {
  id: 'ALL' | HealthArticleCategory;
  label: string;
  iconName: string;
  description: string;
}