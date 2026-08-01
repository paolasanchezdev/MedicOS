// =========================================================================
// ARCHIVO: apps/web/src/modules/landing/data/landingData.ts
// DESCRIPCIÓN: Fuente única de datos estáticos para la Landing Page de MedicOS.
//              Contexto correcto: Sistema para Brigadas Médicas Comunitarias.
//              Sin estadísticas no verificadas. IA = datos manuales del brigadista.
// =========================================================================

import {
  WifiOff,
  FileX,
  ClipboardList,
  Database,
  HeartPulse,
  Brain,
  Wifi,
  Cpu,
  Server,
  HardDrive,
  Users,
  MapPin,
  Stethoscope,
  CheckCircle2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface ProblemItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface SolutionFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string;
  badgeColor: 'teal' | 'cyan' | 'soft';
}

export interface WorkflowStep {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
  detail: string;
}

export interface TechCard {
  name: string;
  role: string;
  icon: LucideIcon;
  accent: 'teal' | 'cyan' | 'soft';
  tags: string[];
}

export interface ImpactStatement {
  icon: LucideIcon;
  title: string;
  description: string;
}

// ─── Datos: Sección Problema ──────────────────────────────────────────────────

export const problemData: ProblemItem[] = [
  {
    icon: WifiOff,
    title: 'Conectividad nula o intermitente',
    description:
      'Las brigadas médicas operan en comunidades rurales sin acceso a internet estable. Los sistemas convencionales de gestión médica son inoperables en estas condiciones.',
  },
  {
    icon: FileX,
    title: 'Registros en papel, frágiles e incompletos',
    description:
      'Los expedientes físicos se deterioran, se pierden o quedan incompletos. No existe historial clínico continuo entre una brigada y la siguiente visita.',
  },
  {
    icon: ClipboardList,
    title: 'Carga administrativa excesiva',
    description:
      'El tiempo del brigadista se consume en papeleo manual. Cada minuto de burocracia es un minuto menos de atención directa al paciente.',
  },
];

// ─── Datos: Sección Solución ──────────────────────────────────────────────────

export const solutionData: SolutionFeature[] = [
  {
    icon: Database,
    title: 'Registro digital ágil',
    description:
      'Captura datos clínicos de forma rápida e intuitiva, directamente desde la interfaz de MedicOS. No se requiere conexión a internet.',
    badge: 'Offline First',
    badgeColor: 'teal',
  },
  {
    icon: HeartPulse,
    title: 'Expediente clínico digital',
    description:
      'Historial médico completo y persistente por paciente. Cada consulta queda registrada y disponible en la siguiente visita de la brigada.',
    badge: 'Persistencia local',
    badgeColor: 'cyan',
  },
  {
    icon: Brain,
    title: 'IA asistencial',
    description:
      'El brigadista introduce los datos del paciente manualmente. MedicOS los analiza y genera recomendaciones clínicas de apoyo a la decisión médica.',
    badge: 'Datos manuales',
    badgeColor: 'soft',
  },
  {
    icon: Wifi,
    title: 'Sincronización inteligente',
    description:
      'Cuando MedicOS Station detecta conectividad, sincroniza automáticamente los expedientes con el servidor central. Sin interrumpir el flujo de trabajo.',
    badge: 'Sync automático',
    badgeColor: 'teal',
  },
];

// ─── Datos: Cómo Funciona ─────────────────────────────────────────────────────

export const workflowSteps: WorkflowStep[] = [
  {
    step: 1,
    icon: Users,
    title: 'El brigadista llega a la comunidad',
    description: 'Con una MedicOS Station portátil (Raspberry Pi 4) lista para operar sin internet.',
    detail: 'Hardware local · Sin dependencia de la nube',
  },
  {
    step: 2,
    icon: Stethoscope,
    title: 'Consulta médica',
    description: 'El brigadista atiende al paciente e ingresa todos los datos clínicos manualmente en MedicOS.',
    detail: 'Interfaz ágil · Formularios inteligentes',
  },
  {
    step: 3,
    icon: Database,
    title: 'Registro clínico local',
    description: 'Los datos se almacenan de forma segura en la MedicOS Station. El expediente queda disponible de inmediato.',
    detail: 'SQLite local · Cifrado en reposo',
  },
  {
    step: 4,
    icon: Brain,
    title: 'IA asistencial actúa',
    description: 'MedicOS analiza los datos ingresados y genera recomendaciones de apoyo. El médico toma la decisión final.',
    detail: 'Modelo IA · Análisis clínico',
  },
  {
    step: 5,
    icon: Wifi,
    title: 'Sincronización al detectar red',
    description: 'Al regresar a zona con conectividad, la estación sincroniza automáticamente todos los expedientes con el servidor.',
    detail: 'Node.js API · PostgreSQL central',
  },
];

// ─── Datos: Stack Tecnológico ─────────────────────────────────────────────────

export const techStackData: TechCard[] = [
  {
    name: 'MedicOS Station',
    role: 'Hardware local de campo',
    icon: Cpu,
    accent: 'teal',
    tags: ['Raspberry Pi 4', 'ARM64', 'Portátil'],
  },
  {
    name: 'Node.js + Express',
    role: 'Backend API REST',
    icon: Server,
    accent: 'cyan',
    tags: ['REST API', 'JWT Auth', 'Sync Engine'],
  },
  {
    name: 'PostgreSQL',
    role: 'Base de datos central',
    icon: HardDrive,
    accent: 'soft',
    tags: ['Relacional', 'Expedientes', 'Auditoría'],
  },
  {
    name: 'Modelo IA',
    role: 'Análisis clínico asistencial',
    icon: Brain,
    accent: 'teal',
    tags: ['Datos manuales', 'Recomendaciones', 'Apoyo médico'],
  },
];

// ─── Datos: Impacto ───────────────────────────────────────────────────────────

export const impactStatements: ImpactStatement[] = [
  {
    icon: MapPin,
    title: 'Comunidades rurales conectadas',
    description:
      'MedicOS lleva el poder de los expedientes clínicos digitales a los rincones más apartados, sin depender de internet.',
  },
  {
    icon: HeartPulse,
    title: 'Continuidad en la atención',
    description:
      'Cada brigadista que llega a una comunidad puede ver el historial completo del paciente desde la brigada anterior.',
  },
  {
    icon: Brain,
    title: 'Decisiones médicas informadas',
    description:
      'La IA asistencial apoya al brigadista con recomendaciones basadas en los datos que él mismo ingresa, sin reemplazar su criterio.',
  },
  {
    icon: CheckCircle2,
    title: 'Cero papel, cero pérdidas',
    description:
      'Los expedientes digitales son duraderos, buscables y están siempre disponibles, incluso sin internet.',
  },
];
