// =========================================================================
// ARCHIVO: apps/web/src/modules/health-education/data/categories.ts
// DESCRIPCIÓN: Catálogo maestro de categorías oficiales de salud de MedicOS.
// =========================================================================

import type { CategoryOption } from '../types/health-education.types.js';

export const HEALTH_CATEGORIES: CategoryOption[] = [
  {
    id: 'ALL',
    label: 'Todos',
    iconName: 'LayoutGrid',
    description: 'Catálogo completo de temas de salud validados',
  },
  {
    id: 'PREVENCION',
    label: 'Prevención',
    iconName: 'ShieldCheck',
    description: 'Enfermedades transmitidas por vectores y control higiénico',
  },
  {
    id: 'VACUNACION',
    label: 'Vacunación',
    iconName: 'Syringe',
    description: 'Esquema nacional de inmunización y biológicos',
  },
  {
    id: 'SALUD_MATERNA',
    label: 'Salud Materna',
    iconName: 'Baby',
    description: 'Control prenatal, puerperio y lactancia materna',
  },
  {
    id: 'SALUD_SEXUAL_REPRODUCTIVA',
    label: 'Sexual y Reproductiva',
    iconName: 'HeartHandshake',
    description: 'Planificación familiar, prevención y autocuidado',
  },
  {
    id: 'NUTRICION',
    label: 'Alimentación y Nutrición',
    iconName: 'Apple',
    description: 'Alimentación saludable, balance calórico e hidratación',
  },
  {
    id: 'SALUD_MENTAL',
    label: 'Salud Mental y Bienestar',
    iconName: 'Brain',
    description: 'Higiene del sueño, manejo de estrés y pausas activas',
  },
  {
    id: 'SALUD_FAMILIAR',
    label: 'Salud Familiar',
    iconName: 'Home',
    description: 'Botiquín seguro, higiene doméstica y cuidado de menores',
  },
];