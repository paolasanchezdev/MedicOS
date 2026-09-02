// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/layout/PacienteLayout.tsx
// DESCRIPCIÓN: Layout del Portal Paciente con detección de perfil incompleto
//              y compuerta modular de bienvenida y carnet digital.
// =========================================================================

import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { PacienteSidebar } from '../components/PacienteSidebar';
import { PacienteHeader } from '../components/PacienteHeader';
import { BienvenidaOnboardingModal } from '../components/onboarding';
import { useAuth } from '../../../core/context/useAuth';
import { patientsService } from '../../../modules/patients/services/patients.service';
import type { PatientRecord } from '../../../modules/patients';

interface PacienteLayoutProps {
  children?: React.ReactNode;
}

function isPlaceholderDate(d?: string | Date): boolean {
  if (!d) return true;
  try {
    const dateObj = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(dateObj.getTime())) return true;
    const iso = dateObj.toISOString();
    return iso.startsWith('2000-01-01') || iso.startsWith('1999-12-31');
  } catch {
    return true;
  }
}

function isAddressPending(addr?: string | null): boolean {
  if (!addr) return true;
  const lower = addr.toLowerCase();
  return lower.includes('pendiente') || lower.includes('no registrada');
}

export const PacienteLayout: React.FC<PacienteLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const [currentPatient, setCurrentPatient] = useState<PatientRecord | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const userId = user?.id;

    if (!userId) {
      return;
    }

    const loadProfile = async () => {
      try {
        const patient = await patientsService.getPatientById(userId);
        if (isMounted) {
          setCurrentPatient(patient);
        }
      } catch {
        // Silencioso ante fallas de conexión inicial
      } finally {
        if (isMounted) {
          setCheckingProfile(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Si la cuenta posee fecha de nacimiento temporal o dirección pendiente, se activa el onboarding
  const requiresOnboarding = Boolean(
    !checkingProfile &&
    currentPatient &&
    (isPlaceholderDate(currentPatient.dateOfBirth) || isAddressPending(currentPatient.address))
  );

  return (
    <div className="min-h-screen bg-slate-50/90 flex font-sans antialiased text-slate-800">
      {/* Sidebar lateral */}
      <PacienteSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Área principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header superior */}
        <PacienteHeader onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Lienzo dinámico limpio */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full">
          {children || <Outlet />}
        </main>
      </div>

      {/* Compuerta de Bienvenida y Activación de Carnet */}
      {requiresOnboarding && currentPatient && (
        <BienvenidaOnboardingModal
          patient={currentPatient}
          onCompleted={(updatedPatient: PatientRecord) => {
            setCurrentPatient(updatedPatient);
          }}
        />
      )}
    </div>
  );
};

export default PacienteLayout;