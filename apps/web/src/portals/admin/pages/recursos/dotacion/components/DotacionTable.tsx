// apps/web/src/portals/admin/pages/recursos/dotacion/components/DotacionTable.tsx
import React from 'react';
import { 
  BriefcaseMedical, 
  Pill, 
  Stethoscope, 
  Laptop, 
  Eye, 
  ClipboardCheck,
  MapPin,
  UserCheck
} from 'lucide-react';
import type { BrigadeDotationSummary, DotationStatus } from '../../../../../../modules/resources';

interface DotacionTableProps {
  dotations: BrigadeDotationSummary[];
  isLoading?: boolean;
  onViewDetails: (item: BrigadeDotationSummary) => void;
  onLiquidate: (item: BrigadeDotationSummary) => void;
}

const STATUS_BADGES: Record<DotationStatus, { label: string; bg: string; text: string }> = {
  PREPARING: { label: 'Preparación', bg: 'bg-slate-100', text: 'text-slate-700' },
  DISPATCHED: { label: 'Despachada', bg: 'bg-blue-50', text: 'text-blue-700' },
  IN_FIELD: { label: 'En Campo', bg: 'bg-teal-50', text: 'text-teal-700' },
  PENDING_RETURN: { label: 'Pendiente Retorno', bg: 'bg-amber-50', text: 'text-amber-700' },
  CLOSED: { label: 'Liquidada', bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

export const DotacionTable: React.FC<DotacionTableProps> = ({
  dotations,
  isLoading = false,
  onViewDetails,
  onLiquidate,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-2"></div>
        <p className="text-sm text-slate-500">Cargando dotaciones y asignaciones a brigadas...</p>
      </div>
    );
  }

  if (dotations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
          <BriefcaseMedical className="w-6 h-6" />
        </div>
        <p className="text-base font-semibold text-slate-700">No se encontraron dotaciones de brigada</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          No hay jornadas registradas que coincidan con los filtros seleccionados.
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
              <th className="px-6 py-3.5">Brigada / Destino</th>
              <th className="px-6 py-3.5">Responsable</th>
              <th className="px-6 py-3.5 text-center">Medicamentos / Lotes</th>
              <th className="px-6 py-3.5 text-center">Equipos Médicos</th>
              <th className="px-6 py-3.5 text-center">Dispositivos</th>
              <th className="px-6 py-3.5">Estado Dotación</th>
              <th className="px-6 py-3.5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {dotations.map((item) => {
              const statusBadge = STATUS_BADGES[item.status] || STATUS_BADGES.PREPARING;

              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Brigada y Destino */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                        <BriefcaseMedical className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{item.brigadeName}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-slate-500">{item.brigadeCode}</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {item.municipality}, {item.department}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Responsable */}
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.responsibleName}</span>
                    </div>
                  </td>

                  {/* Medicamentos e Insumos */}
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                      <Pill className="w-3.5 h-3.5" />
                      <span>{item.totalSuppliesCount} ítems</span>
                    </div>
                  </td>

                  {/* Equipos Médicos */}
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>{item.totalEquipmentCount} eq.</span>
                    </div>
                  </td>

                  {/* Dispositivos Hardware */}
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                      <Laptop className="w-3.5 h-3.5" />
                      <span>{item.totalDevicesCount} disp.</span>
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
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onViewDetails(item)}
                        title="Ver checklist completo de dotación"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Checklist</span>
                      </button>

                      {item.status !== 'CLOSED' && (
                        <button
                          type="button"
                          onClick={() => onLiquidate(item)}
                          title="Cerrar y conciliar retorno de insumos"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                        >
                          <ClipboardCheck className="w-3.5 h-3.5" />
                          <span>Liquidar</span>
                        </button>
                      )}
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