// apps/web/src/portals/medico/pages/consultas/agenda/components/AgendaSummary.tsx
import React from 'react';
import { CalendarDays, Clock, Stethoscope, CheckCircle2 } from 'lucide-react';

interface AgendaSummaryProps {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
}

export const AgendaSummary: React.FC<AgendaSummaryProps> = ({
    total,
    pending,
    inProgress,
    completed,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Consultas */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Total Consultas
                    </p>
                    <h3 className="text-2xl font-extrabold text-slate-900">{total}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#2B7A78] flex items-center justify-center shrink-0 border border-teal-100">
                    <CalendarDays className="w-5 h-5" />
                </div>
            </div>

            {/* Pendientes */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1">
                        Pendientes
                    </p>
                    <h3 className="text-2xl font-extrabold text-slate-900">{pending}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                    <Clock className="w-5 h-5" />
                </div>
            </div>

            {/* En Atención */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold text-teal-700 uppercase tracking-wider mb-1">
                        En Atención
                    </p>
                    <h3 className="text-2xl font-extrabold text-slate-900">{inProgress}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#2B7A78] flex items-center justify-center shrink-0 border border-teal-100">
                    <Stethoscope className="w-5 h-5" />
                </div>
            </div>

            {/* Completadas */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
                        Completadas
                    </p>
                    <h3 className="text-2xl font-extrabold text-slate-900">{completed}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
};