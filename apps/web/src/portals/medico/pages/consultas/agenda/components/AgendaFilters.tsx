// apps/web/src/portals/medico/pages/consultas/agenda/components/AgendaFilters.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface AgendaFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedOrigin?: string;
    onOriginChange?: (origin: string) => void;
    selectedStatus: string;
    onStatusChange: (status: string) => void;
    selectedDate: string;
    onDateChange: (date: string) => void;
}

export const AgendaFilters: React.FC<AgendaFiltersProps> = ({
    searchTerm,
    onSearchChange,
    selectedOrigin = 'ALL',
    onOriginChange,
    selectedStatus,
    onStatusChange,
    selectedDate,
    onDateChange,
}) => {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
            {/* Controles superiores: Fecha, Búsqueda y Estado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Selector de Fecha */}
                <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-700 shrink-0">Fecha operativa:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#2B7A78]"
                    />
                </div>

                {/* Búsqueda */}
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Buscar paciente en agenda..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#2B7A78]"
                    />
                </div>

                {/* Filtro de Estado */}
                <div className="flex items-center gap-2 justify-end">
                    <label className="text-xs font-bold text-slate-700 shrink-0">Estado:</label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#2B7A78]"
                    >
                        <option value="ALL">Todas las atenciones</option>
                        <option value="PENDING">Pendientes</option>
                        <option value="WAITING">En espera</option>
                        <option value="IN_PROGRESS">En atención</option>
                        <option value="COMPLETED">Completadas</option>
                    </select>
                </div>
            </div>

            {/* Pestañas de Filtro por Origen (Citas vs Triage/Brigada) */}
            {onOriginChange && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
                    <span className="text-xs font-bold text-slate-500 mr-2">Origen:</span>
                    <button
                        onClick={() => onOriginChange('ALL')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedOrigin === 'ALL'
                                ? 'bg-[#2B7A78] text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => onOriginChange('CITA')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedOrigin === 'CITA'
                                ? 'bg-[#2B7A78] text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        Citas programadas
                    </button>
                    <button
                        onClick={() => onOriginChange('BRIGADA')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedOrigin === 'BRIGADA'
                                ? 'bg-[#2B7A78] text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        Pacientes de brigada / triage
                    </button>
                </div>
            )}
        </div>
    );
};