// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/datos-personales/components/ModalInformacionSalud.tsx
// DESCRIPCIÓN: Modal interactivo para visualizar y editar la información de salud
//              básica del perfil con distinción clínica y sin alterar el expediente.
// =========================================================================

import React, { useState } from 'react';
import {
  X,
  HeartPulse,
  Plus,
  Trash2,
  AlertCircle,
  Pill,
  Activity,
  UserPlus,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import type {
  BasalHealthData,
  UpdateHealthDataDto,
  AllergyItem,
  ChronicDiseaseStatus,
} from '../../../../../../modules/patients/types/patient-personal-data.types.js';

interface ModalInformacionSaludProps {
  isOpen: boolean;
  onClose: () => void;
  health: BasalHealthData;
  onSave: (dto: UpdateHealthDataDto) => Promise<boolean>;
  saving: boolean;
}

export const ModalInformacionSalud: React.FC<ModalInformacionSaludProps> = ({
  isOpen,
  onClose,
  health,
  onSave,
  saving,
}) => {
  const [activeTab, setActiveTab] = useState<'alergias' | 'cronicas' | 'antecedentes' | 'familiares' | 'sangre' | 'medicamentos'>('alergias');

  // Estado editable local
  const [formData, setFormData] = useState<UpdateHealthDataDto>({
    bloodType: health.bloodType,
    bloodTypeSource: health.bloodTypeSource,
    allergies: [...health.allergies],
    chronicDiseases: [...health.chronicDiseases],
    medicalHistory: [...health.medicalHistory],
    familyHistory: [...health.familyHistory],
    habitualMedications: [...health.habitualMedications],
  });

  // Inputs temporales para agregar nuevos elementos
  const [newAllergyName, setNewAllergyName] = useState('');
  const [newAllergyCat, setNewAllergyCat] = useState<AllergyItem['category']>('MEDICAMENTO');

  const [newChronicName, setNewChronicName] = useState('');
  const [newChronicStatus, setNewChronicStatus] = useState<ChronicDiseaseStatus>('REPORTED');

  const [newMedHistoryTitle, setNewMedHistoryTitle] = useState('');
  const [newMedHistoryYear, setNewMedHistoryYear] = useState('');

  const [newFamRelation, setNewFamRelation] = useState('Madre');
  const [newFamCondition, setNewFamCondition] = useState('');

  const [newMedicationName, setNewMedicationName] = useState('');
  const [newMedicationDosage, setNewMedicationDosage] = useState('');

  if (!isOpen) return null;

  // Handlers para Alergias
  const handleAddAllergy = () => {
    if (!newAllergyName.trim()) return;
    setFormData((prev) => ({
      ...prev,
      allergies: [
        ...prev.allergies,
        {
          id: `all-${Date.now()}`,
          category: newAllergyCat,
          name: newAllergyName.trim(),
          source: 'PATIENT',
        },
      ],
    }));
    setNewAllergyName('');
  };

  const handleRemoveAllergy = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a.id !== id),
    }));
  };

  // Handlers para Crónicas
  const handleAddChronic = () => {
    if (!newChronicName.trim()) return;
    setFormData((prev) => ({
      ...prev,
      chronicDiseases: [
        ...prev.chronicDiseases,
        {
          id: `chr-${Date.now()}`,
          name: newChronicName.trim(),
          diagnosisDate: new Date().toISOString().slice(0, 10),
          status: newChronicStatus,
        },
      ],
    }));
    setNewChronicName('');
  };

  const handleRemoveChronic = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      chronicDiseases: prev.chronicDiseases.filter((c) => c.id !== id),
    }));
  };

  // Handlers para Antecedentes Médicos
  const handleAddMedHistory = () => {
    if (!newMedHistoryTitle.trim()) return;
    setFormData((prev) => ({
      ...prev,
      medicalHistory: [
        ...prev.medicalHistory,
        {
          id: `med-${Date.now()}`,
          title: newMedHistoryTitle.trim(),
          year: newMedHistoryYear.trim() || undefined,
          source: 'PATIENT',
        },
      ],
    }));
    setNewMedHistoryTitle('');
    setNewMedHistoryYear('');
  };

  const handleRemoveMedHistory = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((m) => m.id !== id),
    }));
  };

  // Handlers para Antecedentes Familiares
  const handleAddFamHistory = () => {
    if (!newFamCondition.trim()) return;
    setFormData((prev) => ({
      ...prev,
      familyHistory: [
        ...prev.familyHistory,
        {
          id: `fam-${Date.now()}`,
          relationship: newFamRelation,
          condition: newFamCondition.trim(),
          source: 'PATIENT',
        },
      ],
    }));
    setNewFamCondition('');
  };

  const handleRemoveFamHistory = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      familyHistory: prev.familyHistory.filter((f) => f.id !== id),
    }));
  };

  // Handlers para Medicamentos Habituales
  const handleAddHabitualMed = () => {
    if (!newMedicationName.trim()) return;
    setFormData((prev) => ({
      ...prev,
      habitualMedications: [
        ...prev.habitualMedications,
        {
          id: `hab-${Date.now()}`,
          name: newMedicationName.trim(),
          dosage: newMedicationDosage.trim() || undefined,
          source: 'PATIENT',
        },
      ],
    }));
    setNewMedicationName('');
    setNewMedicationDosage('');
  };

  const handleRemoveHabitualMed = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      habitualMedications: prev.habitualMedications.filter((h) => h.id !== id),
    }));
  };

  const handleSaveAll = async () => {
    await onSave(formData);
  };

  const formatChronicBadge = (status: ChronicDiseaseStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Confirmada</span>;
      case 'CLINICAL':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#1c5752] border border-teal-200">Registrada clínicamente</span>;
      case 'FOLLOW_UP':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">En seguimiento</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Reportada por paciente</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera del Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-[#1c5752] border border-teal-200">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Información de Salud Básica
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Ficha de antecedentes y perfil de salud del paciente.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barra de Pestañas de Navegación */}
        <div className="px-4 border-b border-slate-100 bg-white flex items-center gap-1 overflow-x-auto [scrollbar-width:none] shrink-0 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('alergias')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'alergias' ? 'border-[#1c5752] text-[#1c5752]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Alergias ({formData.allergies.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cronicas')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'cronicas' ? 'border-[#1c5752] text-[#1c5752]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Enfermedades crónicas ({formData.chronicDiseases.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('antecedentes')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'antecedentes' ? 'border-[#1c5752] text-[#1c5752]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Antecedentes médicos ({formData.medicalHistory.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('familiares')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'familiares' ? 'border-[#1c5752] text-[#1c5752]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Familiares ({formData.familyHistory.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sangre')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'sangre' ? 'border-[#1c5752] text-[#1c5752]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <span>Tipo de sangre</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('medicamentos')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'medicamentos' ? 'border-[#1c5752] text-[#1c5752]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Uso habitual ({formData.habitualMedications.length})</span>
          </button>
        </div>

        {/* Contenido Dinámico por Pestaña */}
        <div className="p-5 overflow-y-auto flex-1 text-xs space-y-4">
          {/* 1. ALERGIAS */}
          {activeTab === 'alergias' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex gap-2">
                <select
                  value={newAllergyCat}
                  onChange={(e) => setNewAllergyCat(e.target.value as AllergyItem['category'])}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                >
                  <option value="MEDICAMENTO">Medicamento</option>
                  <option value="ALIMENTO">Alimento</option>
                  <option value="SUSTANCIA">Sustancia</option>
                  <option value="AMBIENTAL">Ambiental</option>
                  <option value="OTRA">Otra</option>
                </select>
                <input
                  type="text"
                  placeholder="Ej. Penicilina, Mariscos, Polvo..."
                  value={newAllergyName}
                  onChange={(e) => setNewAllergyName(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddAllergy}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1c5752] text-white font-bold flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>

              <div className="space-y-2">
                {formData.allergies.length === 0 ? (
                  <p className="text-slate-400 text-center py-6">Sin alergias registradas.</p>
                ) : (
                  formData.allergies.map((a) => (
                    <div
                      key={a.id}
                      className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{a.name}</span>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {a.category}
                          </span>
                        </div>
                        <span className="text-[10.5px] text-slate-400 block">
                          {a.source === 'CLINICAL' ? 'Confirmada clínicamente' : 'Reportada por paciente'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(a.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 2. ENFERMEDADES CRÓNICAS */}
          {activeTab === 'cronicas' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex gap-2">
                <input
                  type="text"
                  placeholder="Ej. Hipertensión arterial, Diabetes..."
                  value={newChronicName}
                  onChange={(e) => setNewChronicName(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs"
                />
                <select
                  value={newChronicStatus}
                  onChange={(e) => setNewChronicStatus(e.target.value as ChronicDiseaseStatus)}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                >
                  <option value="REPORTED">Reportada por paciente</option>
                  <option value="CLINICAL">Registrada clínicamente</option>
                  <option value="CONFIRMED">Confirmada</option>
                  <option value="FOLLOW_UP">En seguimiento</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddChronic}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1c5752] text-white font-bold flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>

              <div className="space-y-2">
                {formData.chronicDiseases.length === 0 ? (
                  <p className="text-slate-400 text-center py-6">Sin enfermedades crónicas registradas.</p>
                ) : (
                  formData.chronicDiseases.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{c.name}</span>
                          {formatChronicBadge(c.status)}
                        </div>
                        {c.diagnosisDate && (
                          <span className="text-[10px] text-slate-400 block font-mono">
                            Registrada: {c.diagnosisDate}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveChronic(c.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 3. ANTECEDENTES MÉDICOS */}
          {activeTab === 'antecedentes' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex gap-2">
                <input
                  type="text"
                  placeholder="Cirugía, hospitalización previa o lesión..."
                  value={newMedHistoryTitle}
                  onChange={(e) => setNewMedHistoryTitle(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs"
                />
                <input
                  type="text"
                  placeholder="Año (ej. 2019)"
                  value={newMedHistoryYear}
                  onChange={(e) => setNewMedHistoryYear(e.target.value)}
                  className="w-28 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddMedHistory}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1c5752] text-white font-bold flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>

              <div className="space-y-2">
                {formData.medicalHistory.length === 0 ? (
                  <p className="text-slate-400 text-center py-6">Sin otros antecedentes registrados.</p>
                ) : (
                  formData.medicalHistory.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-800 block">{m.title}</span>
                        {m.year && <span className="text-[10px] text-slate-400 font-mono">Año: {m.year}</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedHistory(m.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 4. ANTECEDENTES FAMILIARES */}
          {activeTab === 'familiares' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex gap-2">
                <select
                  value={newFamRelation}
                  onChange={(e) => setNewFamRelation(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                >
                  <option value="Madre">Madre</option>
                  <option value="Padre">Padre</option>
                  <option value="Hermanos">Hermanos</option>
                  <option value="Abuelos maternos">Abuelos maternos</option>
                  <option value="Abuelos paternos">Abuelos paternos</option>
                  <option value="Otro">Otro</option>
                </select>
                <input
                  type="text"
                  placeholder="Enfermedad (ej. Diabetes, Hipertensión...)"
                  value={newFamCondition}
                  onChange={(e) => setNewFamCondition(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddFamHistory}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1c5752] text-white font-bold flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>

              <div className="space-y-2">
                {formData.familyHistory.length === 0 ? (
                  <p className="text-slate-400 text-center py-6">Sin antecedentes familiares registrados.</p>
                ) : (
                  formData.familyHistory.map((f) => (
                    <div
                      key={f.id}
                      className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-[#1c5752] block text-[11px]">{f.relationship}</span>
                        <span className="font-semibold text-slate-800">{f.condition}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFamHistory(f.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 5. TIPO DE SANGRE */}
          {activeTab === 'sangre' && (
            <div className="space-y-4 max-w-md mx-auto py-4 text-center">
              <div className="p-4 bg-rose-50/60 rounded-3xl border border-rose-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Tipo de Sangre Basal
                </span>
                <select
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  className="text-2xl font-black text-rose-600 bg-white border border-rose-300 rounded-2xl px-4 py-2 font-mono"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>

                <div className="pt-2 flex justify-center">
                  <select
                    value={formData.bloodTypeSource}
                    onChange={(e) => setFormData({ ...formData, bloodTypeSource: e.target.value as 'PATIENT' | 'CLINICAL' })}
                    className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-1 font-semibold text-slate-600"
                  >
                    <option value="PATIENT">Reportado por paciente</option>
                    <option value="CLINICAL">Registrado clínicamente</option>
                  </select>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                El tipo de sangre introducido por el paciente no reemplaza la verificación de laboratorio previo a una transfusión clínica.
              </p>
            </div>
          )}

          {/* 6. MEDICAMENTOS DE USO HABITUAL */}
          {activeTab === 'medicamentos' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex gap-2">
                <input
                  type="text"
                  placeholder="Medicamento declarado (ej. Losartán 50mg)..."
                  value={newMedicationName}
                  onChange={(e) => setNewMedicationName(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs"
                />
                <input
                  type="text"
                  placeholder="Pauta (ej. 1 cada 24h)"
                  value={newMedicationDosage}
                  onChange={(e) => setNewMedicationDosage(e.target.value)}
                  className="w-36 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddHabitualMed}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1c5752] text-white font-bold flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>

              <div className="space-y-2">
                {formData.habitualMedications.length === 0 ? (
                  <p className="text-slate-400 text-center py-6">Sin medicamentos de uso habitual declarados.</p>
                ) : (
                  formData.habitualMedications.map((h) => (
                    <div
                      key={h.id}
                      className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-800 block">{h.name}</span>
                        {h.dosage && <span className="text-[10.5px] text-slate-400">{h.dosage}</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveHabitualMed(h.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pie del Modal con Guardado */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-bold transition cursor-pointer"
          >
            Cerrar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSaveAll}
            className="px-5 py-2 rounded-xl bg-[#1c5752] hover:bg-[#164743] text-white font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{saving ? 'Guardando...' : 'Guardar Información de Salud'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalInformacionSalud;