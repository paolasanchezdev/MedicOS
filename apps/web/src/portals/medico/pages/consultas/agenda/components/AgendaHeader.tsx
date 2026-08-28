// apps/web/src/portals/medico/pages/consultas/agenda/components/AgendaHeader.tsx
import React from 'react';
import { Calendar, ShieldCheck } from 'lucide-react';

interface AgendaHeaderProps {
    dateLabel: string;
}

export const AgendaHeader: React.FC<AgendaHeaderProps> = ({ dateLabel }) => {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-6 sm:p-7 text-white shadow-sm border border-teal-700/50">
            {/* Resplandor y patrón decorativo de fondo tipo onda médica */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
                <svg
                    width="200"
                    height="100"
                    viewBox="0 0 200 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M10 50H50L62 15L78 85L92 35L102 60L112 50H190"
                        stroke="white"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Contenido Principal */}
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-2">
                    {/* Badge de Contexto */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
                        <span>Agenda Médica Asignada</span>
                    </div>

                    {/* Título */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        Atenciones del Día ({dateLabel})
                    </h1>

                    {/* Subtítulo / Descripción */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-teal-100/90 font-medium">
                        <Calendar className="w-4 h-4 text-teal-200 shrink-0" />
                        <span>Centro operativo de turnos y pacientes asignados según disponibilidad y horario profesional.</span>
                    </div>
                </div>

                {/* Badge lateral */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl text-xs font-semibold text-teal-100 shrink-0 shadow-2xs">
                    Flujo de Asignación Automática Activo
                </div>
            </div>
        </div>
    );
};