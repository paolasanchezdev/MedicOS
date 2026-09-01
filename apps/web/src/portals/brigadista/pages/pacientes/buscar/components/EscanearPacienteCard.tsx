// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/buscar/components/EscanearPacienteCard.tsx
// DESCRIPCIÓN: Acceso directo al lector QR sin duplicar la vista de escaneo.
// =========================================================================

import React from 'react';
import { QrCode, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EscanearPacienteCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shrink-0">
          <QrCode className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
            ¿El paciente porta su carnet físico?
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Escanea el código QR del carnet para abrir directamente el expediente sin teclear datos.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/brigadista/pacientes/escanear')}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer shrink-0 self-stretch sm:self-auto justify-center"
      >
        <span>Escanear QR</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
      </button>
    </div>
  );
};