// apps/web/src/modules/resources/components/LiquidateDotationModal.tsx
import React, { useState, useEffect } from 'react';
import { X, ClipboardCheck, AlertCircle } from 'lucide-react';
import { dotationService } from '../services/dotation.service';
import type {
  BrigadeDotationSummary,
  FullBrigadeDotation,
  LiquidateDotationDto,
  SupplyLiquidationItemDto,
  EquipmentLiquidationItemDto,
  ItemCondition,
} from '../types/resource.types';

interface LiquidateDotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (brigadeId: string, dto: LiquidateDotationDto) => Promise<void>;
  brigade: BrigadeDotationSummary | null;
}

interface LiquidationContentProps {
  brigade: BrigadeDotationSummary;
  onClose: () => void;
  onSubmit: (brigadeId: string, dto: LiquidateDotationDto) => Promise<void>;
}

const LiquidationContent: React.FC<LiquidationContentProps> = ({
  brigade,
  onClose,
  onSubmit,
}) => {
  const [details, setDetails] = useState<FullBrigadeDotation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supplies, setSupplies] = useState<SupplyLiquidationItemDto[]>([]);
  const [equipments, setEquipments] = useState<EquipmentLiquidationItemDto[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    dotationService
      .getDotationDetails(brigade.brigadeId)
      .then((data) => {
        if (isMounted) {
          setDetails(data);
          setSupplies(
            data.supplyItems.map((item) => ({
              id: item.id,
              quantityDispensed: item.quantitySupplied,
              quantityReturned: 0,
              quantityWasted: 0,
            }))
          );
          setEquipments(
            data.equipmentItems.map((item) => ({
              id: item.id,
              conditionIn: 'OPTIMAL' as ItemCondition,
            }))
          );
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMessage(err instanceof Error ? err.message : 'Error al cargar detalles.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [brigade.brigadeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      setIsSubmitting(true);
      await onSubmit(brigade.brigadeId, {
        supplies,
        equipments,
      });
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al registrar liquidación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ClipboardCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Liquidación y Retorno: {brigade.brigadeName}
            </h2>
            <p className="text-xs text-slate-500">Conciliación de insumos dispensados y estado del equipo</p>
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

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Cargando dotación asignada...</div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Conciliación de Insumos */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Conciliación de Medicamentos / Consumibles
            </h3>
            {details?.supplyItems.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs"
              >
                <div className="flex justify-between items-center font-semibold text-slate-800">
                  <span>{item.stock.resource.name} (Lote: {item.stock.lotNumber})</span>
                  <span className="text-teal-700 font-mono">Despachado: {item.quantitySupplied} {item.stock.resource.unit}</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Dispensados en campo</label>
                    <input
                      type="number"
                      min="0"
                      max={item.quantitySupplied}
                      value={supplies[idx]?.quantityDispensed ?? 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSupplies((prev) =>
                          prev.map((s, i) => (i === idx ? { ...s, quantityDispensed: val } : s))
                        );
                      }}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Retornados a bodega</label>
                    <input
                      type="number"
                      min="0"
                      max={item.quantitySupplied}
                      value={supplies[idx]?.quantityReturned ?? 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSupplies((prev) =>
                          prev.map((s, i) => (i === idx ? { ...s, quantityReturned: val } : s))
                        );
                      }}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Mermas / Descarte</label>
                    <input
                      type="number"
                      min="0"
                      value={supplies[idx]?.quantityWasted ?? 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSupplies((prev) =>
                          prev.map((s, i) => (i === idx ? { ...s, quantityWasted: val } : s))
                        );
                      }}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Condición de Equipos */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Estado de Retorno de Instrumental
            </h3>
            {details?.equipmentItems.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-800">{item.equipment.name}</p>
                  <p className="text-slate-400 font-mono mt-0.5">{item.equipment.code}</p>
                </div>

                <div className="w-56">
                  <select
                    value={equipments[idx]?.conditionIn ?? 'OPTIMAL'}
                    onChange={(e) => {
                      const val = e.target.value as ItemCondition;
                      setEquipments((prev) =>
                        prev.map((eq, i) => (i === idx ? { ...eq, conditionIn: val } : eq))
                      );
                    }}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="OPTIMAL">Óptimo (Sin daños)</option>
                    <option value="GOOD">Bueno (Operativo)</option>
                    <option value="DAMAGED">Dañado (Mantenimiento)</option>
                    <option value="UNUSABLE">Inutilizable / Averiado</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
            >
              {isSubmitting ? 'Guardando Liquidación...' : 'Cerrar y Liquidar'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export const LiquidateDotationModal: React.FC<LiquidateDotationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  brigade,
}) => {
  if (!isOpen || !brigade) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <LiquidationContent
        key={brigade.brigadeId}
        brigade={brigade}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </div>
  );
};