// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/AccionesRapidas.tsx
// =========================================================================

import React from 'react';
import { QrCode, UserPlus, Search, Stethoscope, Map } from 'lucide-react';

interface AccionesRapidasProps {
  onEscanearQR?: () => void;
  onRegistrarPaciente?: () => void;
  onBuscarPaciente?: () => void;
  onNuevaConsulta?: () => void;
  onVerMapa?: () => void;
}

export const AccionesRapidas: React.FC<AccionesRapidasProps> = ({
  onEscanearQR,
  onRegistrarPaciente,
  onBuscarPaciente,
  onNuevaConsulta,
  onVerMapa,
}) => {
  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
        Acciones Rápidas
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={onEscanearQR}
          className="p-3 bg-[#3f8880] text-white rounded-xl hover:bg-[#35726c] transition-colors flex flex-col items-center justify-center text-center gap-2 shadow-2xs group"
        >
          <QrCode className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold">Escanear QR</span>
        </button>

        <button
          type="button"
          onClick={onRegistrarPaciente}
          className="p-3 bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-colors flex flex-col items-center justify-center text-center gap-2 group"
        >
          <UserPlus className="w-5 h-5 text-[#3f8880] group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold">Registrar paciente</span>
        </button>

        <button
          type="button"
          onClick={onBuscarPaciente}
          className="p-3 bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-colors flex flex-col items-center justify-center text-center gap-2 group"
        >
          <Search className="w-5 h-5 text-[#3f8880] group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold">Buscar paciente</span>
        </button>

        <button
          type="button"
          onClick={onNuevaConsulta}
          className="p-3 bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-colors flex flex-col items-center justify-center text-center gap-2 group"
        >
          <Stethoscope className="w-5 h-5 text-[#3f8880] group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold">Nueva consulta</span>
        </button>

        <button
          type="button"
          onClick={onVerMapa}
          className="p-3 bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-colors flex flex-col items-center justify-center text-center gap-2 group col-span-2 sm:col-span-1"
        >
          <Map className="w-5 h-5 text-[#3f8880] group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold">Ver mapa</span>
        </button>
      </div>
    </div>
  );
};