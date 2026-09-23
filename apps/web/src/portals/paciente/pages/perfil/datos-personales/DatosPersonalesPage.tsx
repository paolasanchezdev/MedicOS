// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/datos-personales/DatosPersonalesPage.tsx
// DESCRIPCIÓN: Compositor oficial de Datos Personales e Información de Salud básica
//              con acabado pulido, contraste de superficies y scroll interno invisible.
// =========================================================================

import React from 'react';
import { RotateCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { usePatientPersonalData } from '../../../../../modules/patients/hooks/usePatientPersonalData.js';
import {
  DatosPersonalesHeader,
  PerfilPacienteCard,
  InformacionPersonalCard,
  InformacionContactoCard,
  InformacionSaludCard,
  IdentificacionMedicOSCard,
  PersonalizacionPerfilCard,
  ModalIdentificacionDigital,
  ModalInformacionSalud,
  CambiarFotoModal,
} from './components/index.js';

export const DatosPersonalesPage: React.FC = () => {
  const {
    profile,
    displayName,
    loading,
    saving,
    error,
    successMessage,
    editingSection,
    isCredentialModalOpen,
    isPhotoModalOpen,
    isHealthModalOpen,
    setEditingSection,
    setIsCredentialModalOpen,
    setIsPhotoModalOpen,
    setIsHealthModalOpen,
    savePersonalIdentity,
    savePersonalContact,
    saveHealthData,
    saveCustomization,
    updateAvatar,
    removeAvatar,
  } = usePatientPersonalData();

  if (loading) {
    return (
      <div className="h-[calc(100dvh-8.25rem)] min-h-[500px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-xs text-slate-400 space-y-3">
        <RotateCw className="w-7 h-7 animate-spin text-[#1c5752]" />
        <p>Cargando información personal del paciente...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="h-[calc(100dvh-8.25rem)] min-h-[500px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-xs space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-500" />
        <h3 className="text-sm font-bold text-slate-800">No se pudo cargar tu perfil</h3>
        <p className="text-slate-500 max-w-sm">{error || 'Ocurrió un error al obtener tus datos.'}</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-8.25rem)] min-h-[520px] flex flex-col gap-3.5 select-none animate-in fade-in duration-200 overflow-hidden">
      {/* 1. Encabezado */}
      <DatosPersonalesHeader />

      {/* Notificación Flash de Guardado */}
      {successMessage && (
        <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-2xs shrink-0 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 2. Área Central Scrolleable con Scroll Interno Invisible */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5 pb-4">
        {/* NIVEL 1: PERFIL DEL PACIENTE */}
        <PerfilPacienteCard
          profile={profile}
          displayName={displayName}
          onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
          onTriggerEditPersonal={() => setEditingSection('personal')}
          onOpenIdentificacionModal={() => setIsCredentialModalOpen(true)}
        />

        {/* NIVEL 2: 2 COLUMNAS (INFORMACIÓN PERSONAL + INFORMACIÓN DE CONTACTO) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <InformacionPersonalCard
            profile={profile}
            isEditing={editingSection === 'personal'}
            saving={saving}
            onStartEdit={() => setEditingSection('personal')}
            onCancelEdit={() => setEditingSection(null)}
            onSave={savePersonalIdentity}
          />

          <InformacionContactoCard
            profile={profile}
            isEditing={editingSection === 'contact'}
            saving={saving}
            onStartEdit={() => setEditingSection('contact')}
            onCancelEdit={() => setEditingSection(null)}
            onSave={savePersonalContact}
          />
        </div>

        {/* NIVEL 3: INFORMACIÓN DE SALUD (Fichas Modulares + [Ver / editar]) */}
        <InformacionSaludCard
          health={profile.health}
          onOpenHealthModal={() => setIsHealthModalOpen(true)}
        />

        {/* NIVEL 4: IDENTIFICACIÓN MEDICOS */}
        <IdentificacionMedicOSCard
          profile={profile}
          onOpenIdentificacionModal={() => setIsCredentialModalOpen(true)}
        />

        {/* NIVEL 5: PERSONALIZACIÓN DEL PERFIL */}
        <PersonalizacionPerfilCard
          profile={profile}
          isEditing={editingSection === 'customization'}
          saving={saving}
          onStartEdit={() => setEditingSection('customization')}
          onCancelEdit={() => setEditingSection(null)}
          onSave={saveCustomization}
        />
      </div>

      {/* MODAL: Información de Salud Detallada */}
      <ModalInformacionSalud
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        health={profile.health}
        onSave={saveHealthData}
        saving={saving}
      />

      {/* MODAL: Carnet Digital Oficial de Identificación */}
      <ModalIdentificacionDigital
        isOpen={isCredentialModalOpen}
        onClose={() => setIsCredentialModalOpen(false)}
        profile={profile}
        displayName={displayName}
      />

      {/* MODAL: Cambiar Foto de Perfil */}
      <CambiarFotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentAvatarUrl={profile.avatarUrl}
        onSaveAvatar={updateAvatar}
        onRemoveAvatar={removeAvatar}
      />
    </div>
  );
};

export default DatosPersonalesPage;