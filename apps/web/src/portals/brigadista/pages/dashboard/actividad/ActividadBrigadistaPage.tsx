// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/actividad/ActividadBrigadistaPage.tsx
// DESCRIPCIÓN: Vista del Registro de Actividad Operativa del Brigadista.
// =========================================================================

import React from 'react';
import { Activity, Clock, Filter, CheckCircle2, RefreshCw } from 'lucide-react';

export const ActividadBrigadistaPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Historial de Actividad</h1>
          <p className="text-sm text-slate-500 mt-1">
            Registro cronológico de acciones y eventos realizados en el dispositivo local.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Filter className="w-4 h-4 text-[#3f8880]" />
          <span>Filtrar Actividad</span>
        </button>
      </div>

      {/* Timeline de Actividades */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative border-l-2 border-slate-100 pl-6 space-y-6">
          {[
            {
              time: '11:20 AM',
              title: 'Sincronización de registros offline',
              description: 'Se enviaron 5 expedientes guardados localmente al servidor central.',
              icon: RefreshCw,
              color: 'text-blue-600 bg-blue-50',
            },
            {
              time: '10:45 AM',
              title: 'Toma de signos vitales registrada',
              description: 'Paciente: María del Carmen López - PA: 120/80, FC: 72 bpm, Temp: 36.5°C.',
              icon: Activity,
              color: 'text-teal-600 bg-teal-50',
            },
            {
              time: '10:00 AM',
              title: 'Nuevo paciente registrado',
              description: 'Se creó la ficha clínica preliminar para José Roberto Hernández.',
              icon: CheckCircle2,
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              time: '08:30 AM',
              title: 'Inicio de jornada operativa',
              description: 'Apertura de turno en Brigada San Miguel Tepezontes.',
              icon: Clock,
              color: 'text-purple-600 bg-purple-50',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative group">
                <div className={`absolute -left-8.75 top-0 w-8 h-8 rounded-full ${item.color} flex items-center justify-center ring-4 ring-white`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                    <span className="text-xs text-slate-400">• {item.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActividadBrigadistaPage;