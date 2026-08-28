// apps/web/src/portals/medico/pages/consultas/agenda/components/ConsultaAgendaCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EstadoConsultaBadge } from './EstadoConsultaBadge';

export type ConsultaStatus = 'PENDING' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface AgendaItem {
    id: string;
    time: string;
    patientName: string;
    patientId: string;
    origin: 'CITA' | 'BRIGADA';
    status: ConsultaStatus;
    reason?: string;
    age?: number;
    phone?: string;
}

interface ConsultaAgendaCardProps {
    item: AgendaItem;
    onViewDetails: (item: AgendaItem) => void;
}

export const ConsultaAgendaCard: React.FC<ConsultaAgendaCardProps> = ({
    item,
    onViewDetails,
}) => {
    const navigate = useNavigate();

    const handleConsultationAction = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Redirige al módulo de nueva consulta pasando el ID de la cita o paciente
        navigate(`/medico/consultas/nueva?appointmentId=${item.id}&patientId=${item.patientId}`);
    };

    return (
        <div
            onClick={() => onViewDetails(item)}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-teal-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
        >
            <div className="flex items-start gap-4">
                <div className="bg-teal-50 text-[#1B5250] font-bold px-3.5 py-2.5 rounded-xl text-sm tracking-wide border border-teal-100">
                    {item.time}
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-lg">{item.patientName}</h3>
                        <EstadoConsultaBadge status={item.status} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">Origen:</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                            {item.origin === 'CITA' ? 'Cita de paciente' : 'Derivación de brigada'}
                        </span>
                    </div>
                    {item.reason && (
                        <p className="text-xs text-slate-600 mt-1">
                            <span className="font-semibold text-slate-700">Motivo:</span> {item.reason}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                {item.status === 'PENDING' || item.status === 'WAITING' ? (
                    <button
                        onClick={handleConsultationAction}
                        className="w-full md:w-auto bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                        Iniciar Consulta
                    </button>
                ) : item.status === 'IN_PROGRESS' ? (
                    <button
                        onClick={handleConsultationAction}
                        className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                        Continuar Consulta
                    </button>
                ) : (
                    <span className="text-xs text-slate-400 font-medium italic px-3 py-1 bg-slate-50 rounded-lg">
                        Atención finalizada
                    </span>
                )}
            </div>
        </div>
    );
};