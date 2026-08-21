// apps/web/src/modules/resources/components/ResourceLotsModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Layers, Clock, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import { resourcesService } from '../services/resources.service';
import type { ResourceWithMetrics, ResourceStock } from '../types/resource.types';

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

export interface ResourceLotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: ResourceWithMetrics | null;
  onAddStockClick: (resource: ResourceWithMetrics) => void;
}

interface ResourceLotsContentProps {
  resource: ResourceWithMetrics;
  onClose: () => void;
  onAddStockClick: (resource: ResourceWithMetrics) => void;
}

const ResourceLotsContent: React.FC<ResourceLotsContentProps> = ({
  resource,
  onClose,
  onAddStockClick,
}) => {
  const [stocks, setStocks] = useState<ResourceStock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    let isMounted = true;
    resourcesService
      .getResourceStocks(resource.id)
      .then((data) => {
        if (isMounted) {
          setStocks(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [resource.id]);

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border border-slate-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Trazabilidad de Lotes: {resource.name}
            </h2>
            <p className="text-xs text-slate-500 font-mono">{resource.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onAddStockClick(resource)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Lote</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-8 text-slate-400 text-sm">Cargando lotes vigentes...</div>
        ) : stocks.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No hay lotes registrados para este medicamento en bodega.
          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="px-4 py-3">Número de Lote</th>
                  <th className="px-4 py-3">Fecha de Vencimiento</th>
                  <th className="px-4 py-3 text-right">Cantidad Disponible</th>
                  <th className="px-4 py-3 text-right">Reservado</th>
                  <th className="px-4 py-3 text-center">Estado Sanitario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {stocks.map((stock) => {
                  const expDate = new Date(stock.expirationDate);
                  const expTimestamp = expDate.getTime();
                  const isExpired = expTimestamp < nowMs;
                  const isExpiringSoon = !isExpired && expTimestamp <= nowMs + NINETY_DAYS_MS;

                  return (
                    <tr key={stock.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-slate-700">
                        {stock.lotNumber}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {expDate.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800">
                        {stock.quantityAvailable.toLocaleString()} {resource.unit}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500">
                        {stock.quantityReserved.toLocaleString()} {resource.unit}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Vencido</span>
                          </span>
                        ) : isExpiringSoon ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700">
                            <Clock className="w-3 h-3" />
                            <span>Próximo a vencer</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Vigente</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export const ResourceLotsModal: React.FC<ResourceLotsModalProps> = ({
  isOpen,
  onClose,
  resource,
  onAddStockClick,
}) => {
  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <ResourceLotsContent
        key={resource.id}
        resource={resource}
        onClose={onClose}
        onAddStockClick={onAddStockClick}
      />
    </div>
  );
};