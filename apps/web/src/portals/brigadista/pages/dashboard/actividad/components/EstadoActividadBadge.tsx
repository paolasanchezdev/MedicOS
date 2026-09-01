// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/actividad/components/EstadoActividadBadge.tsx
// DESCRIPCIÓN: Badges estandarizados para tipos y estados de actividad de campo.
// =========================================================================

import React from 'react';
import {
  Home,
  HeartPulse,
  BookOpen,
  UserCheck,
  Send,
  Users,
  CheckCircle2,
  Clock,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import type {
  TipoActividadOperativa,
  EstadoActividadOperativa,
} from '../../../../../../modules/brigades';

interface TipoBadgeProps {
  tipo: TipoActividadOperativa;
  size?: 'sm' | 'md';
}

interface EstadoBadgeProps {
  estado: EstadoActividadOperativa;
  size?: 'sm' | 'md';
}

export const TipoActividadBadge: React.FC<TipoBadgeProps> = ({ tipo, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  switch (tipo) {
    case 'VISITA_DOMICILIARIA':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 ${sizeClasses}`}>
          <Home className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Visita Domiciliaria</span>
        </span>
      );
    case 'EVALUACION_SIGNOS':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-lg bg-teal-50 text-[#1B5250] border border-teal-200/60 ${sizeClasses}`}>
          <HeartPulse className="w-3.5 h-3.5 text-[#2B7A78] shrink-0" />
          <span>Evaluación de Signos</span>
        </span>
      );
    case 'EDUCACION_COMUNITARIA':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-lg bg-purple-50 text-purple-700 border border-purple-200/60 ${sizeClasses}`}>
          <BookOpen className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>Educación en Salud</span>
        </span>
      );
    case 'SEGUIMIENTO':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200/60 ${sizeClasses}`}>
          <UserCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Seguimiento Territorial</span>
        </span>
      );
    case 'REFERENCIA':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200/60 ${sizeClasses}`}>
          <Send className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Referencia Médica</span>
        </span>
      );
    case 'ACTIVIDAD_COMUNITARIA':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-lg bg-slate-50 text-slate-700 border border-slate-200/80 ${sizeClasses}`}>
          <Users className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span>Actividad Comunitaria</span>
        </span>
      );
  }
};

export const EstadoActividadBadge: React.FC<EstadoBadgeProps> = ({ estado, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  switch (estado) {
    case 'COMPLETADA':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Completada</span>
        </span>
      );
    case 'EN_CURSO':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-teal-50 text-[#1B5250] border border-teal-300 shadow-2xs ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#2B7A78] animate-pulse" />
          <span>En Curso</span>
        </span>
      );
    case 'PENDIENTE':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Pendiente</span>
        </span>
      );
    case 'PENDIENTE_SYNC':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200/70 ${sizeClasses}`}>
          <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0" />
          <span>Pendiente Sync</span>
        </span>
      );
    case 'CANCELADA':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200/70 ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Cancelada</span>
        </span>
      );
  }
};