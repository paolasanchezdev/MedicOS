// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/components/JornadaInfoCard.tsx
// DESCRIPCIÓN: Ficha técnica de planificación con datos reales de Brigade en PostgreSQL.
// =========================================================================

import React from 'react';
import { ClipboardList, MapPin, User, Calendar, Navigation } from 'lucide-react';
import type { JornadaInformacion } from '../../../../../../modules/brigades';

interface JornadaInfoCardProps {
  informacion: JornadaInformacion;
}

export const JornadaInfoCard: React.FC<JornadaInfoCardProps> = ({ informacion }) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Cabecera */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-xs">
            <ClipboardList className="w-5 h-5" />
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
            Ficha Oficial
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Registro Institucional
          </p>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
            Información de la Brigada
          </h2>
        </div>

        {/* Parámetros Reales de la Tabla Brigade */}
        <div className="pt-2 space-y-2 text-xs">
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-700">
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-[#2B7A78]" />
              <span className="font-medium">Ubicación Territorial</span>
            </div>
            <span className="font-bold text-slate-900">
              {informacion.municipio}, {informacion.departamento}
            </span>
          </div>

          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-700">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-[#2B7A78]" />
              <span className="font-medium">Fecha de Inicio</span>
            </div>
            <span className="font-bold text-slate-900">{informacion.fechaInicio}</span>
          </div>

          {informacion.fechaFin && (
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-700">
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-[#2B7A78]" />
                <span className="font-medium">Fecha de Cierre</span>
              </div>
              <span className="font-bold text-slate-900">{informacion.fechaFin}</span>
            </div>
          )}

          {informacion.coordenadas && (
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-700">
              <div className="flex items-center gap-2 text-slate-500">
                <Navigation className="w-3.5 h-3.5 text-[#2B7A78]" />
                <span className="font-medium">Coordenadas GPS</span>
              </div>
              <span className="font-mono font-bold text-slate-900">{informacion.coordenadas}</span>
            </div>
          )}

          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-700">
            <div className="flex items-center gap-2 text-slate-500">
              <User className="w-3.5 h-3.5 text-[#2B7A78]" />
              <span className="font-medium">Responsable / Líder</span>
            </div>
            <span className="font-bold text-[#2B7A78]">{informacion.responsable}</span>
          </div>
        </div>
      </div>
    </div>
  );
};