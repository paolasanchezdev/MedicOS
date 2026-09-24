// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/escanear/EscanearPacientePage.tsx
// DESCRIPCIÓN: Pantalla de Escaneo de Carnet en Terreno para Brigadistas.
// =========================================================================

import React from 'react';
import { QRScannerCard } from '../../../../../modules/qr/index.js';
import { QrCode, ArrowLeft, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EscanearPacientePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/brigadista/pacientes/buscar')}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
            title="Volver a búsqueda"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <QrCode className="w-6 h-6 text-[#166E7A]" />
              Identificación de Paciente en Brigada
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Escanea el carnet o ingresa el DUI para triage y registro en jornada.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-full">
          <Users className="w-3.5 h-3.5" />
          Módulo Territorial
        </span>
      </div>

      {/* Componente de Escaneo */}
      <div className="py-2">
        <QRScannerCard scannerRole="BRIGADISTA" />
      </div>
    </div>
  );
};

export default EscanearPacientePage;