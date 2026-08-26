// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/consultas/nueva/components/PasoPrescripcionReceta.tsx
// DESCRIPCIÓN: Paso 3 - Constructor de receta médica con alertas de farmacoseguridad.
// =========================================================================

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { PrescripcionMedicamentos, type PrescripcionItem } from './PrescripcionMedicamentos';
import type { PharmacologicalAlert } from '../utils/clinicalEngine';

export interface PasoPrescripcionRecetaProps {
  items: PrescripcionItem[];
  pharmacologicalAlerts?: PharmacologicalAlert[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, field: keyof PrescripcionItem, value: string) => void;
  disabled: boolean;
}

export const PasoPrescripcionReceta: React.FC<PasoPrescripcionRecetaProps> = ({
  items,
  pharmacologicalAlerts = [],
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  disabled,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in zoom-in-98 duration-150">
      {/* ALERTA DE SEGURIDAD FARMACOLÓGICA */}
      {pharmacologicalAlerts.length > 0 && (
        <div className="p-4 bg-rose-50 border-2 border-rose-500 rounded-2xl space-y-1.5 text-rose-900">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-700">
            <ShieldAlert size={18} className="text-rose-600 shrink-0" />
            <span>Alerta de Seguridad en la Prescripción</span>
          </div>
          <ul className="text-xs space-y-1 pl-5 list-disc font-bold text-rose-800">
            {pharmacologicalAlerts.map((c, idx) => (
              <li key={idx}>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-200 text-rose-900 mr-1 inline-block">
                  {c.type === 'ALERGIA_MAYOR' ? 'Alergia Mayor' : c.type === 'INTOLERANCIA' ? 'Intolerancia' : 'Precaución'}
                </span>
                {c.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <PrescripcionMedicamentos
        items={items}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
        onUpdateItem={onUpdateItem}
        disabled={disabled}
      />
    </div>
  );
};

export default PasoPrescripcionReceta;