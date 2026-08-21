// apps/web/src/portals/admin/pages/recursos/equipos/components/EquiposTable.tsx
import React from 'react';
import { Stethoscope, Hash, Cpu, Edit2, Wrench, Trash2 } from 'lucide-react';
import type { MedicalEquipment, EquipmentStatus } from '../../../../../../modules/resources';

export interface EquiposTableProps {
  equipments: MedicalEquipment[];
  isLoading?: boolean;
  onEdit: (equipment: MedicalEquipment) => void;
  onMaintenance: (equipment: MedicalEquipment) => void;
  onDelete: (equipment: MedicalEquipment) => void;
}

const STATUS_BADGES: Record<EquipmentStatus, { label: string; bg: string; text: string }> = {
  OPERATIONAL: { label: 'Operativo', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  IN_MAINTENANCE: { label: 'En Mantenimiento', bg: 'bg-amber-50', text: 'text-amber-700' },
  DAMAGED: { label: 'Dañado', bg: 'bg-rose-50', text: 'text-rose-700' },
  DECOMMISSIONED: { label: 'Dado de Baja', bg: 'bg-slate-100', text: 'text-slate-600' },
};

export const EquiposTable: React.FC<EquiposTableProps> = ({
  equipments,
  isLoading = false,
  onEdit,
  onMaintenance,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-2"></div>
        <p className="text-sm text-slate-500">Cargando inventario de instrumental médico...</p>
      </div>
    );
  }

  if (equipments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Stethoscope className="w-6 h-6" />
        </div>
        <p className="text-base font-semibold text-slate-700">No se encontraron equipos médicos</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          No hay instrumental registrado que coincida con los criterios de búsqueda o filtros seleccionados.
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
              <th className="px-6 py-3.5">Código / Instrumental</th>
              <th className="px-6 py-3.5">Modelo</th>
              <th className="px-6 py-3.5">Número de Serie</th>
              <th className="px-6 py-3.5">Estado Operativo</th>
              <th className="px-6 py-3.5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {equipments.map((item) => {
              const statusBadge = STATUS_BADGES[item.status] || STATUS_BADGES.OPERATIONAL;

              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Código y Nombre */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700 shrink-0 mt-0.5">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-slate-500">{item.code}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Modelo */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Cpu className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.model || 'No especificado'}</span>
                    </div>
                  </td>

                  {/* Número de Serie */}
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1 font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      <Hash className="w-3 h-3 text-slate-400" />
                      <span>{item.serialNumber || 'S/N no registrado'}</span>
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}
                    >
                      {statusBadge.label}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        title="Editar equipo"
                        className="p-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onMaintenance(item)}
                        title="Gestionar estado y mantenimiento"
                        className="p-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
                      >
                        <Wrench className="w-3.5 h-3.5" />
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