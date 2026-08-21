// apps/web/src/portals/admin/pages/establecimientos/recursos/components/RecursosTable.tsx
import React from 'react';
import type {
  EstablishmentResourceData,
  ResourceStockStatus,
} from '../../../../../../modules/establishments/types/establishment.types';

interface RecursosTableProps {
  resources: EstablishmentResourceData[];
  onUpdateResource: (item: EstablishmentResourceData) => void;
}

export const RecursosTable: React.FC<RecursosTableProps> = ({
  resources,
  onUpdateResource,
}) => {
  const getBadgeType = (type: string) => {
    switch (type) {
      case 'HOSPITAL':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700">Hospital</span>;
      case 'HEALTH_CENTER':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-700">Unidad Médica</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700">Clínica</span>;
    }
  };

  const getStatusBadge = (status: ResourceStockStatus) => {
    switch (status) {
      case 'OPTIMAL':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Óptimo</span>;
      case 'MODERATE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Moderado</span>;
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">Crítico</span>;
    }
  };

  if (resources.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-xs border border-slate-200 text-center text-slate-500">
        No se encontraron recursos que coincidan con los filtros aplicados.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-4">Establecimiento</th>
              <th className="py-3.5 px-4">Tipo / Ubicación</th>
              <th className="py-3.5 px-4">Camas Generales</th>
              <th className="py-3.5 px-4">Camas UCI</th>
              <th className="py-3.5 px-4">Ambulancias</th>
              <th className="py-3.5 px-4">Oxígeno (Cilindros)</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {resources.map((item) => {
              const est = item.establishment;
              const bedPercent = est.totalBeds > 0 ? Math.round((est.availableBeds / est.totalBeds) * 100) : 0;
              const uciPercent = item.camasUCITotales > 0 ? Math.round((item.camasUCIDisponibles / item.camasUCITotales) * 100) : 0;

              return (
                <tr key={est.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{est.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{est.code}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="mb-1">{getBadgeType(est.type)}</div>
                    <div className="text-xs text-slate-500">{est.municipality}, {est.department}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-xs font-semibold text-slate-700">
                      {est.availableBeds} / {est.totalBeds} lib.
                    </div>
                    {est.totalBeds > 0 && (
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className={`h-full ${bedPercent < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${bedPercent}%` }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {item.camasUCITotales > 0 ? (
                      <div>
                        <div className="text-xs font-semibold text-slate-700">
                          {item.camasUCIDisponibles} / {item.camasUCITotales} lib.
                        </div>
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className={`h-full ${uciPercent < 20 ? 'bg-rose-500' : 'bg-blue-500'}`}
                            style={{ width: `${uciPercent}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">N/A</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-semibold text-xs ${item.ambulanciasDisponibles === 0 ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                      🚑 {item.ambulanciasDisponibles} / {item.ambulanciasTotales}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-xs text-slate-700 font-mono">
                      💨 {item.cilindrosOxigeno} unid.
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(item.stockStatus)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onUpdateResource(item)}
                      className="px-2.5 py-1 text-xs font-medium text-teal-700 hover:bg-teal-50 rounded-lg border border-teal-200 transition-colors"
                    >
                      Ajustar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};