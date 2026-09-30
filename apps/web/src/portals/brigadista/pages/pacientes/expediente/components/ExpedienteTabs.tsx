// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/expediente/components/ExpedienteTabs.tsx
// DESCRIPCIÓN: Pestañas clínicas 100% conectadas a PostgreSQL con barra única
//              deslizable sin controles duplicados ni datos simulados.
// =========================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Stethoscope,
  HeartPulse,
  Syringe,
  Pill,
  FlaskConical,
  CreditCard,
  CheckCircle2,
  Activity,
  ImageIcon,
  PlusCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Info,
} from 'lucide-react';
import type { PatientHistoryData, VitalSignsRecord } from '../../../../../../modules/patients';
import {
  vaccinationsService,
  ESQUEMA_MINSAL_2026_CATALOG,
} from '../../../../../../modules/vaccinations/services/vaccinations.service';
import type { VaccinationRecord } from '../../../../../../modules/vaccinations/types/vaccination.types';
import { ResumenPacienteTab } from './tabs/ResumenPacienteTab';
import { ConsultasPacienteTab } from './tabs/ConsultasPacienteTab';
import { SignosVitalesPacienteTab } from './tabs/SignosVitalesPacienteTab';
import { CarnetDigitalPacienteTab } from './tabs/CarnetDigitalPacienteTab';

interface ExpedienteTabsProps {
  historyData: PatientHistoryData;
}

type TabType =
  | 'resumen'
  | 'consultas'
  | 'vitals'
  | 'vacunas'
  | 'diagnosticos'
  | 'prescripciones'
  | 'laboratorios'
  | 'imagenes'
  | 'carnet';

