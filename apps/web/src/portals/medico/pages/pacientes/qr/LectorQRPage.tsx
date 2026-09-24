// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/pacientes/qr/LectorQRPage.tsx
// DESCRIPCIÓN: Pantalla oficial de Escaneo y Resolución de Carnet QR para Médicos.
// =========================================================================

import React from 'react';
import { QRScannerCard } from '../../../../../modules/qr/index.js';
import { QrCode, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LectorQRPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/medico/pacientes/listado')}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
            title="Volver al listado de pacientes"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <QrCode className="w-6 h-6 text-[#166E7A]" />
              Escanear Carnet de Paciente
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Consulta inmediata del expediente mediante código QR nominal.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 text-[#166E7A] text-xs font-bold rounded-full">
          <Shield className="w-3.5 h-3.5" />
          Acceso Clínico Autorizado
        </span>
      </div>

      {/* Componente de Escaneo */}
      <div className="py-2">
        <QRScannerCard scannerRole="DOCTOR" />
      </div>
    </div>
  );
};

export default LectorQRPage;