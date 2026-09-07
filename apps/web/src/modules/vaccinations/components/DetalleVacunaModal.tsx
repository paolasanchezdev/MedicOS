// =========================================================================
// ARCHIVO: apps/web/src/modules/vaccinations/components/DetalleVacunaModal.tsx
// DESCRIPCIÓN: Modal clínico oficial reutilizable en todos los portales.
// =========================================================================

import React from 'react';
import { X, ShieldCheck, Tag, Calendar, MapPin, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { VaccinationRecord } from '../types/vaccination.types.js';

interface DetalleVacunaModalProps {
  record: VaccinationRecord | null;
  targetDisease?: string;
  onClose: () => void;
}

export const DetalleVacunaModal: React.FC<DetalleVacunaModalProps> = ({
  record,
  targetDisease,
  onClose,
}) => {
  if (!record) return null;

  const fechaAplicacionStr = new Date(record.administeredAt || record.createdAt).toLocaleDateString(
    'es-ES',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  const formatRoute = (route: string) => {
    switch (route) {
      case 'INTRAMUSCULAR':
        return 'Intramuscular (IM)';
      case 'SUBCUTANEOUS':
        return 'Subcutánea (SC)';
      case 'INTRADERMAL':
        return 'Intradérmica (ID)';
      case 'ORAL':
        return 'Vía Oral';
      default:
        return route;
    }
  };

  const formatSite = (site: string) => {
    return site.replace(/_/g, ' ').toLowerCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="bg-linear-to-r from-[#2B7A78] to-[#1B5250] text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[10.5px] font-bold text-teal-100">
              <ShieldCheck className="w-3 h-3" />
              Certificado Oficial de Vacunación
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
              {record.vaccineName}
            </h2>
            <p className="text-xs text-teal-100/90 font-medium">
              Código: {record.vaccineCode} &bull; Dosis {record.doseNumber} de {record.totalDoses}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-teal-100 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido Clínico */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Protección / Enfermedad Diana */}
          <div className="bg-teal-50/70 border border-teal-200/70 rounded-2xl p-3.5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#2B7A78] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#1B5250]">Enfermedades que Previene</p>
              <p className="text-xs text-slate-700 font-medium mt-0.5">
                {targetDisease || 'Protección inmunológica contra patologías según lineamiento nacional.'}
              </p>
            </div>
          </div>

          {/* Grilla de Datos Técnicos */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Fecha de Aplicación
              </span>
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2B7A78]" />
                {fechaAplicacionStr}
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Número de Lote
              </span>
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                {record.lotNumber}
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Vía de Administración
              </span>
              <p className="font-bold text-slate-800 capitalize">
                {formatRoute(record.administrationRoute)}
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Sitio Anatómico
              </span>
              <p className="font-bold text-slate-800 capitalize">
                {formatSite(record.anatomicalSite)}
              </p>
            </div>
          </div>

          {/* Profesional y Establecimiento */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">Aplicado por:</span>
                <span className="font-bold text-slate-800">
                  {record.doctor
                    ? `Dr(a). ${record.doctor.firstName} ${record.doctor.lastName}`
                    : 'Personal de Enfermería / Brigadista Autorizado'}
                </span>
              </div>
            </div>

            {record.brigade?.name && (
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <MapPin className="w-4 h-4 text-[#2B7A78] shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">Lugar de aplicación:</span>
                  <span className="font-bold text-slate-800">{record.brigade.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Observaciones o Reacciones */}
          {record.notes && (
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Observaciones Médicas
              </span>
              <p className="text-slate-700 font-medium">{record.notes}</p>
            </div>
          )}

          {record.adverseReactions && (
            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl text-xs space-y-1 text-rose-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Reacciones Adversas Documentadas
              </span>
              <p className="font-medium">{record.adverseReactions}</p>
            </div>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Registro inalterable y validado</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Cerrar ficha
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleVacunaModal;