// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/notificaciones/centro/components/NotificacionCard.tsx
// DESCRIPCIÓN: Tarjeta individual con iconos semánticos y enlace directo
//              al recurso específico del expediente.
// =========================================================================

import React from 'react';
import {
  Calendar,
  Stethoscope,
  TestTube2,
  Pill,
  Baby,
  ShieldCheck,
  FileText,
  Building,
  MessageSquare,
  Bell,
  ArrowRight,
  Check,
} from 'lucide-react';

export interface NotificationCardData {
  id: string;
  type: string;
  category: string;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
  priority: 'INFO' | 'SUCCESS' | 'REMINDER' | 'WARNING' | 'IMPORTANT';
  linkUrl: string;
  actionText: string;
  timeAgo?: string;
}

interface NotificacionCardProps {
  item: NotificationCardData;
  onActionClick: (item: NotificationCardData) => void;
  onMarkAsRead: (id: string, e: React.MouseEvent) => void;
}

export const NotificacionCard: React.FC<NotificacionCardProps> = ({
  item,
  onActionClick,
  onMarkAsRead,
}) => {
  const renderIcon = (category: string) => {
    switch (category) {
      case 'citas':
        return <Calendar className="w-4 h-4 text-[#1c5752]" />;
      case 'atencion':
        return <Stethoscope className="w-4 h-4 text-teal-700" />;
      case 'resultados':
        return <TestTube2 className="w-4 h-4 text-indigo-700" />;
      case 'medicamentos':
        return <Pill className="w-4 h-4 text-emerald-700" />;
      case 'salud_materna':
        return <Baby className="w-4 h-4 text-pink-700" />;
      case 'vacunacion':
        return <ShieldCheck className="w-4 h-4 text-emerald-700" />;
      case 'documentos':
        return <FileText className="w-4 h-4 text-slate-700" />;
      case 'brigadas':
        return <Building className="w-4 h-4 text-cyan-700" />;
      case 'mensajes':
        return <MessageSquare className="w-4 h-4 text-amber-700" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div
      onClick={() => onActionClick(item)}
      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-xs ${
        !item.isRead
          ? 'bg-white border-teal-300/80 hover:border-[#1c5752]'
          : 'bg-white/80 border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 shrink-0 mt-0.5">
          {renderIcon(item.category)}
        </div>
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <h4
              className={`text-xs tracking-tight truncate ${
                !item.isRead ? 'font-black text-slate-900' : 'font-bold text-slate-700'
              }`}
            >
              {item.title}
            </h4>
            {!item.isRead && (
              <span className="w-2 h-2 rounded-full bg-[#1c5752] shrink-0" />
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <span className="text-[10.5px] font-mono text-slate-400">
          {item.timeAgo || 'Reciente'}
        </span>

        <div className="flex items-center gap-1.5">
          {!item.isRead && (
            <button
              type="button"
              onClick={(e) => onMarkAsRead(item.id, e)}
              title="Marcar como leída"
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#1c5752] hover:bg-teal-50 transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-[#1c5752] border border-slate-200 text-xs font-bold transition">
            <span>{item.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#1c5752]" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotificacionCard;