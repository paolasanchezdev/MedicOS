// apps/web/src/portals/admin/pages/brigadas/todas/components/BrigadasTable.tsx
import React from 'react';
import {
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Stethoscope,
  Edit2,
  UserCheck,
  Activity,
  Trash2,
  HeartHandshake,
} from 'lucide-react';
import type { BrigadeItem, BrigadeStatus } from '../../../../../../modules/brigades';

export interface BrigadasTableProps {
  brigades: BrigadeItem[];
  isLoading: boolean;
  onEdit: (item: BrigadeItem) => void;
  onAssignLeader: (item: BrigadeItem) => void;
  onStatusChange: (item: BrigadeItem) => void;
  onDelete: (item: BrigadeItem) => void;
}

const STATUS_BADGES: Record<
  BrigadeStatus,
  { label: string; bg: string; text: string; dotBg: string }
> = {
  PLANNED: {
    label: 'Planificada',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dotBg: 'bg-amber-500',
  },
  ACTIVE: {
    label: 'En Despliegue',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dotBg: 'bg-emerald-500',
  },
  COMPLETED: {
    label: 'Completada',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dotBg: 'bg-blue-500',
  },
  CANCELLED: {
    label: 'Cancelada',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    dotBg: 'bg-rose-500',
  },
};

export const BrigadasTable: React.FC<BrigadasTableProps> = ({
  brigades,
  isLoading,
  onEdit,
  onAssignLeader,
  onStatusChange,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-2" />
        <p className="text-sm text-slate-500">Cargando expediciones y brigadas médicas...</p>
      </div>
    );
  }

  if (brigades.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <HeartHandshake className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <p className="text-base font-semibold text-slate-700">No se encontraron brigadas registradas</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          No hay expediciones que coincidan con los filtros aplicados o no se han creado registros aún.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-3.5">Brigada / Ubicación</th>
              <th className="px-6 py-3.5">Responsable de Mando</th>
              <th className="px-6 py-3.5">Personal Asignado</th>
              <th className="px-6 py-3.5">Período Operativo</th>
              <th className="px-6 py-3.5">Estado de Despliegue</th>
              <th className="px-6 py-3.5">Atenciones</th>
              <th className="px-6 py-3.5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {brigades.map((item) => {
              const statusBadge = STATUS_BADGES[item.status] || STATUS_BADGES.PLANNED;

              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{item.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>
                        {item.municipality}, {item.department}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {item.leader ? (
                      <div>
                        <div className="font-medium text-slate-800 text-xs flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                          {item.leader.fullName}
                        </div>
                        <div className="text-[11px] text-slate-400">{item.leader.email}</div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
                        Sin líder asignado
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {item.membersCount} profesionales
                    </span>
                  </td>

                  <td className="px-6 py-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{new Date(item.startDate).toLocaleDateString()}</span>
                      {item.endDate && (
                        <span className="text-slate-400">
                          - {new Date(item.endDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotBg}`} />
                      {statusBadge.label}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                      <Stethoscope className="w-3.5 h-3.5" />
                      {item.totalConsultations}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        title="Editar brigada"
                        className="p-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onAssignLeader(item)}
                        title="Asignar responsable"
                        className="p-1 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onStatusChange(item)}
                        title="Cambiar estado"
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Activity className="w-3.5 h-3.5" />
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

export default BrigadasTable;