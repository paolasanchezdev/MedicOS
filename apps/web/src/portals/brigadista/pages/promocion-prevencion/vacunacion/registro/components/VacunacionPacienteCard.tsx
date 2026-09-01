// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/registro/components/VacunacionPacienteCard.tsx
// DESCRIPCIÓN: Identificación de la persona a vacunar con búsqueda aislada por fila (group/patient)
//              para evitar activación global de cheques al pasar el cursor sobre la tarjeta.
// =========================================================================

import React, { useMemo } from 'react';
import {
  User,
  Search,
  Check,
  RefreshCw,
  AlertCircle,
  MapPin,
  AlertTriangle,
  Activity,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { useSearchPatients, type PatientRecord, type BloodType } from '../../../../../../../modules/patients';

export interface VacunacionPacienteCardProps {
  selectedPatient: PatientRecord | null;
  onSelectPatient: (patient: PatientRecord | null) => void;
}

export const VacunacionPacienteCard: React.FC<VacunacionPacienteCardProps> = ({
  selectedPatient,
  onSelectPatient,
}) => {
  const { query, setQuery, results, loading, executeSearch, clearSearch } = useSearchPatients();

  const handleSearch = (val: string) => {
    setQuery(val);
    void executeSearch(val);
  };

  const handleReset = () => {
    clearSearch();
    onSelectPatient(null);
  };

  // Formateador amigable de tipo de sangre
  const formatBloodType = (bt?: BloodType | string | null): string | null => {
    if (!bt || bt === 'UNKNOWN') return null;
    const map: Record<string, string> = {
      A_POSITIVE: 'A+',
      A_NEGATIVE: 'A-',
      B_POSITIVE: 'B+',
      B_NEGATIVE: 'B-',
      O_POSITIVE: 'O+',
      O_NEGATIVE: 'O-',
      AB_POSITIVE: 'AB+',
      AB_NEGATIVE: 'AB-',
    };
    return map[bt] || bt;
  };

  // Cálculo de edad
  const age = useMemo(() => {
    if (!selectedPatient?.dateOfBirth) return null;
    const dob = new Date(selectedPatient.dateOfBirth);
    if (isNaN(dob.getTime())) return null;
    const today = new Date();
    let calculatedAge = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      calculatedAge--;
    }
    return calculatedAge >= 0 ? calculatedAge : null;
  }, [selectedPatient]);

  // Limpieza y deduplicación de segmentos repetidos en la dirección
  const cleanedAddress = useMemo(() => {
    if (!selectedPatient?.address) return 'Sin dirección registrada';
    const parts = selectedPatient.address
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const uniqueParts: string[] = [];
    const seen = new Set<string>();

    for (const part of parts) {
      const lower = part.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        uniqueParts.push(part);
      }
    }
    return uniqueParts.join(', ');
  }, [selectedPatient]);

  // Extracción y parseo de información médica desde clinicalRecord y observaciones
  const clinicalInfo = useMemo(() => {
    if (!selectedPatient) return { allergies: [], chronicConditions: [], otherNotes: null, bloodType: null };

    const anyPatient = selectedPatient as unknown as Record<string, unknown>;
    const cr = selectedPatient.clinicalRecord;

    const allergiesList: string[] = [];
    const chronicList: string[] = [];
    let otherNotes: string | null = null;

    // 1. Verificación directa de campos
    if (Array.isArray(anyPatient.allergies)) {
      allergiesList.push(...(anyPatient.allergies as string[]));
    } else if (typeof anyPatient.allergies === 'string' && anyPatient.allergies.trim()) {
      allergiesList.push(anyPatient.allergies.trim());
    }

    if (Array.isArray(anyPatient.chronicDiseases || anyPatient.chronicConditions)) {
      chronicList.push(...((anyPatient.chronicDiseases || anyPatient.chronicConditions) as string[]));
    } else if (
      typeof (anyPatient.chronicDiseases || anyPatient.chronicConditions) === 'string' &&
      (anyPatient.chronicDiseases || anyPatient.chronicConditions)
    ) {
      chronicList.push(String(anyPatient.chronicDiseases || anyPatient.chronicConditions).trim());
    }

    // 2. Parseo desde clinicalRecord.observations
    const obs = cr?.observations;
    if (obs && typeof obs === 'string') {
      const segments = obs.split('|').map((s) => s.trim()).filter(Boolean);
      const remainingSegments: string[] = [];

      for (const seg of segments) {
        const lower = seg.toLowerCase();
        if (lower.startsWith('alergias:')) {
          const val = seg.substring(seg.indexOf(':') + 1).trim();
          if (val && !['ninguna', 'ninguno', 'no', 'sin alergias'].includes(val.toLowerCase())) {
            val.split(/[,;]/).map((s) => s.trim()).filter(Boolean).forEach((a) => allergiesList.push(a));
          }
        } else if (lower.startsWith('enfermedades crónicas:') || lower.startsWith('enfermedades cronicas:')) {
          const val = seg.substring(seg.indexOf(':') + 1).trim();
          if (val && !['ninguna', 'ninguno', 'no', 'sin enfermedades'].includes(val.toLowerCase())) {
            val.split(/[,;]/).map((s) => s.trim()).filter(Boolean).forEach((c) => chronicList.push(c));
          }
        } else {
          remainingSegments.push(seg);
        }
      }

      if (remainingSegments.length > 0) {
        otherNotes = remainingSegments.join(' • ');
      }
    }

    const extraHist = [cr?.surgicalHistory, cr?.familyHistory].filter(Boolean);
    if (extraHist.length > 0) {
      otherNotes = otherNotes ? `${otherNotes} • ${extraHist.join(' • ')}` : extraHist.join(' • ');
    }

    return {
      allergies: Array.from(new Set(allergiesList)),
      chronicConditions: Array.from(new Set(chronicList)),
      otherNotes,
      bloodType: formatBloodType(cr?.bloodType),
    };
  }, [selectedPatient]);

  return (
    <div className="h-full bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 sm:p-5.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Cabecera de la Tarjeta */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs">
              <User className="w-5 h-5 stroke-2" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Persona a Vacunar
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Padrón comunitario y antecedentes clínicos
              </p>
            </div>
          </div>

          {selectedPatient && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100/80 border border-teal-200/80 rounded-xl transition active:scale-95 cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Cambiar</span>
            </button>
          )}
        </div>

        {/* Contenido: Buscador o Ficha Clínica */}
        {!selectedPatient ? (
          <div className="space-y-3 pt-0.5">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar paciente por nombre completo o DUI..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs"
              />
            </div>

            {loading && (
              <p className="text-xs text-slate-400 font-medium text-center py-2.5 animate-pulse">
                Buscando registros en base de datos...
              </p>
            )}

            {results.length > 0 ? (
              <div className="space-y-2 max-h-97.5 overflow-y-auto pr-1">
                {results.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectPatient(p)}
                    className="group/patient w-full p-3 rounded-xl text-left bg-slate-50/70 hover:bg-teal-50/90 border border-slate-200/70 hover:border-teal-300 transition-all flex items-center justify-between gap-3 cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-700 border border-teal-500/20 flex items-center justify-center font-extrabold text-xs shrink-0 group-hover/patient:bg-[#2B7A78] group-hover/patient:text-white transition">
                        {p.firstName ? p.firstName.charAt(0).toUpperCase() : 'P'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover/patient:text-[#1B5250] truncate">
                          {p.firstName} {p.lastName}
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {p.dui ? `DUI: ${p.dui}` : 'Sin DUI registrado'}
                        </p>
                      </div>
                    </div>

                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 opacity-0 group-hover/patient:opacity-100 flex items-center justify-center transition shrink-0 shadow-2xs">
                      <Check className="w-3.5 h-3.5 stroke-3" />
                    </span>
                  </div>
                ))}
              </div>
            ) : query.trim().length > 0 && !loading ? (
              <div className="p-6 text-center text-xs sm:text-sm text-slate-400 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
                <AlertCircle className="w-6 h-6 text-slate-300 mx-auto" />
                <p>No se encontraron pacientes con ese criterio.</p>
              </div>
            ) : (
              <div className="p-8 text-center text-xs sm:text-sm text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200/80 space-y-1.5">
                <User className="w-8 h-8 text-slate-300 mx-auto stroke-1" />
                <p className="font-medium">Ingresa el nombre o DUI para asociar la vacuna.</p>
              </div>
            )}
          </div>
        ) : (
          /* Ficha Completa del Paciente Seleccionado */
          <div className="space-y-3 pt-0.5 animate-in fade-in duration-200">
            {/* 1. Header del Paciente */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div className="w-11 h-11 rounded-xl bg-linear-to-br from-teal-600 to-[#1B5250] text-white flex items-center justify-center font-black text-base shrink-0 shadow-2xs">
                {selectedPatient.firstName ? selectedPatient.firstName.charAt(0).toUpperCase() : 'P'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Padrón Verificado
                  </span>
                  {clinicalInfo.bloodType && (
                    <span className="text-[11px] font-black text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-md">
                      Grupo {clinicalInfo.bloodType}
                    </span>
                  )}
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 truncate mt-0.5">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </h4>
              </div>
            </div>

            {/* 2. Ficha de Identificación Rápida */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-600 shadow-2xs">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">DUI</span>
                <span className="font-mono font-bold text-slate-800 text-xs sm:text-sm truncate block mt-0.5">
                  {selectedPatient.dui || 'Sin DUI'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-600 shadow-2xs">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Sexo / Edad</span>
                <span className="font-bold text-slate-800 text-xs sm:text-sm truncate block mt-0.5">
                  {selectedPatient.sex === 'FEMALE' ? 'Femenino' : selectedPatient.sex === 'MALE' ? 'Masculino' : 'Otro'} {age !== null ? `• ${age} años` : ''}
                </span>
              </div>
            </div>

            {/* 3. Bloque Clínico Prevacunal: Alergias y Condiciones */}
            <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2 shadow-2xs">
              {/* Alergias */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Alergias Conocidas
                </span>
                {clinicalInfo.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {clinicalInfo.allergies.map((alg, i) => (
                      <span
                        key={i}
                        className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-md"
                      >
                        {alg}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50/90 border border-emerald-200/70 px-2.5 py-1 rounded-lg inline-block">
                    Sin alergias severas reportadas
                  </span>
                )}
              </div>

              {/* Condiciones Médicas */}
              <div className="pt-1.5 border-t border-slate-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                  <Activity className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Condiciones / Diagnósticos
                </span>
                {clinicalInfo.chronicConditions.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {clinicalInfo.chronicConditions.map((cond, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md shadow-2xs"
                      >
                        {cond}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs font-medium text-slate-500">
                    Sin patologías crónicas registradas
                  </span>
                )}
              </div>

              {/* Notas Médicas Recientes */}
              {clinicalInfo.otherNotes && (
                <div className="pt-1.5 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 mb-0.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    Observación Clínica
                  </span>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {clinicalInfo.otherNotes}
                  </p>
                </div>
              )}
            </div>

            {/* 4. Residencia / Dirección Deduplicada */}
            {selectedPatient.address && (
              <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50/70 border border-slate-100 shadow-2xs text-xs sm:text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span className="leading-snug text-slate-700 line-clamp-2">{cleanedAddress}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer de Estado de Paso */}
      <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
        <span>Estado: {selectedPatient ? 'Listo para paso 2' : 'Esperando selección'}</span>
        <span className="font-bold text-teal-800">Paso 1 de 4</span>
      </div>
    </div>
  );
};

export default VacunacionPacienteCard;