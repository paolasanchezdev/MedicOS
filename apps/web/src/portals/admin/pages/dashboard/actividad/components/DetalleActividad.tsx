import React from 'react';
import { X, ShieldAlert, Terminal } from 'lucide-react';
import type { AuditLogItem } from '../../../../../../modules/admin/types/admin-dashboard.types';

interface DetalleActividadProps {
  item: AuditLogItem | null;
  onClose: () => void;
}

export const DetalleActividad: React.FC<DetalleActividadProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <span>Detalle del Evento</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <span className="text-gray-500 block">ID de Auditoría</span>
            <span className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded block mt-1">
              {item.id}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-gray-500 block">Acción</span>
              <span className="font-semibold text-gray-900 mt-1 block">{item.action}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Entidad/Módulo</span>
              <span className="font-semibold text-gray-900 mt-1 block">{item.entity}</span>
            </div>
          </div>

          <div>
            <span className="text-gray-500 block">ID de Recurso Afectado</span>
            <span className="font-mono text-gray-800 mt-1 block">{item.entityId}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-gray-500 block">Actor</span>
              <span className="font-medium text-gray-900 mt-1 block">
                {item.user ? `${item.user.firstName} ${item.user.lastName}` : 'Sistema'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Rol</span>
              <span className="font-mono text-gray-900 mt-1 block">
                {item.user?.role || 'SYSTEM'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-gray-500 block">Fecha y Hora</span>
            <span className="text-gray-900 mt-1 block">
              {new Date(item.createdAt).toLocaleString('es-SV')}
            </span>
          </div>

          <div>
            <span className="text-gray-500 block">Origen / IP</span>
            <span className="font-mono text-gray-800 mt-1 block">
              {item.ipAddress || 'Interno / Red Local'}
            </span>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <span className="text-gray-700 font-semibold mb-2 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-blue-600" />
              <span>Campos Modificados (Payload JSON)</span>
            </span>
            <pre className="bg-gray-950 text-emerald-400 font-mono text-[11px] p-3 rounded-lg overflow-x-auto max-h-60 mt-2">
              {item.changedFields
                ? JSON.stringify(item.changedFields, null, 2)
                : '// Sin cambios registrados en payload'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};