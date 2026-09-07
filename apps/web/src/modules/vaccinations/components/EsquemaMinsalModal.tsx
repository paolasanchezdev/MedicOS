// =========================================================================
// ARCHIVO: apps/web/src/modules/vaccinations/components/EsquemaMinsalModal.tsx
// DESCRIPCIÓN: Visor oficial del afiche MINSAL 2026 con póster gráfico superior,
//              zoom interactivo y catálogo clínico con espaciado amplio.
// =========================================================================

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  ZoomIn,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ESQUEMA_MINSAL_2026_CATALOG } from '../services/vaccinations.service.js';

interface EsquemaMinsalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EsquemaMinsalModal: React.FC<EsquemaMinsalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [isPosterZoomed, setIsPosterZoomed] = useState<boolean>(false);

  if (!isOpen) return null;

  const grupos = [
    { id: 'ALL', label: 'Todos los biológicos (22)' },
    { id: 'RECIEN_NACIDO', label: 'Recién Nacidos' },
    { id: 'LACTANTES', label: '2, 4 y 6 meses' },
    { id: '12_18_MESES', label: '12 a 18 meses' },
    { id: '4_ANOS', label: '4 años' },
    { id: 'VPH', label: 'VPH (9 a 18 años / Mujeres)' },
    { id: 'ADULTOS', label: 'Adolescentes y Adultos' },
    { id: 'EMBARAZADAS', label: 'Mujeres Embarazadas' },
    { id: 'CRONICOS', label: 'Mayores y Crónicos' },
  ];

  const filteredCatalog = ESQUEMA_MINSAL_2026_CATALOG.filter((item) => {
    if (selectedGroup === 'ALL') return true;
    if (selectedGroup === 'RECIEN_NACIDO') return item.minAgeMonths === 0 && item.maxAgeMonths === 1;
    if (selectedGroup === 'LACTANTES') return item.minAgeMonths >= 2 && item.minAgeMonths <= 6;
    if (selectedGroup === '12_18_MESES') return item.minAgeMonths >= 12 && item.minAgeMonths <= 18;
    if (selectedGroup === '4_ANOS') return item.minAgeMonths === 48;
    if (selectedGroup === 'VPH') return item.code.startsWith('VPH');
    if (selectedGroup === 'EMBARAZADAS') return item.code.includes('MAT') || item.code === 'TDPA';
    if (selectedGroup === 'CRONICOS') return item.minAgeMonths >= 720 || item.code.includes('ADULT');
    return true;
  });

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div
          className="bg-slate-50 rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. Cabecera Institucional Amplia */}
          <div className="bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] text-white p-5 sm:p-6 flex items-start justify-between shrink-0 shadow-sm">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-teal-100">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Lineamiento Oficial &bull; MINSAL &bull; SIS &bull; UNICEF &bull; OPS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Esquema Nacional de Vacunación 2026
              </h2>
              <p className="text-xs sm:text-sm text-teal-100/90 font-medium">
                República de El Salvador &bull; Comité Asesor de Prácticas de Inmunización
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-teal-100 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer shrink-0"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Cuerpo con scroll holgado */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
            {/* SECCIÓN DEL PÓSTER OFICIAL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2B7A78]" />
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Póster Oficial de Inmunizaciones 2026
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  Haz clic sobre la imagen para ver en pantalla completa
                </span>
              </div>

              <div
                onClick={() => setIsPosterZoomed(true)}
                className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-300 transition-all cursor-zoom-in"
              >
                <img
                  src="/images/esquema-vacunacion-minsal-2026.png"
                  alt="Esquema de Vacunación 2026 Oficial MINSAL El Salvador"
                  className="w-full h-auto max-h-72 sm:max-h-96 object-contain mx-auto bg-slate-900/5 group-hover:scale-[1.01] transition-transform duration-300"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-md text-white rounded-xl text-xs font-bold shadow-lg">
                    <ZoomIn className="w-4 h-4" />
                    Ampliar Afiche Oficial
                  </span>
                </div>
              </div>
            </div>

            {/* SECCIÓN DE BIOLÓGICOS DETALLADOS */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#2B7A78]" />
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Catálogo de Biológicos y Dosis por Etapa
                  </span>
                </div>

                <span className="text-xs font-bold text-[#2B7A78] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/70 self-start sm:self-auto">
                  {filteredCatalog.length} vacuna(s) disponible(s)
                </span>
              </div>

              {/* Filtro segmentado de grupos etarios */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                {grupos.map((g) => {
                  const isActive = selectedGroup === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGroup(g.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer select-none ${
                        isActive
                          ? 'bg-[#2B7A78] text-white shadow-2xs'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/90'
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>

              {/* Cuadrícula de tarjetas clínicas con espaciado amplio */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredCatalog.map((v) => (
                  <div
                    key={v.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between hover:border-teal-300 hover:shadow-xs transition-all shadow-2xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                          {v.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-[#2B7A78] border border-teal-200/80 shrink-0">
                          {v.totalDoses} dosis
                        </span>
                      </div>

                      <p className="text-xs text-teal-800 font-semibold leading-snug">
                        {v.targetDisease}
                      </p>

                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        {v.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {v.route}
                      </span>
                      <span className="font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                        {v.isRequired ? 'Obligatoria' : 'Preventiva'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Pie del Modal */}
          <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Fuente: Ministerio de Salud de El Salvador (MINSAL 2026).</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
            >
              Cerrar visor
            </button>
          </div>
        </div>
      </div>

      {/* MODAL LIGHTBOX / ZOOM COMPLETO DEL AFICHE */}
      {isPosterZoomed && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
          onClick={() => setIsPosterZoomed(false)}
        >
          <div className="w-full max-w-7xl flex items-center justify-between mb-3 px-2 text-white">
            <span className="text-xs font-bold tracking-wide">
              Esquema de Vacunación 2026 &bull; Afiche de Alta Resolución
            </span>
            <button
              type="button"
              onClick={() => setIsPosterZoomed(false)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              aria-label="Cerrar vista completa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            className="max-w-7xl max-h-[88vh] overflow-auto rounded-2xl bg-slate-950 p-2 border border-slate-800 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="/images/esquema-vacunacion-minsal-2026.png"
              alt="Esquema de Vacunación 2026 Oficial MINSAL El Salvador"
              className="max-w-full max-h-[82vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EsquemaMinsalModal;