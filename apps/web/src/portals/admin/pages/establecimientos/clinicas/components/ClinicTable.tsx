// apps/web/src/portals/admin/pages/establecimientos/clinicas/components/ClinicTable.tsx
import React from 'react';
import type {
  Establishment,
  EstablishmentStatus,
} from '../../../../../../modules/establishments/types/establishment.types';

export type Clinic = Establishment;

interface ClinicTableProps {
  clinics: Establishment[];
  onViewDetail: (clinic: Establishment) => void;
  onEdit: (clinic: Establishment) => void;
  onDelete: (clinic: Establishment) => void;
}

export const ClinicTable: React.FC<ClinicTableProps> = ({
  clinics,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  const getStatusBadge = (status: EstablishmentStatus) => {
    switch (status) {
      case 'OPERATIONAL':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            Operativa
          </span>
        );
      case 'FULL_CAPACITY':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            Capacidad Máxima
          </span>
        );
      case 'MAINTENANCE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
            Mantenimiento
          </span>
        );
      case 'INACTIVE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            Inactiva
          </span>
        );
      default:
        return null;
    }
  };

  if (clinics.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-xs border border-slate-200 text-center text-slate-500">
        No se encontraron clínicas registradas con los filtros seleccionados.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-4">Clínica / Código</th>
              <th className="py-3.5 px-4">Ubicación y Referencia</th>
              <th className="py-3.5 px-4">Contacto Telefónico</th>
              <th className="py-3.5 px-4">Operador / Nivel</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {clinics.map((clinic) => (
              <tr key={clinic.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-800">{clinic.name}</div>
                  <div className="text-xs text-teal-700 font-mono font-medium">{clinic.code}</div>
                </td>
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="text-slate-800 font-medium">
                    {clinic.municipality}, {clinic.department}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1" title={clinic.address}>
                    {clinic.address}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  {clinic.phone ? (
                    <span className="font-mono text-xs text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                      📞 {clinic.phone}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Sin teléfono</span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    ISSS • Nivel {clinic.level}
                  </span>
                </td>
                <td className="py-3.5 px-4">{getStatusBadge(clinic.status)}</td>
                <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onViewDetail(clinic)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Ver Detalles"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(clinic)}
                    className="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(clinic)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Dar de Baja"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};