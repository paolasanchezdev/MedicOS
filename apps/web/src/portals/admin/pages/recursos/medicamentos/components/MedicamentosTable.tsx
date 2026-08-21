// apps/web/src/portals/admin/pages/recursos/medicamentos/components/MedicamentosTable.tsx
import React from 'react';
import { Eye, AlertTriangle, Layers, Pill, Box, Edit2, Trash2 } from 'lucide-react';
import type { ResourceWithMetrics } from '../../../../../../modules/resources';

export interface MedicamentosTableProps {
  resources: ResourceWithMetrics[];
  isLoading?: boolean;
  onViewLots: (resource: ResourceWithMetrics) => void;
  onEdit: (resource: ResourceWithMetrics) => void;
  onDelete: (resource: ResourceWithMetrics) => void;
}

const CATEGORY_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  MEDICINE: { label: 'Medicamento', bg: 'bg-blue-50', text: 'text-blue-700' },
  CLINICAL_SUPPLY: { label: 'Insumo Clínico', bg: 'bg-purple-50', text: 'text-purple-700' },
  OTHER: { label: 'Otro', bg: 'bg-slate-100', text: 'text-slate-700' },
};

export const MedicamentosTable: React.FC<MedicamentosTableProps> = ({
  resources,
  isLoading = false,
  onViewLots,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-2"></div>
        <p className="text-sm text-slate-500">Cargando catálogo institucional...</p>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Pill className="w-6 h-6" />
        </div>
        <p className="text-base font-semibold text-slate-700">No se encontraron medicamentos o insumos</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          No hay registros que coincidan con los filtros aplicados o aún no se han ingresado fármacos al catálogo.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-3.5">Código / Fármaco</th>
              <th className="px-6 py-3.5">Categoría</th>
              <th className="px-6 py-3.5">Unidad</th>
              <th className="px-6 py-3.5 text-center">Lotes Activos</th>
              <th className="px-6 py-3.5 text-right">Stock Disponible</th>
              <th className="px-6 py-3.5">Estado / Umbral</th>
              <th className="px-6 py-3.5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {resources.map((item) => {
              const categoryBadge = CATEGORY_LABELS[item.category] || CATEGORY_LABELS.OTHER;
              const isLowStock = item.totalAvailableStock <= item.minThreshold;

              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700 shrink-0 mt-0.5">
                        {item.category === 'MEDICINE' ? (
                          <Pill className="w-4 h-4" />
                        ) : (
                          <Box className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-slate-500">{item.code}</span>
                          {item.genericName && (
                            <>
                              <span>•</span>
                              <span>{item.genericName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${categoryBadge.bg} ${categoryBadge.text}`}
                    >
                      {categoryBadge.label}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded">
                      {item.unit}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.activeLotsCount} {item.activeLotsCount === 1 ? 'lote' : 'lotes'}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span
                      className={`font-semibold ${
                        item.totalAvailableStock === 0
                          ? 'text-rose-600'
                          : isLowStock
                          ? 'text-amber-600'
                          : 'text-slate-800'
                      }`}
                    >
                      {item.totalAvailableStock.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">{item.unit}</span>
                  </td>

                  <td className="px-6 py-4">
                    {item.totalAvailableStock === 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-rose-700 font-medium bg-rose-50 px-2 py-0.5 rounded">
                        Agotado
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        Bajo Umbral ({item.minThreshold})
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                        Stock Óptimo
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onViewLots(item)}
                        title="Ver trazabilidad de lotes"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lotes</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        title="Editar catálogo"
                        className="p-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        title="Dar de baja"
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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