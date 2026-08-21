// apps/web/src/portals/admin/pages/recursos/tecnologia/components/DispositivosTable.tsx
import React from 'react';
import {
  Laptop,
  Server,
  Edit2,
  Radio,
  Trash2,
  Wifi,
  WifiOff,
  Lock,
  Archive,
} from 'lucide-react';
import type { DeviceItem, DeviceStatus } from '../../../../../../modules/resources';

export interface DispositivosTableProps {
  devices: DeviceItem[];
  isLoading: boolean;
  onEdit: (device: DeviceItem) => void;
  onStatusChange: (device: DeviceItem) => void;
  onDelete: (device: DeviceItem) => void;
}

const STATUS_BADGES: Record<
  DeviceStatus,
  { label: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }
> = {
  ACTIVE: { label: 'Activo / Online', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: Wifi },
  OFFLINE: { label: 'Offline / Campo', bg: 'bg-blue-50', text: 'text-blue-700', icon: WifiOff },
  BLOCKED: { label: 'Bloqueado', bg: 'bg-rose-50', text: 'text-rose-700', icon: Lock },
  RETIRED: { label: 'Retirado / Baja', bg: 'bg-slate-100', text: 'text-slate-600', icon: Archive },
};

export const DispositivosTable: React.FC<DispositivosTableProps> = ({
  devices,
  isLoading,
  onEdit,
  onStatusChange,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-2" />
        <p className="text-sm text-slate-500">Cargando parque tecnológico y estaciones...</p>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Laptop className="w-6 h-6" />
        </div>
        <p className="text-base font-semibold text-slate-700">No se encontraron dispositivos registrados</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          No hay estaciones o terminales que coincidan con los filtros aplicados en el sistema central.
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
              <th className="px-6 py-3.5">Dispositivo / Nombre</th>
              <th className="px-6 py-3.5">Número de Serie</th>
              <th className="px-6 py-3.5">Sistema Operativo</th>
              <th className="px-6 py-3.5">Versión App</th>
              <th className="px-6 py-3.5">Estado / Conectividad</th>
              <th className="px-6 py-3.5">Última Sincronización</th>
              <th className="px-6 py-3.5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {devices.map((item) => {
              const statusBadge = STATUS_BADGES[item.status] || STATUS_BADGES.ACTIVE;
              const StatusIcon = statusBadge.icon;
              const currentBrigade = item.brigadeAssignments?.[0]?.brigade;

              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700 shrink-0 mt-0.5">
                        <Server className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          {currentBrigade ? (
                            <span className="text-teal-600 font-medium">
                              Asignado a: {currentBrigade.name} ({currentBrigade.municipality})
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              {item.location || 'En Bodega Central'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                      {item.serialNumber}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-600 font-medium">
                      {item.operatingSystem}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-slate-600">
                      {item.appVersion || 'v1.0.0'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusBadge.label}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-xs text-slate-500">
                    {item.lastSyncAt ? (
                      <div>
                        <div>{new Date(item.lastSyncAt).toLocaleDateString()}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {new Date(item.lastSyncAt).toLocaleTimeString()}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Sin sincronizaciones</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        title="Editar dispositivo"
                        className="p-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onStatusChange(item)}
                        title="Cambiar estado y red"
                        className="p-1 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
                      >
                        <Radio className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        title="Retirar dispositivo"
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

export default DispositivosTable;