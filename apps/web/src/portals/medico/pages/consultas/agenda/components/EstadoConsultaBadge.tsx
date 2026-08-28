// apps/web/src/portals/medico/pages/consultas/agenda/components/EstadoConsultaBadge.tsx
import React from 'react';

export type ConsultaStatus = 'PENDING' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
interface EstadoConsultaBadgeProps {
    status: ConsultaStatus;
}

export const EstadoConsultaBadge: React.FC<EstadoConsultaBadgeProps> = ({ status }) => {
    const config: Record<ConsultaStatus, { bg: string; text: string; label: string }> = {
        PENDING: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'Pendiente' },
        WAITING: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', label: 'En espera' },
        IN_PROGRESS: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'En atención' },
        COMPLETED: { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-700', label: 'Completada' },
        CANCELLED: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', label: 'Cancelada' },
    };

    const current = config[status] || config.PENDING;

    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${current.bg} ${current.text}`}>
            {current.label}
        </span>
    );
};