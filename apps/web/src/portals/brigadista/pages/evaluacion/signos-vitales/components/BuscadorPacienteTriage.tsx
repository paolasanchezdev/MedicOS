// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/evaluacion/signos-vitales/components/BuscadorPacienteTriage.tsx
// DESCRIPCIÓN: Búsqueda reactiva de pacientes conectada a Neon PostgreSQL (Tipado Estricto).
// =========================================================================

import React, { useState } from 'react';
import { Search, UserCheck, X, AlertCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../../../../../../shared/lib/apiClient';

export interface PatientSummary {
  id: string;
  name: string;
  dui: string;
  age: number;
  gender: string;
  bloodType?: string;
  phone?: string;
  address?: string;
}

interface ApiClinicalRecord {
  bloodType?: string;
}

interface ApiPatientItem {
  id: string;
  firstName: string;
  lastName: string;
  dui?: string | null;
  dateOfBirth?: string | Date;
  sex?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string | null;
  address?: string;
  clinicalRecord?: ApiClinicalRecord | null;
}

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
}

interface BuscadorPacienteTriageProps {
  selectedPatient: PatientSummary | null;
  onSelectPatient: (patient: PatientSummary | null) => void;
}

export const BuscadorPacienteTriage: React.FC<BuscadorPacienteTriageProps> = ({
  selectedPatient,
  onSelectPatient,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PatientSummary[]>([]);
  const [searched, setSearched] = useState(false);

  // Formato DUI salvadoreño automático
  const handleDuiInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d-]/g, '');
    if (val.replace(/\D/g, '').length > 9) return;
    setQuery(val);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await apiClient<ApiResponse<ApiPatientItem[]> | ApiPatientItem[]>(
        `/patients?search=${encodeURIComponent(query.trim())}`
      );

      const rawList: ApiPatientItem[] = Array.isArray(response)
        ? response
        : response?.data || [];

      const formatted: PatientSummary[] = rawList.map((p) => {
        let calculatedAge = 25;
        if (p.dateOfBirth) {
          const diff = Date.now() - new Date(p.dateOfBirth).getTime();
          calculatedAge = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        }

        return {
          id: p.id,
          name: `${p.firstName} ${p.lastName}`.trim(),
          dui: p.dui || 'Sin DUI',
          age: calculatedAge > 0 ? calculatedAge : 0,
          gender: p.sex === 'MALE' ? 'Masculino' : p.sex === 'FEMALE' ? 'Femenino' : 'Otro',
          bloodType: p.clinicalRecord?.bloodType?.replace('_', ' ') || 'Desconocido',
          phone: p.phone || 'Sin teléfono',
          address: p.address || 'No registrada',
        };
      });

      setResults(formatted);
      if (formatted.length === 1) {
        onSelectPatient(formatted[0]);
      }
    } catch (err) {
      console.error('Error al buscar pacientes en base de datos:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
          <Search size={18} className="text-[#0e7490]" />
          1. Identificación del Paciente
        </h2>
        <span className="text-xs font-semibold text-slate-400">
          Base de Datos Neon
        </span>
      </div>

      {!selectedPatient ? (
        <div className="space-y-3">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por DUI (00000000-0) o Nombre..."
                value={query}
                onChange={handleDuiInput}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all"
              />
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#0e7490] hover:bg-[#0891b2] disabled:bg-slate-300 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Buscando...</span>
                </>
              ) : (
                <span>Buscar Paciente</span>
              )}
            </button>
          </form>

          {/* Listado de Coincidencias */}
          {searched && !loading && results.length > 1 && (
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
              <span className="text-xs font-bold text-slate-600">
                Selecciona al paciente correspondiente ({results.length} resultados):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {results.map((pat) => (
                  <button
                    key={pat.id}
                    type="button"
                    onClick={() => onSelectPatient(pat)}
                    className="p-2.5 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-teal-900">{pat.name}</p>
                      <p className="text-[11px] font-medium text-slate-500">DUI: {pat.dui} • {pat.gender}</p>
                    </div>
                    <span className="text-[11px] font-bold text-[#0e7490] opacity-0 group-hover:opacity-100 transition-opacity">
                      Seleccionar
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searched && !loading && results.length === 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>No se encontraron pacientes registrados con ese criterio de búsqueda.</span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-teal-50/70 border border-teal-200/90 rounded-xl flex flex-wrap items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#0e7490] text-white rounded-xl shadow-2xs">
              <UserCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">{selectedPatient.name}</h3>
                <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded-md text-[10px] font-extrabold uppercase">
                  DUI: {selectedPatient.dui}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-slate-600 mt-1">
                <span>{selectedPatient.age} años</span>
                <span>•</span>
                <span>{selectedPatient.gender}</span>
                <span>•</span>
                <span>Tipo de Sangre: <strong className="text-slate-800">{selectedPatient.bloodType}</strong></span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectPatient(null)}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 text-slate-600 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <X size={14} />
            <span>Cambiar Paciente</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BuscadorPacienteTriage;