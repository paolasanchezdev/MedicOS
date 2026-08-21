// apps/web/src/modules/resources/components/DotationDetailsModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Layers, Pill, Stethoscope, Laptop, MapPin } from 'lucide-react';
import { dotationService } from '../services/dotation.service';
import type {
  BrigadeDotationSummary,
  FullBrigadeDotation,
} from '../types/resource.types';

interface DotationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  brigade: BrigadeDotationSummary | null;
}

interface DotationDetailsContentProps {
  brigade: BrigadeDotationSummary;
  onClose: () => void;
}

const DotationDetailsContent: React.FC<DotationDetailsContentProps> = ({ brigade, onClose }) => {
  const [details, setDetails] = useState<FullBrigadeDotation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    dotationService
      .getDotationDetails(brigade.brigadeId)
      .then((data) => {
        if (isMounted) {
          setDetails(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [brigade.brigadeId]);

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Checklist de Dotación: {brigade.brigadeName}
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              {brigade.municipality}, {brigade.department}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
        {isLoading ? (
          <div className="py-12 text-center text-slate-400">Cargando checklist de recursos...</div>
        ) : (
          <>
            {/* Medicamentos */}
            <div className="space-y-2">
              <h3 className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-blue-700">
                <Pill className="w-4 h-4" /> Medicamentos e Insumos Despachados
              </h3>
              {details?.supplyItems.length === 0 ? (
                <p className="text-slate-400 italic">No se asignaron medicamentos.</p>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="px-4 py-2.5">Fármaco</th>
                        <th className="px-4 py-2.5">Lote</th>
                        <th className="px-4 py-2.5 text-right">Cant. Despachada</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {details?.supplyItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2.5 font-medium text-slate-800">{item.stock.resource.name}</td>
                          <td className="px-4 py-2.5 font-mono text-slate-600">{item.stock.lotNumber}</td>
                          <td className="px-4 py-2.5 text-right font-semibold text-teal-700">
                            {item.quantitySupplied} {item.stock.resource.unit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Equipos */}
            <div className="space-y-2 pt-2">
              <h3 className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-teal-700">
                <Stethoscope className="w-4 h-4" /> Instrumental Médico Asignado
              </h3>
              {details?.equipmentItems.length === 0 ? (
                <p className="text-slate-400 italic">No se asignaron equipos médicos.</p>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="px-4 py-2.5">Equipo</th>
                        <th className="px-4 py-2.5">Código / Serie</th>
                        <th className="px-4 py-2.5">Condición de Salida</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {details?.equipmentItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2.5 font-medium text-slate-800">{item.equipment.name}</td>
                          <td className="px-4 py-2.5 font-mono text-slate-600">{item.equipment.code}</td>
                          <td className="px-4 py-2.5">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                              {item.conditionOut}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Hardware */}
            <div className="space-y-2 pt-2">
              <h3 className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-indigo-700">
                <Laptop className="w-4 h-4" /> Hardware y Terminales
              </h3>
              {details?.devices.length === 0 ? (
                <p className="text-slate-400 italic">No se asignaron terminales tecnológicas.</p>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="px-4 py-2.5">Dispositivo</th>
                        <th className="px-4 py-2.5">Número de Serie</th>
                        <th className="px-4 py-2.5">Rol en Brigada</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {details?.devices.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2.5 font-medium text-slate-800">{item.device.name}</td>
                          <td className="px-4 py-2.5 font-mono text-slate-600">{item.device.serialNumber}</td>
                          <td className="px-4 py-2.5 text-slate-700">{item.roleInBrigade || 'Estación'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const DotationDetailsModal: React.FC<DotationDetailsModalProps> = ({
  isOpen,
  onClose,
  brigade,
}) => {
  if (!isOpen || !brigade) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <DotationDetailsContent
        key={brigade.brigadeId}
        brigade={brigade}
        onClose={onClose}
      />
    </div>
  );
};