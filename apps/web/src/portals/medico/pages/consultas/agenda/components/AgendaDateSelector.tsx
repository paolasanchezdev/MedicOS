// apps/web/src/portals/medico/pages/consultas/agenda/components/AgendaDateSelector.tsx
import React from 'react';

interface AgendaDateSelectorProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
}

export const AgendaDateSelector: React.FC<AgendaDateSelectorProps> = ({
    selectedDate,
    onDateChange,
}) => {
    return (
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-sm font-medium text-slate-600">Fecha operativa:</span>
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
        </div>
    );
};