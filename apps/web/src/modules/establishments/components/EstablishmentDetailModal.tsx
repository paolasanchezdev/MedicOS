// apps/web/src/modules/establishments/components/EstablishmentDetailModal.tsx
import React from 'react';
import type { Establishment } from '../types/establishment.types';

export interface EstablishmentDetailModalProps {
  establishment: Establishment;
  onClose: () => void;
}

export const EstablishmentDetailModal: React.FC<EstablishmentDetailModalProps> = ({
  establishment,
  onClose,
}) => {
  const getGoogleMapsUrl = (e: Establishment) => {
    const query = `${e.name}, ${e.municipality || ''}, ${e.department || ''}, El Salvador`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const isHospital = establishment.type === 'HOSPITAL';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-8 animate-fade-in">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded uppercase">
              {establishment.code} • Nivel {establishment.level}
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {establishment.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm text-slate-600">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Estado Operativo</span>
              <p className="font-bold text-slate-800 mt-0.5">
                {establishment.status === 'OPERATIONAL'
                  ? '🟢 Operativo'
                  : establishment.status === 'FULL_CAPACITY'
                  ? '🟡 Capacidad Máxima'
                  : establishment.status === 'MAINTENANCE'
                  ? '🟠 En Mantenimiento'
                  : '🔴 Inactivo'}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">
                {isHospital ? 'Disponibilidad de Camas' : 'Tipo de Atención'}
              </span>
              <p className="font-bold text-teal-700 mt-0.5">
                {isHospital
                  ? `${establishment.availableBeds ?? 0} / ${establishment.totalBeds ?? 0}`
                  : `Atención Primaria (${establishment.level})`}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Dirección y Referencia</span>
              <p className="font-medium text-slate-800 mt-0.5 leading-relaxed">{establishment.address}</p>
              <p className="text-xs text-slate-500 mt-1">{establishment.municipality}, {establishment.department}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Teléfono</span>
                <p className="font-medium text-slate-800">{establishment.phone || 'No registrado'}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Emergencias</span>
                <p className="font-medium text-slate-800">{establishment.emergencyPhone || 'No registrado'}</p>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Metadatos de Sistema</span>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                Sincronización: {establishment.syncStatus} • Versión: v{establishment.version}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <a
            href={getGoogleMapsUrl(establishment)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 px-3 py-2 rounded-lg transition-colors"
          >
            <span>Buscar en Google Maps</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};