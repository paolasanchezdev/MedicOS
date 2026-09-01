// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/registro/components/VacunacionAplicacionCard.tsx
// DESCRIPCIÓN: Formulario de trazabilidad técnica del lote, vencimiento, vía y sitio anatómico
//              con diseño institucional Admin Portal y altura fija nivelada con el Paso 1.
// =========================================================================

import React from 'react';
import {
  Layers,
  Calendar,
  Clock,
  Syringe,
  Target,
  Thermometer,
  Barcode,
  ShieldCheck,
} from 'lucide-react';
import type {
  AdministrationRoute,
  AnatomicalSite,
} from '../../../../../../../modules/vaccinations';

export interface VacunacionAplicacionCardProps {
  lotNumber: string;
  onLotChange: (lot: string) => void;
  expirationDate: string;
  onExpirationChange: (exp: string) => void;
  administrationRoute: AdministrationRoute;
  onRouteChange: (route: AdministrationRoute) => void;
  anatomicalSite: AnatomicalSite;
  onSiteChange: (site: AnatomicalSite) => void;
  administeredDate: string;
  onAdministeredDateChange: (date: string) => void;
  administeredTime: string;
  onAdministeredTimeChange: (time: string) => void;
}

export const VacunacionAplicacionCard: React.FC<VacunacionAplicacionCardProps> = ({
  lotNumber,
  onLotChange,
  expirationDate,
  onExpirationChange,
  administrationRoute,
  onRouteChange,
  anatomicalSite,
  onSiteChange,
  administeredDate,
  onAdministeredDateChange,
  administeredTime,
  onAdministeredTimeChange,
}) => {
  const isComplete = Boolean(lotNumber.trim() && expirationDate);

  return (
    <div className="group min-h-151.25 h-full bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      <div className="space-y-4.5">
        {/* 1. Cabecera de la Tarjeta */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs">
              <Layers className="w-5 h-5 stroke-2" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                2. Datos Técnicos del Biológico y Aplicación
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Trazabilidad de lote, fecha de vencimiento y vía anatómica
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200/80 rounded-xl shadow-2xs">
            <Thermometer className="w-3.5 h-3.5 text-teal-700" />
            <span>Cadena de Frío Activa</span>
          </div>
        </div>

        {/* 2. Cuadrícula de Campos Técnicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Número de Lote */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Barcode className="w-3.5 h-3.5 text-teal-600" />
              Número de Lote <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={lotNumber}
              onChange={(e) => onLotChange(e.target.value.toUpperCase())}
              placeholder="Ej. TD-2026-894X"
              className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs uppercase"
            />
          </div>

          {/* Fecha de Vencimiento */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              Fecha de Vencimiento del Frasco <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={expirationDate}
              onChange={(e) => onExpirationChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs cursor-pointer"
            />
          </div>

          {/* Vía de Administración */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Syringe className="w-3.5 h-3.5 text-teal-600" />
              Vía de Administración <span className="text-rose-500">*</span>
            </label>
            <select
              value={administrationRoute}
              onChange={(e) => onRouteChange(e.target.value as AdministrationRoute)}
              className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs cursor-pointer"
            >
              <option value="INTRAMUSCULAR">Intramuscular (IM)</option>
              <option value="SUBCUTANEOUS">Subcutánea (SC)</option>
              <option value="INTRADERMAL">Intradérmica (ID)</option>
              <option value="ORAL">Oral</option>
            </select>
          </div>

          {/* Sitio Anatómico */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-teal-600" />
              Sitio Anatómico <span className="text-rose-500">*</span>
            </label>
            <select
              value={anatomicalSite}
              onChange={(e) => onSiteChange(e.target.value as AnatomicalSite)}
              className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs cursor-pointer"
            >
              <option value="DELTOIDES_IZQUIERDO">Brazo Izquierdo (Deltoides)</option>
              <option value="DELTOIDES_DERECHO">Brazo Derecho (Deltoides)</option>
              <option value="VASTO_LATERAL_IZQUIERDO">Muslo Izquierdo</option>
              <option value="VASTO_LATERAL_DERECHO">Muslo Derecho</option>
              <option value="ORAL">Oral</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          {/* Fecha de Aplicación */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Fecha de Aplicación
            </label>
            <input
              type="date"
              value={administeredDate}
              onChange={(e) => onAdministeredDateChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs cursor-pointer"
            />
          </div>

          {/* Hora de Aplicación */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Hora de Aplicación
            </label>
            <input
              type="time"
              value={administeredTime}
              onChange={(e) => onAdministeredTimeChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs cursor-pointer"
            />
          </div>
        </div>

        {/* 3. Panel de Verificación de Cadena de Frío y Bioseguridad */}
        <div className="p-4.5 rounded-2xl bg-teal-50/80 border border-teal-200/80 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-950">
            <ShieldCheck className="w-4.5 h-4.5 text-teal-700" />
            <span>Normativa de Bioseguridad y Cadena de Frío (MINSAL 2026)</span>
          </div>
          <p className="text-xs text-teal-900/90 leading-relaxed">
            Verifica que la temperatura del termo portátil se mantenga en rango normativo (
            <strong className="font-extrabold text-teal-950">+2°C a +8°C</strong>). Inspecciona la integridad física del vial, homogeneidad de la suspensión y fecha de caducidad antes de la punción.
          </p>
        </div>
      </div>

      {/* 4. Footer Alineado con el Paso 1 */}
      <div className="mt-4.5 pt-3.5 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
        <span>
          Trazabilidad:{' '}
          {isComplete
            ? 'Lote y caducidad validados'
            : 'Pendiente completar lote y vencimiento'}
        </span>
        <span className="font-bold text-teal-800">Paso 2 de 4</span>
      </div>
    </div>
  );
};

export default VacunacionAplicacionCard;