function formatDate(d?: string | Date): string {
  if (!d) return 'Sin fecha';
  try {
    const dt = typeof d === 'string' ? new Date(d) : d;
    return dt.toLocaleDateString('es-SV', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(d);
  }
}

export const ExpedienteTabs: React.FC<ExpedienteTabsProps> = ({ historyData }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('resumen');

  const {
    patient,
    consultations = [],
    prescriptions = [],
    diagnoses = [],
    laboratoryStudies = [],
    medicalImagingStudies = [],
    standaloneVitalSigns = [],
  } = historyData;

  // Filtrar consultas puras excluyendo inmunizaciones
  const medicalConsultations = useMemo(() => {
    return consultations.filter(
      (c) =>
        !c.chiefComplaint?.includes('[VACUNACION]') &&
        !c.diagnosisDesc?.includes('[VACUNACION]') &&
        !c.diagnosisDesc?.toLowerCase().startsWith('inmunización')
    );
  }, [consultations]);

  // Carga reactiva de vacunas reales de PostgreSQL
  const [patientVaccinations, setPatientVaccinations] = useState<VaccinationRecord[]>([]);
  const [loadingVaccines, setLoadingVaccines] = useState<boolean>(false);
  const [showCatalogGuide, setShowCatalogGuide] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadRealVaccinations = async () => {
      if (!patient?.id) return;
      try {
        setLoadingVaccines(true);
        const records = await vaccinationsService.getPatientVaccinations(patient.id);
        if (isMounted) setPatientVaccinations(records);
      } catch (err) {
        console.error('Error al cargar vacunas reales:', err);
        if (isMounted) setPatientVaccinations([]);
      } finally {
        if (isMounted) setLoadingVaccines(false);
      }
    };

    void loadRealVaccinations();

    return () => {
      isMounted = false;
    };
  }, [patient?.id]);

  // Deduplicación de signos vitales por ID
  const allVitals = useMemo(() => {
    const map = new Map<string, VitalSignsRecord>();
    standaloneVitalSigns.forEach((v) => v?.id && map.set(v.id, v));
    consultations.forEach((c) => {
      if (Array.isArray(c.vitalSigns)) {
        c.vitalSigns.forEach((v) => v?.id && map.set(v.id, v));
      }
    });
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [consultations, standaloneVitalSigns]);

  const tabs = [
    { id: 'resumen', label: 'Resumen Ficha', shortLabel: 'Ficha', icon: User, count: null },
    { id: 'consultas', label: 'Consultas Médicas', shortLabel: 'Consultas', icon: Stethoscope, count: medicalConsultations.length },
    { id: 'vitals', label: 'Signos Vitales', shortLabel: 'Signos', icon: HeartPulse, count: allVitals.length },
    { id: 'vacunas', label: 'Vacunación MINSAL', shortLabel: 'Vacunas', icon: Syringe, count: patientVaccinations.length },
    { id: 'diagnosticos', label: 'Diagnósticos', shortLabel: 'Diagnósticos', icon: Activity, count: diagnoses.length },
    { id: 'prescripciones', label: 'Farmacoterapia', shortLabel: 'Recetas', icon: Pill, count: prescriptions.length },
    { id: 'laboratorios', label: 'Laboratorio Clínico', shortLabel: 'Laboratorio', icon: FlaskConical, count: laboratoryStudies.length },
    { id: 'imagenes', label: 'Imagenología', shortLabel: 'Rayos X', icon: ImageIcon, count: medicalImagingStudies.length },
    { id: 'carnet', label: 'Carnet Oficial QR', shortLabel: 'Carnet QR', icon: CreditCard, count: null },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Barra Única de Navegación Segmentada */}
      <nav
        aria-label="Pestañas del Expediente"
        className="bg-slate-100/90 p-1 sm:p-1.5 rounded-2xl border border-slate-200/80 flex items-center gap-1 overflow-x-auto scrollbar-none text-xs font-semibold shadow-2xs touch-pan-x"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-1.5 px-3 sm:py-2 sm:px-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 text-xs ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 shrink-0 ${
                  isActive ? 'text-[#1B5250]' : 'text-slate-400'
                }`}
              />
              <span className="inline sm:hidden">{tab.shortLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md border font-extrabold ${
                    tab.count > 0
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-200/80 text-slate-600 border-slate-300/60'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Vistas Clínicas */}
      <div className="animate-in fade-in duration-150">
        {activeTab === 'resumen' && <ResumenPacienteTab historyData={historyData} />}
        {activeTab === 'consultas' && (
          <ConsultasPacienteTab consultations={medicalConsultations} />
        )}
        {activeTab === 'vitals' && <SignosVitalesPacienteTab vitalSigns={allVitals} />}

        {/* TAB VACUNAS REALES */}
        {activeTab === 'vacunas' && (
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-3.5 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#1B5250] shrink-0">
                  <Syringe className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-base font-black text-slate-900 tracking-tight leading-snug">
                    Inmunizaciones Registradas
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                    Historial verificado en base de datos
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/brigadista/promocion-prevencion/vacunacion/registro?patientId=${patient.id}`
                  )
                }
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Aplicar Vacuna</span>
              </button>
            </div>

            {loadingVaccines ? (
              <div className="py-8 text-center space-y-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#2B7A78] mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Consultando registros...</p>
              </div>
            ) : patientVaccinations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {patientVaccinations.map((vac) => (
                  <div
                    key={vac.id}
                    className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-1.5 border-b border-slate-100 pb-1.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono text-[9px] font-black uppercase text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 shrink-0">
                            {vac.vaccineCode}
                          </span>
                          <h4 className="text-xs font-black text-slate-900 leading-snug truncate">
                            {vac.vaccineName}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          Dosis: <strong className="text-slate-800">{vac.doseNumber}</strong> de{' '}
                          {vac.totalDoses}
                        </p>
                      </div>

                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Aplicada</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-600">
                      <div>
                        <span className="font-bold uppercase text-slate-400 block text-[9px]">
                          Lote
                        </span>
                        <span className="font-mono font-bold text-slate-800 truncate block">
                          {vac.lotNumber || 'Sin lote'}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold uppercase text-slate-400 block text-[9px]">
                          Fecha
                        </span>
                        <span className="font-semibold text-slate-800 truncate block">
                          {formatDate(vac.administeredAt)}
                        </span>
                      </div>
                      <div className="col-span-2 text-[10px]">
                        <span className="font-bold uppercase text-slate-400 block text-[9px]">
                          Vía y Sitio
                        </span>
                        <span className="truncate block">
                          {vac.administrationRoute} • {vac.anatomicalSite}
                        </span>
                      </div>
                    </div>

                    {vac.notes && (
                      <p className="text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-100 italic">
                        {vac.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl space-y-1.5">
                <Syringe className="w-5 h-5 text-slate-400 mx-auto" />
                <h4 className="text-xs font-bold text-slate-800">
                  Sin vacunas aplicadas registradas
                </h4>
                <p className="text-[11px] text-slate-500">
                  No constan dosis administradas para esta persona en el padrón.
                </p>
              </div>
            )}

            {/* Guía Desplegable MINSAL */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCatalogGuide(!showCatalogGuide)}
                className="w-full p-2.5 bg-slate-50/90 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#2B7A78]" />
                  <span className="text-[11px]">Guía Técnica MINSAL 2026</span>
                </div>
                {showCatalogGuide ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {showCatalogGuide && (
                <div className="mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center gap-1.5 text-[10px] text-teal-800 bg-teal-50 border border-teal-200 p-2 rounded-lg font-medium">
                    <Info className="w-3.5 h-3.5 text-[#2B7A78] shrink-0" />
                    <span>Catálogo de referencia oficial para verificar esquemas diana[cite: 13].</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                    {ESQUEMA_MINSAL_2026_CATALOG.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 bg-white rounded-lg border border-slate-200 space-y-0.5 shadow-2xs text-[11px]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[9px] font-bold bg-slate-100 text-slate-700 px-1 py-0.2 rounded">
                            {item.code}
                          </span>
                          <span className="text-[9px] text-slate-400">{item.totalDoses} dosis</span>
                        </div>
                        <h5 className="font-bold text-slate-900 leading-snug">{item.name}</h5>
                        <p className="text-[10px] text-slate-500 truncate">{item.targetDisease}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB DIAGNÓSTICOS */}
        {activeTab === 'diagnosticos' && (
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-3.5 sm:p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Diagnósticos Clínicos Registrados
            </h3>

            {diagnoses.length > 0 ? (
              <div className="space-y-2">
                {diagnoses.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 flex items-start justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        {d.code && (
                          <span className="font-mono text-[10px] font-black text-teal-800 bg-teal-100 px-1.5 py-0.2 rounded">
                            {d.code}
                          </span>
                        )}
                        <h4 className="font-bold text-slate-900">{d.description}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Diagnosticado el {formatDate(d.diagnosedAt)}
                      </p>
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border shrink-0 ${
                        d.status === 'ACTIVE'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {d.status === 'ACTIVE' ? 'Activo' : 'Resuelto'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50/60 border border-dashed border-slate-200 rounded-xl space-y-1">
                <Activity className="w-5 h-5 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Sin diagnósticos formales</p>
                <p className="text-[10px] text-slate-400">
                  Se generarán al documentar atenciones médicas.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB RECETAS */}
        {activeTab === 'prescripciones' && (
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-3.5 sm:p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Prescripciones Farmacológicas
            </h3>

            {prescriptions.length > 0 ? (
              <div className="space-y-2.5">
                {prescriptions.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-mono font-bold text-[#1B5250]">{p.code}</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {p.status}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {p.items?.map((item) => (
                        <div
                          key={item.id}
                          className="p-2 bg-slate-50 rounded-lg border border-slate-100"
                        >
                          <p className="font-bold text-slate-900 text-[11px]">{item.medicine}</p>
                          <p className="text-[10px] text-slate-600">
                            {item.dosage} • {item.frequency} ({item.duration})
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50/60 border border-dashed border-slate-200 rounded-xl space-y-1">
                <Pill className="w-5 h-5 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Sin recetas activas</p>
                <p className="text-[10px] text-slate-400">
                  No constan fármacos prescritos para este paciente.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB LABORATORIOS */}
        {activeTab === 'laboratorios' && (
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-3.5 sm:p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Resultados de Laboratorio
            </h3>

            {laboratoryStudies.length > 0 ? (
              <div className="space-y-2.5">
                {laboratoryStudies.map((lab) => (
                  <div
                    key={lab.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <h4 className="font-bold text-slate-900 text-xs">{lab.name}</h4>
                      <span className="font-mono text-[10px] text-slate-500">{lab.code}</span>
                    </div>

                    {lab.analytes && (
                      <div className="grid grid-cols-2 gap-1.5">
                        {lab.analytes.map((a) => (
                          <div
                            key={a.id}
                            className="p-1.5 bg-slate-50 rounded border border-slate-100 text-[10px]"
                          >
                            <span className="text-slate-400 block">{a.name}</span>
                            <span className="font-bold text-slate-900">
                              {a.value} {a.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50/60 border border-dashed border-slate-200 rounded-xl space-y-1">
                <FlaskConical className="w-5 h-5 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Sin estudios de laboratorio</p>
                <p className="text-[10px] text-slate-400">
                  No constan análisis registrados en la red.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB IMAGENOLOGÍA */}
        {activeTab === 'imagenes' && (
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-3.5 sm:p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Imagenología y Rayos X
            </h3>

            {medicalImagingStudies.length > 0 ? (
              <div className="space-y-2">
                {medicalImagingStudies.map((img) => (
                  <div
                    key={img.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">{img.name}</h4>
                      <span className="text-[9px] font-bold uppercase bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.2 rounded">
                        {img.type}
                      </span>
                    </div>
                    {img.conclusion && (
                      <p className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                        {img.conclusion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50/60 border border-dashed border-slate-200 rounded-xl space-y-1">
                <ImageIcon className="w-5 h-5 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Sin estudios de imagen</p>
                <p className="text-[10px] text-slate-400">
                  No constan radiografías ni ultrasonidos.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB CARNET QR */}
        {activeTab === 'carnet' && <CarnetDigitalPacienteTab historyData={historyData} />}
      </div>
    </div>
  );
};

export default ExpedienteTabs;