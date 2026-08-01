import React from 'react';
import { QrCode, Camera } from 'lucide-react';

export const ScanQrPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto space-y-6 text-center">
      <div>
        <h2 className="text-xl font-black text-slate-900">Escanear Carné Digital / QR</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Apunta la cámara al código QR del carné del paciente.</p>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-8 border-4 border-slate-800 shadow-xl flex flex-col items-center justify-center min-h-80 relative overflow-hidden">
        <Camera className="w-12 h-12 text-teal-400 mb-3 animate-pulse" />
        <p className="text-xs font-bold text-slate-300">Cámara lista para escaneo</p>
        <span className="text-[10px] text-slate-500 mt-1">Busque el código de identificación rápida</span>
      </div>

      <button type="button" className="w-full py-3 bg-teal-700 text-white font-bold text-xs rounded-2xl shadow-xs hover:bg-teal-800 transition-all flex items-center justify-center gap-2">
        <QrCode className="w-4 h-4" />
        <span>Iniciar Escáner</span>
      </button>
    </div>
  );
};

export default ScanQrPage;