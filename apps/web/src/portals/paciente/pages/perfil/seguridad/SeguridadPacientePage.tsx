// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/seguridad/SeguridadPacientePage.tsx
// DESCRIPCIÓN: Vista oficial de Seguridad del Portal Paciente con estilo Apple Settings.
// =========================================================================

import React from 'react';
import { usePatientSecurity } from '../../../../../modules/patients/hooks/usePatientSecurity.js';
import {
  SeguridadHeader,
  EstadoSeguridadCard,
  SesionesActivasCard,
  ActividadSeguridadCard,
  CambiarContrasenaModal,
  VerificacionDosPasosModal,
  CerrarSesionModal,
  SeguridadLoading,
  SeguridadError,
} from './components/index.js';

export const SeguridadPacientePage: React.FC = () => {
  const {
    securityStatus,
    sessions,
    events,
    loading,
    error,
    actionSuccess,
    isPasswordModalOpen,
    is2FaModalOpen,
    sessionToClose,
    setIsPasswordModalOpen,
    setIs2FaModalOpen,
    setSessionToClose,
    handleChangePassword,
    handleCloseSession,
    reloadData,
  } = usePatientSecurity();

  if (loading && !securityStatus) {
    return (
      <div className="w-full space-y-6 pb-20 animate-in fade-in duration-150">
        <SeguridadLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full space-y-6 pb-20 animate-in fade-in duration-150">
        <SeguridadError onRetry={reloadData} />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-20 animate-in fade-in duration-150">
      {/* 1. Header Oficial Institucional */}
      <SeguridadHeader successMessage={actionSuccess} />

      {/* 2. Bloque 1: Resumen de Estado de la Cuenta */}
      <section>
        <EstadoSeguridadCard
          status={securityStatus}
          onChangePasswordClick={() => setIsPasswordModalOpen(true)}
          onTwoFactorClick={() => setIs2FaModalOpen(true)}
        />
      </section>

      {/* 3. Bloque 2: Dispositivos y Sesiones Activas */}
      <section>
        <SesionesActivasCard
          sessions={sessions}
          onCloseSession={(s) => setSessionToClose(s)}
        />
      </section>

      {/* 4. Bloque 3: Auditoría y Actividad Reciente */}
      <section>
        <ActividadSeguridadCard events={events} />
      </section>

      {/* MODAL 1: Cambio de Contraseña */}
      <CambiarContrasenaModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handleChangePassword}
        loading={loading}
      />

      {/* MODAL 2: Verificación en Dos Pasos */}
      <VerificacionDosPasosModal
        isOpen={is2FaModalOpen}
        onClose={() => setIs2FaModalOpen(false)}
      />

      {/* MODAL 3: Confirmación de Cierre de Sesión Remota */}
      <CerrarSesionModal
        session={sessionToClose}
        onClose={() => setSessionToClose(null)}
        onConfirm={() => {
          if (sessionToClose) {
            handleCloseSession(sessionToClose.id);
          }
        }}
      />
    </div>
  );
};

export default SeguridadPacientePage;