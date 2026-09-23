// =========================================================================
// ARCHIVO: apps/api/src/modules/clinical-knowledge/index.ts
// DESCRIPCIÓN: Exportación central del Módulo de Conocimiento Clínico.
// =========================================================================

export * from './clinical-knowledge.types.js';
export * from './clinical-graph.builder.js';
export * from './clinical-knowledge.service.js';
export * from './clinical-knowledge.controller.js';
export { default as clinicalKnowledgeRoutes } from './clinical-knowledge.routes.js';