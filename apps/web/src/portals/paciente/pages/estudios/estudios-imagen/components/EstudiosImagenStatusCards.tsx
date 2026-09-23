// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/estudios/estudios-imagen/components/EstudiosImagenStatusCards.tsx
// DESCRIPCIÓN: 4 tarjetas de resumen clínico para Estudios de Imagen Médica.
// =========================================================================

import React from 'react';
import { Crosshair, FileCheck2, Activity, Building2, ChevronRight } from 'lucide-react';
import type { MedicalImagingStudy } from '../../../../../../modules/medical-imaging/index.js';

interface EstudiosImagenStatusCardsProps {
  studies: MedicalImagingStudy[];
  onSelectType?: (type: string) => void;
}

export const EstudiosImagenStatusCards: React.FC<EstudiosImagenStatusCardsProps> = ({
  studies,
}) => {
  const xrayCount = studies.filter((s) => s.type === 'XRAY').length;
  const ultrasoundCount = studies.filter((s) => s.type === 'ULTRASOUND').length;
  const advancedCount = studies.filter((s) => s.type === 'TOMOGRAPHY' || s.type === 'RESONANCE').length;
  const otherCount = studies.length - xrayCount - ultrasoundCount - advancedCount;

  const completedCount = studies.filter((s) => s.status === 'COMPLETED').length;
  const pendingCount = studies.filter((s) => s.status === 'PENDING').length;
  const withImageCount = studies.filter((s) => s.hasImage).length;

  const uniqueRegions = new Set(studies.map((s) => s.bodyRegion.toLowerCase())).size;
  const uniqueEstablishments = new Set(studies.map((s) => s.establishmentName)).size;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 select-none">
      {/* TARJETA 1: MODALIDADES DIAGNÓSTICAS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-teal-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-medicos-teal">
              <Crosshair className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-medicos-teal border border-teal-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-medicos-teal" />
              {studies.length} Estudios
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Estudios de Imagen
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {studies.length}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Radiografías convencionales</span>
              <span className="font-bold text-slate-800">{xrayCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Ultrasonidos / Ecografías</span>
              <span className="font-bold text-slate-800">{ultrasoundCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>TAC / Resonancias / Otros</span>
              <span className="font-bold text-slate-800">{advancedCount + Math.max(0, otherCount)}</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Pruebas imagenológicas documentadas</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 2: INFORMES RADIOLÓGICOS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-emerald-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {completedCount} Disponibles
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Informes Validados
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {completedCount}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Conclusión médica emitida</span>
              <span className="font-bold text-slate-800">{completedCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Con captura/imagen adjunta</span>
              <span className="font-bold text-slate-800">{withImageCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Estudios en procesamiento</span>
              <span className="font-bold text-slate-800">{pendingCount}</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Impresión médica oficial</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 3: REGIONES ANATÓMICAS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-indigo-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Activity className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Topografía
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Regiones Evaluadas
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {uniqueRegions}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Tórax y aparato respiratorio</span>
              <span className="font-bold text-slate-800">
                {studies.filter((s) => s.bodyRegion.toLowerCase().includes('tórax') || s.bodyRegion.toLowerCase().includes('torax')).length}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Abdomen y pélvico</span>
              <span className="font-bold text-slate-800">
                {studies.filter((s) => s.bodyRegion.toLowerCase().includes('abdomen')).length}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Extremidades y articulaciones</span>
              <span className="font-bold text-slate-800">
                {studies.filter((s) => !s.bodyRegion.toLowerCase().includes('tórax') && !s.bodyRegion.toLowerCase().includes('torax') && !s.bodyRegion.toLowerCase().includes('abdomen')).length}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Localización anatómica registrada</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 4: RED RADIOLÓGICA */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-sky-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              Red de Salud
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Centros Emisores
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {uniqueEstablishments}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Hospitales y clínicas de red</span>
              <span className="font-bold text-slate-800">{uniqueEstablishments}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Jornadas en brigadas médicas</span>
              <span className="font-bold text-slate-800">
                {studies.filter((s) => s.establishmentName.toLowerCase().includes('brigada')).length}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Trazabilidad digital</span>
              <span className="font-bold text-emerald-700">100%</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Establecimientos autorizados</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

export default EstudiosImagenStatusCards;