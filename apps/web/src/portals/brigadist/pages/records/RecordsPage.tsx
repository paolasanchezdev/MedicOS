import React from 'react';
import { Folder } from 'lucide-react';

export const RecordsPage: React.FC = () => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900">Expedientes Locales</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Archivos en caché sincronizados en el dispositivo.</p>
      </div>

      <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center">
        <Folder className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-700">Expedientes Guardados en Dispositivo</p>
        <p className="text-xs text-slate-400 mt-1">Acceso sin conexión a historiales médicos descargados.</p>
      </div>
    </div>
  );
};

export default RecordsPage;