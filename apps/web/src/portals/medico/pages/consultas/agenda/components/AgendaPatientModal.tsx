// apps/web/src/portals/medico/pages/consultas/agenda/components/AgendaPatientModal.tsx
import React from 'react';
import { X, User, Calendar, FileText, Phone } from 'lucide-react';
import type { AgendaItem } from './ConsultaAgendaCard';

interface AgendaPatientModalProps {
    item: AgendaItem | null;
    onClose: () => void;
    onStartConsultation: (id: string) => void;
}

export const AgendaPatientModal: React.FC<AgendaPatientModalProps> = ({
    item,
    onClose,
    onStartConsultation,
}) => {
    if (!item) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                {/* Cabecera del Modal */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#2B7A78] flex items-center justify-center border border-teal-100">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Detalles de la Atención</h3>
                            <p className="text-xs text-slate-500">ID Paciente: {item.patientId}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Información del Paciente */}
                <div className="space-y-4">
                    <div>
                        <h4 className="text-xl font-extrabold text-slate-900">{item.patientName}</h4>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Hora: {item.time}
                            </span>
                            <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-slate-400" /> Origen: {item.origin}
                            </span>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <FileText className="w-4 h-4 text-[#2B7A78]" /> Motivo de consulta registrado:
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            {item.reason || 'Sin motivo especificado en el registro inicial.'}
                        </p>
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={() => {
                            onClose();
                            onStartConsultation(item.id);
                        }}
                        className="bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                        Iniciar Consulta Ahora
                    </button>
                </div>
            </div>
        </div>
    );
};