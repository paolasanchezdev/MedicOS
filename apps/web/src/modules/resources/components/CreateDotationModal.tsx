// apps/web/src/modules/resources/components/CreateDotationModal.tsx
import React, { useState, useEffect } from 'react';
import { X, BriefcaseMedical, Plus, Trash2, AlertCircle } from 'lucide-react';
import { resourcesService } from '../services/resources.service';
import { equipmentService } from '../services/equipment.service';
import { devicesService } from '../services/devices.service';
import type {
  BrigadeDotationSummary,
  ResourceWithMetrics,
  MedicalEquipment,
  DeviceItem,
  CreateDotationDto,
  SupplyDispatchItemDto,
  EquipmentDispatchItemDto,
  DeviceDispatchItemDto,
} from '../types/resource.types';

interface CreateDotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateDotationDto) => Promise<void>;
  brigades: BrigadeDotationSummary[];
}

interface DispatchFormProps {
  brigades: BrigadeDotationSummary[];
  onClose: () => void;
  onSubmit: (dto: CreateDotationDto) => Promise<void>;
}

const DispatchForm: React.FC<DispatchFormProps> = ({ brigades, onClose, onSubmit }) => {
  const [brigadeId, setBrigadeId] = useState(brigades[0]?.brigadeId || '');
  const [availableResources, setAvailableResources] = useState<ResourceWithMetrics[]>([]);
  const [availableEquipment, setAvailableEquipment] = useState<MedicalEquipment[]>([]);
  const [availableDevices, setAvailableDevices] = useState<DeviceItem[]>([]);

  const [selectedSupplies, setSelectedSupplies] = useState<SupplyDispatchItemDto[]>([]);
  const [selectedEquipments, setSelectedEquipments] = useState<EquipmentDispatchItemDto[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<DeviceDispatchItemDto[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      resourcesService.getResources({ stockStatus: 'AVAILABLE' }),
      equipmentService.getEquipments({ status: 'OPERATIONAL' }),
      devicesService.getDevices({ status: 'ACTIVE' }),
    ])
      .then(([resList, eqList, devList]) => {
        if (isMounted) {
          setAvailableResources(resList);
          setAvailableEquipment(eqList);
          setAvailableDevices(devList);
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddSupplyRow = () => {
    const firstStockId = availableResources[0]?.stocks?.[0]?.id || '';
    if (!firstStockId) return;
    setSelectedSupplies((prev) => [
      ...prev,
      { stockId: firstStockId, quantitySupplied: 10, notes: '' },
    ]);
  };

  const handleRemoveSupplyRow = (index: number) => {
    setSelectedSupplies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddEquipmentRow = () => {
    const firstEqId = availableEquipment[0]?.id || '';
    if (!firstEqId) return;
    setSelectedEquipments((prev) => [
      ...prev,
      { equipmentId: firstEqId, conditionOut: 'OPTIMAL', notes: '' },
    ]);
  };

  const handleRemoveEquipmentRow = (index: number) => {
    setSelectedEquipments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddDeviceRow = () => {
    const firstDevId = availableDevices[0]?.id || '';
    if (!firstDevId) return;
    setSelectedDevices((prev) => [
      ...prev,
      { deviceId: firstDevId, roleInBrigade: 'Estación Principal' },
    ]);
  };

  const handleRemoveDeviceRow = (index: number) => {
    setSelectedDevices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!brigadeId) {
      setErrorMessage('Debes seleccionar una brigada de destino.');
      return;
    }

    if (
      selectedSupplies.length === 0 &&
      selectedEquipments.length === 0 &&
      selectedDevices.length === 0
    ) {
      setErrorMessage('Debes asignar al menos un insumo, equipo médico o dispositivo.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        brigadeId,
        supplies: selectedSupplies,
        equipments: selectedEquipments,
        devices: selectedDevices,
      });
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al despachar dotación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
            <BriefcaseMedical className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Nueva Dotación y Despacho a Brigada
            </h2>
            <p className="text-xs text-slate-500">Asignación de kits de medicamentos, equipos y terminales</p>
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

      <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Selección de Brigada */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Brigada de Destino *
          </label>
          <select
            value={brigadeId}
            onChange={(e) => setBrigadeId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 bg-white"
          >
            {brigades.map((b) => (
              <option key={b.brigadeId} value={b.brigadeId}>
                {b.brigadeName} ({b.municipality}, {b.department}) - Resp: {b.responsibleName}
              </option>
            ))}
          </select>
        </div>

        {/* Sección Medicamentos e Insumos */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Medicamentos e Insumos por Lote
            </h3>
            <button
              type="button"
              onClick={handleAddSupplyRow}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Ítem
            </button>
          </div>

          {selectedSupplies.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No hay medicamentos asignados para este kit.</p>
          ) : (
            <div className="space-y-2">
              {selectedSupplies.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <div className="flex-1">
                    <select
                      value={item.stockId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedSupplies((prev) =>
                          prev.map((s, i) => (i === idx ? { ...s, stockId: val } : s))
                        );
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    >
                      {availableResources.flatMap((res) =>
                        (res.stocks || []).map((stk) => (
                          <option key={stk.id} value={stk.id}>
                            {res.name} — Lote: {stk.lotNumber} (Disp: {stk.quantityAvailable} {res.unit})
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="w-28">
                    <input
                      type="number"
                      min="1"
                      placeholder="Cant."
                      value={item.quantitySupplied}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSelectedSupplies((prev) =>
                          prev.map((s, i) => (i === idx ? { ...s, quantitySupplied: val } : s))
                        );
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSupplyRow(idx)}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección Instrumental Médico */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Instrumental y Equipos Médicos
            </h3>
            <button
              type="button"
              onClick={handleAddEquipmentRow}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Equipo
            </button>
          </div>

          {selectedEquipments.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No hay instrumental asignado.</p>
          ) : (
            <div className="space-y-2">
              {selectedEquipments.map((eq, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <div className="flex-1">
                    <select
                      value={eq.equipmentId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedEquipments((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, equipmentId: val } : item))
                        );
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    >
                      {availableEquipment.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.code} - {e.name} (S/N: {e.serialNumber || 'N/A'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveEquipmentRow(idx)}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección Dispositivos */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Hardware y Terminales Tecnológicas
            </h3>
            <button
              type="button"
              onClick={handleAddDeviceRow}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Dispositivo
            </button>
          </div>

          {selectedDevices.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No hay hardware asignado.</p>
          ) : (
            <div className="space-y-2">
              {selectedDevices.map((dev, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <div className="flex-1">
                    <select
                      value={dev.deviceId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedDevices((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, deviceId: val } : item))
                        );
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    >
                      {availableDevices.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.serialNumber}) - {d.operatingSystem}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveDeviceRow(idx)}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
          >
            {isSubmitting ? 'Procesando Despacho...' : 'Despachar Dotación'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const CreateDotationModal: React.FC<CreateDotationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  brigades,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <DispatchForm
        key="create-dotation-form"
        brigades={brigades}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </div>
  );
};