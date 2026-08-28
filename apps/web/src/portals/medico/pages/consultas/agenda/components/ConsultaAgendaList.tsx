// apps/web/src/portals/medico/pages/consultas/agenda/components/ConsultaAgendaList.tsx
import React from 'react';
import { ConsultaAgendaCard } from './ConsultaAgendaCard';
import type { AgendaItem } from './ConsultaAgendaCard';
import { Inbox, RotateCcw } from 'lucide-react';

interface ConsultaAgendaListProps {
    items: AgendaItem[];
    onViewDetails: (item: AgendaItem) => void;
    onResetFilters: () => void;
    hasActiveFilters: boolean;
}

export const ConsultaAgendaList: React.FC<ConsultaAgendaListProps> = ({
    items,
    onViewDetails,
    onResetFilters,
    hasActiveFilters,
}) => {
    if (items.length === 0) {
        return (
            <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-3xl p-8">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 text-[#2B7A78] flex items-center justify-center mb-3 border border-teal-100">
                    <Inbox className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">No hay atenciones programadas</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-6">
                    No se registran pacientes asignados para este filtro o fecha seleccionada. El sistema actualizará los turnos automáticamente.
                </p>
                {hasActiveFilters && (
                    <button
                        onClick={onResetFilters}
                        className="inline-flex items-center gap-2 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs"
                    >
                        <RotateCcw className="w-4 h-4" /> Restablecer filtros y búsqueda
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <ConsultaAgendaCard
                    key={item.id}
                    item={item}
                    onViewDetails={onViewDetails}
                />
            ))}
        </div>
    );
};