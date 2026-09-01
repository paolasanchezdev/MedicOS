// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/hooks/useCreatePatient.ts
// DESCRIPCIÓN: Hook reactivo con soporte para división territorial (Depto/Mpio/Distrito)
// =========================================================================

import { useState, useCallback, useEffect } from 'react';
import { patientsService } from '../services/patients.service';
import type { CreatePatientDto, CreatedPatientResult, BloodType, Sex } from '../types/patient.types';

export interface PatientFormState {
  // Identificación
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dui: string;
  sex: Sex;

  // Cuenta MedicOS
  email: string;
  password: string;
  confirmPassword: string;

  // Contacto y Territorio
  phone: string;
  address: string;
  department: string;
  municipality: string;
  district: string;

  // Información Médica
  bloodType: BloodType;
  allergies: string;
  chronicDiseases: string;
  disabilities: string;

  // Contacto de Emergencia
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;

  // Confirmación
  confirmed: boolean;
}

const initialState: PatientFormState = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  dui: '',
  sex: 'FEMALE',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  address: '',
  department: 'La Paz',
  municipality: 'La Paz Centro',
  district: 'San Miguel Tepezontes',
  bloodType: 'UNKNOWN',
  allergies: '',
  chronicDiseases: '',
  disabilities: '',
  emergencyName: '',
  emergencyPhone: '',
  emergencyRelation: '',
  confirmed: false,
};

export function useCreatePatient() {
  const [formData, setFormData] = useState<PatientFormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [createdPatient, setCreatedPatient] = useState<CreatedPatientResult | null>(null);

  // Estados de validación asíncrona en tiempo real
  const [checkingDui, setCheckingDui] = useState<boolean>(false);
  const [duiAvailability, setDuiAvailability] = useState<{ available: boolean; patientName?: string } | null>(null);

  const [checkingEmail, setCheckingEmail] = useState<boolean>(false);
  const [emailAvailability, setEmailAvailability] = useState<boolean | null>(null);

  const setField = useCallback(<K extends keyof PatientFormState>(field: K, value: PatientFormState[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (prev[field]) {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      }
      return prev;
    });
  }, []);

  // Validación asíncrona de DUI
  useEffect(() => {
    const rawDui = formData.dui.trim();
    const duiRegex = /^\d{8}-\d{1}$/;

    if (!rawDui || !duiRegex.test(rawDui)) {
      return;
    }

    let isCurrent = true;

    const timer = setTimeout(async () => {
      if (isCurrent) setCheckingDui(true);
      try {
        const res = await patientsService.checkDuiAvailability(rawDui);
        if (isCurrent) {
          setDuiAvailability(res);
          if (!res.available) {
            setErrors((prev) => ({
              ...prev,
              dui: `El DUI ya está registrado (${res.patientName || 'Paciente existente'}).`,
            }));
          }
        }
      } catch {
        // Fallback al submit
      } finally {
        if (isCurrent) setCheckingDui(false);
      }
    }, 350);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [formData.dui]);

  // Validación asíncrona de Correo
  useEffect(() => {
    const rawEmail = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!rawEmail || !emailRegex.test(rawEmail)) {
      return;
    }

    let isCurrent = true;

    const timer = setTimeout(async () => {
      if (isCurrent) setCheckingEmail(true);
      try {
        const res = await patientsService.checkEmailAvailability(rawEmail);
        if (isCurrent) {
          setEmailAvailability(res.available);
          if (!res.available) {
            setErrors((prev) => ({
              ...prev,
              email: 'Este correo electrónico ya se encuentra registrado en MedicOS.',
            }));
          }
        }
      } catch {
        // Fallback al submit
      } finally {
        if (isCurrent) setCheckingEmail(false);
      }
    }, 350);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [formData.email]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Los nombres son obligatorios.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Los apellidos son obligatorios.';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'La fecha de nacimiento es requerida.';
    if (!formData.address.trim()) newErrors.address = 'La dirección de residencia es requerida.';

    if (formData.dui.trim()) {
      const duiRegex = /^\d{8}-\d{1}$/;
      if (!duiRegex.test(formData.dui.trim())) {
        newErrors.dui = 'El formato del DUI debe ser 00000000-0.';
      } else if (duiAvailability && !duiAvailability.available) {
        newErrors.dui = `El DUI ya está registrado (${duiAvailability.patientName}).`;
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio para la cuenta.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'El formato del correo no es válido.';
      } else if (emailAvailability === false) {
        newErrors.email = 'Este correo electrónico ya está en uso.';
      }
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (!formData.confirmed) {
      newErrors.confirmed = 'Debes confirmar la veracidad de los datos antes de continuar.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitPatient = async (): Promise<boolean> => {
    setGeneralError(null);

    if (!validateForm()) {
      return false;
    }

    setLoading(true);

    try {
      const direccionPartes = [
        formData.address.trim(),
        formData.district?.trim(),
        formData.municipality?.trim(),
        formData.department?.trim(),
      ].filter(Boolean);

      const payload: CreatePatientDto = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        dateOfBirth: formData.dateOfBirth,
        dui: formData.dui.trim() || null,
        sex: formData.sex,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim() || null,
        address: direccionPartes.join(', '),
        district: formData.district.trim() || null,
        municipality: formData.municipality.trim() || null,
        department: formData.department.trim() || null,
        bloodType: formData.bloodType,
        allergies: formData.allergies.trim() || null,
        chronicDiseases: formData.chronicDiseases.trim() || null,
        disabilities: formData.disabilities.trim() || null,
        emergencyName: formData.emergencyName.trim() || null,
        emergencyPhone: formData.emergencyPhone.trim() || null,
        emergencyRelation: formData.emergencyRelation.trim() || null,
      };

      const result = await patientsService.createPatient(payload);
      setCreatedPatient(result);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error inesperado al registrar el paciente.';
      setGeneralError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
    setGeneralError(null);
    setCreatedPatient(null);
    setDuiAvailability(null);
    setEmailAvailability(null);
  };

  return {
    formData,
    setField,
    errors,
    loading,
    generalError,
    createdPatient,
    checkingDui,
    duiAvailability,
    checkingEmail,
    emailAvailability,
    submitPatient,
    resetForm,
  };
}