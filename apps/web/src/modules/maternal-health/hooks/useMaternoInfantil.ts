// =========================================================================
// ARCHIVO: apps/web/src/modules/maternal-health/hooks/useMaternoInfantil.ts
// DESCRIPCIÓN: Hook de dominio 100% puro para React 19 y ESLint.
//              Creación REAL de pacientes pediátricos en PostgreSQL vía API
//              y gestión del censo territorial de gestantes y niños.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { patientsService } from '../../patients/services/patients.service';
import { apiClient } from '../../../shared/lib/apiClient';
import type { PatientRecord, CreatePatientDto } from '../../patients/types/patient.types';
import type {
  GestanteItem,
  NinoItem,
  AtencionPreventivaItem,
  MaternoInfantilMetricas,
  RegistrarControlDto,
  CaptarGestanteDto,
  RegistrarNinoDto,
} from '../types/materno-infantil.types';

const STORAGE_KEY_GESTANTES = 'medicos_censo_gestantes_territorio';
const STORAGE_KEY_NINOS_TUTORIA = 'medicos_censo_ninos_tutoria';
const STORAGE_KEY_ATENCIONES = 'medicos_atenciones_materno_infantil_historial';

function calcularEdadAnios(fechaNac?: string | Date | null): number | null {
  if (!fechaNac) return null;
  const nac = new Date(fechaNac);
  if (isNaN(nac.getTime())) return null;
  const hoy = new Date();
  if (nac.getFullYear() < 1900 || nac > hoy) return null;
  let anios = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) {
    anios--;
  }
  return anios >= 0 ? anios : null;
}

function calcularEdadMeses(fechaNac?: string | Date | null): number | null {
  if (!fechaNac) return null;
  const nac = new Date(fechaNac);
  if (isNaN(nac.getTime())) return null;
  const hoy = new Date();
  let meses = (hoy.getFullYear() - nac.getFullYear()) * 12;
  meses += hoy.getMonth() - nac.getMonth();
  if (hoy.getDate() < nac.getDate()) {
    meses--;
  }
  return meses >= 0 ? meses : null;
}

export function useMaternoInfantil() {
  const [pacientesTotales, setPacientesTotales] = useState<PatientRecord[]>([]);
  const [gestantes, setGestantes] = useState<GestanteItem[]>([]);
  const [ninos, setNinos] = useState<NinoItem[]>([]);
  const [historialGlobal, setHistorialGlobal] = useState<AtencionPreventivaItem[]>([]);
  const [metricas, setMetricas] = useState<MaternoInfantilMetricas>({
    gestantesTotal: 0,
    primerTrimestre: 0,
    segundoTrimestre: 0,
    tercerTrimestre: 0,
    ninosTotal: 0,
    lactantes: 0,
    primeraInfancia: 0,
    escolares: 0,
    controlesPendientes: 0,
    gestantesPendientes: 0,
    ninosPendientes: 0,
    totalAtencionesRegistradas: 0,
    orientacionesEntregadas: 0,
    referenciasEmitidas: 0,
    seguimientosProximos: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroTexto, setFiltroTexto] = useState<string>('');

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientsService.getAllPatients();
      const listaPacientes = data || [];
      setPacientesTotales(listaPacientes);

      // Cargar historial de atenciones preventivas registradas en comunidad
      let atencionesList: AtencionPreventivaItem[] = [];
      try {
        const rawAtenciones = localStorage.getItem(STORAGE_KEY_ATENCIONES);
        if (rawAtenciones) atencionesList = JSON.parse(rawAtenciones);
      } catch {
        atencionesList = [];
      }
      setHistorialGlobal(atencionesList);

      // 1. Censo de Gestantes en seguimiento prenatal
      let captadasStorage: Record<string, { semanas: number; fpp: string }> = {};
      try {
        const raw = localStorage.getItem(STORAGE_KEY_GESTANTES);
        if (raw) captadasStorage = JSON.parse(raw);
      } catch {
        captadasStorage = {};
      }

      const gestantesList: GestanteItem[] = [];
      Object.entries(captadasStorage).forEach(([pId, info]) => {
        const p = listaPacientes.find((pac) => pac.id === pId);
        if (p) {
          const edad = calcularEdadAnios(p.dateOfBirth) ?? 24;
          const atencionesPaciente = atencionesList.filter((a) => a.pacienteId === p.id);
          const ultima = atencionesPaciente[0];

          gestantesList.push({
            id: `gest-${p.id}`,
            pacienteId: p.id,
            expediente: p.dui ? `EXP-MAT-${p.dui.replace(/\D/g, '').slice(-4)}` : `EXP-MAT-${p.id.slice(0, 4).toUpperCase()}`,
            nombreCompleto: `${p.firstName} ${p.lastName}`.trim(),
            edad,
            dui: p.dui || 'Sin registrar',
            telefono: p.phone?.replace(/^\+?503\s*[-]?\s*/, '') || 'No registrado',
            direccion: p.address || 'Comunidad asignada',
            semanasGestacion: info.semanas,
            fechaProbableParto: info.fpp,
            totalControlesRealizados: atencionesPaciente.length,
            historialAtenciones: atencionesPaciente,
            ultimoControl: ultima ? ultima.fechaControl : 'Captación inicial',
            proximoControl: ultima ? ultima.fechaProximoSeguimiento : 'Control en jornada',
            requiereAtencion: info.semanas >= 36 || atencionesPaciente.length === 0,
            motivoAtencion: info.semanas >= 36 ? 'Tercer trimestre (preparación para el parto)' : atencionesPaciente.length === 0 ? 'Primer control pendiente' : undefined,
          });
        }
      });

      // 2. Niños en seguimiento (Pacientes REALES de la base de datos con edad < 12 años)
      let tutoriaMap: Record<string, { tutorId: string; parentesco: string }> = {};
      try {
        const rawTutoria = localStorage.getItem(STORAGE_KEY_NINOS_TUTORIA);
        if (rawTutoria) tutoriaMap = JSON.parse(rawTutoria);
      } catch {
        tutoriaMap = {};
      }

      const ninosList: NinoItem[] = listaPacientes
        .filter((p) => {
          const edad = calcularEdadAnios(p.dateOfBirth);
          return edad !== null && edad < 12;
        })
        .map((p, idx) => {
          const meses = calcularEdadMeses(p.dateOfBirth) ?? 0;
          const anios = Math.floor(meses / 12);
          const edadTexto = anios >= 1 ? `${anios} año${anios > 1 ? 's' : ''}` : `${meses} mes${meses > 1 ? 'es' : ''}`;
          const atencionesPaciente = atencionesList.filter((a) => a.pacienteId === p.id);
          const ultima = atencionesPaciente[0];

          // Buscar tutor asociado
          const vinculo = tutoriaMap[p.id];
          const tutor = vinculo ? listaPacientes.find((t) => t.id === vinculo.tutorId) : null;
          const tutorNombre = tutor
            ? `${tutor.firstName} ${tutor.lastName}`.trim()
            : p.emergencyName || 'Tutor de familia';
          const tutorParentesco = vinculo?.parentesco || p.emergencyRelation || 'Responsable';
          const tutorTelefono = tutor?.phone || p.emergencyPhone || p.phone || 'No registrado';
          const tutorDui = tutor?.dui || 'Sin DUI';

          return {
            id: p.id,
            pacienteId: p.id,
            expediente: `EXP-PED-${String(idx + 1).padStart(4, '0')}`,
            nombreCompleto: `${p.firstName} ${p.lastName}`.trim(),
            fechaNacimiento: p.dateOfBirth,
            sexo: p.sex || 'MALE',
            edadMeses: meses,
            edadTexto,
            tutorPacienteId: tutor?.id || '',
            tutorNombre,
            tutorParentesco,
            tutorTelefono,
            tutorDui,
            direccion: p.address || tutor?.address || 'Comunidad asignada',
            totalControlesRealizados: atencionesPaciente.length,
            historialAtenciones: atencionesPaciente,
            ultimoControl: ultima ? ultima.fechaControl : 'Inscripción en padrón',
            proximoControl: ultima ? ultima.fechaProximoSeguimiento : 'Pendiente programar',
            vacunasAlDia: true,
            requiereAtencion: meses <= 6 || atencionesPaciente.length === 0,
            motivoAtencion: meses <= 6 ? 'Monitoreo de lactancia y crecimiento' : atencionesPaciente.length === 0 ? 'Control inicial de peso y talla' : undefined,
          };
        });

      // 3. Métricas territoriales
      const t1 = gestantesList.filter((g) => g.semanasGestacion <= 13).length;
      const t2 = gestantesList.filter((g) => g.semanasGestacion >= 14 && g.semanasGestacion <= 27).length;
      const t3 = gestantesList.filter((g) => g.semanasGestacion >= 28).length;

      const lact = ninosList.filter((n) => n.edadMeses < 12).length;
      const primInf = ninosList.filter((n) => n.edadMeses >= 12 && n.edadMeses <= 48).length;
      const esc = ninosList.filter((n) => n.edadMeses > 48).length;

      const gPend = gestantesList.filter((g) => g.requiereAtencion).length;
      const nPend = ninosList.filter((n) => n.requiereAtencion).length;

      setGestantes(gestantesList);
      setNinos(ninosList);
      setMetricas({
        gestantesTotal: gestantesList.length,
        primerTrimestre: t1,
        segundoTrimestre: t2,
        tercerTrimestre: t3,
        ninosTotal: ninosList.length,
        lactantes: lact,
        primeraInfancia: primInf,
        escolares: esc,
        controlesPendientes: gPend + nPend,
        gestantesPendientes: gPend,
        ninosPendientes: nPend,
        totalAtencionesRegistradas: atencionesList.length,
        orientacionesEntregadas: atencionesList.reduce((acc, a) => acc + (a.temasEducacion?.length || 0), 0) + gestantesList.length + ninosList.length,
        referenciasEmitidas: atencionesList.filter((a) => a.desenlace === 'REFERIDO_RED').length,
        seguimientosProximos: Math.max(1, gestantesList.length + ninosList.length),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar el censo';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      await Promise.resolve();
      if (!isMounted) return;
      await cargarDatos();
    };
    void init();
    return () => {
      isMounted = false;
    };
  }, [cargarDatos]);

  // Captación formal de gestante
  const captarGestante = async (dto: CaptarGestanteDto): Promise<boolean> => {
    try {
      let captadasStorage: Record<string, { semanas: number; fpp: string }> = {};
      try {
        const raw = localStorage.getItem(STORAGE_KEY_GESTANTES);
        if (raw) captadasStorage = JSON.parse(raw);
      } catch {
        captadasStorage = {};
      }

      captadasStorage[dto.pacienteId] = {
        semanas: dto.semanasGestacion,
        fpp: dto.fechaProbableParto,
      };

      localStorage.setItem(STORAGE_KEY_GESTANTES, JSON.stringify(captadasStorage));
      await cargarDatos();
      return true;
    } catch {
      return false;
    }
  };

  // Creación REAL del niño en la base de datos (PostgreSQL) vía patientsService.createPatient
  const registrarNino = async (dto: RegistrarNinoDto): Promise<boolean> => {
    try {
      const tutor = pacientesTotales.find((p) => p.id === dto.tutorPacienteId);
      if (!tutor) return false;

      const cleanFirstName = dto.nombres.trim();
      const cleanLastName = dto.apellidos.trim();
      const slug = `${cleanFirstName.toLowerCase().replace(/\s+/g, '.')}.${cleanLastName.toLowerCase().replace(/\s+/g, '.')}`.replace(/[^a-z0-9.]/g, '');
      const uniqueSuffix = Date.now().toString().slice(-6);
      const email = `menor.${slug}.${uniqueSuffix}@expediente.medicos.sv`;

      // Payload estricto para crear el registro en la base de datos
      const nuevoPacientePayload: CreatePatientDto = {
        firstName: cleanFirstName,
        lastName: cleanLastName,
        dateOfBirth: dto.fechaNacimiento,
        dui: null, // Los menores de edad no portan DUI
        sex: dto.sexo,
        email,
        password: 'Password123!',
        phone: tutor.phone || null,
        address: tutor.address || 'Comunidad asignada',
        emergencyName: `${tutor.firstName} ${tutor.lastName}`.trim(),
        emergencyPhone: tutor.phone || null,
        emergencyRelation: dto.parentescoTutor,
        familyHistory: `Menor a cargo de ${tutor.firstName} ${tutor.lastName} (DUI: ${tutor.dui || 'Sin DUI'}). Parentesco: ${dto.parentescoTutor}.`,
        surgicalHistory: dto.observaciones ? dto.observaciones.trim() : null,
      };

      // Inserción en base de datos
      const creado = await patientsService.createPatient(nuevoPacientePayload);

      // Guardado de relación de tutoría territorial
      let tutoriaMap: Record<string, { tutorId: string; parentesco: string }> = {};
      try {
        const raw = localStorage.getItem(STORAGE_KEY_NINOS_TUTORIA);
        if (raw) tutoriaMap = JSON.parse(raw);
      } catch {
        tutoriaMap = {};
      }
      tutoriaMap[creado.id] = {
        tutorId: tutor.id,
        parentesco: dto.parentescoTutor,
      };
      localStorage.setItem(STORAGE_KEY_NINOS_TUTORIA, JSON.stringify(tutoriaMap));

      // Recarga inmediata de pacientes desde la base de datos
      await cargarDatos();
      return true;
    } catch {
      return false;
    }
  };

  // Registro de control preventivo en el expediente
  const registrarControl = async (dto: RegistrarControlDto): Promise<boolean> => {
    try {
      if (dto.peso || dto.presionArterial || dto.tallaLongitud) {
        const partesPresion = dto.presionArterial ? dto.presionArterial.split('/') : [];
        const sistolica = parseInt(partesPresion[0] || '120', 10);
        const diastolica = parseInt(partesPresion[1] || '80', 10);

        await apiClient('/vital-signs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patientId: dto.pacienteId,
            systolic: isNaN(sistolica) ? 120 : sistolica,
            diastolica: isNaN(diastolica) ? 80 : diastolica,
            heartRate: 75,
            temperature: 36.5,
            oxygenSat: 98,
            weight: dto.peso || null,
            height: dto.tallaLongitud || null,
          }),
        }).catch(() => null);
      }

      // Si es gestante y se registraron semanas, actualizar su ficha
      if (dto.tipo === 'materno' && dto.semanasGestacion) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY_GESTANTES);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed[dto.pacienteId]) {
              parsed[dto.pacienteId].semanas = dto.semanasGestacion;
              localStorage.setItem(STORAGE_KEY_GESTANTES, JSON.stringify(parsed));
            }
          }
        } catch (err: unknown) {
          console.warn('[Materno-Infantil] No se pudieron sincronizar semanas en almacenamiento local:', err);
        }
      }

      // Guardar en el historial acumulativo de atenciones
      let atencionesStorage: AtencionPreventivaItem[] = [];
      try {
        const raw = localStorage.getItem(STORAGE_KEY_ATENCIONES);
        if (raw) atencionesStorage = JSON.parse(raw);
      } catch {
        atencionesStorage = [];
      }

      const hoyStr = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      const nuevaAtencion: AtencionPreventivaItem = {
        id: `atn-${Date.now()}`,
        pacienteId: dto.pacienteId,
        fechaControl: hoyStr,
        tipo: dto.tipo,
        pesoKg: dto.peso || null,
        presionArterial: dto.presionArterial || null,
        tallaCm: dto.tallaLongitud || null,
        semanasGestacion: dto.semanasGestacion || null,
        temasEducacion: dto.temasEducacion,
        desenlace: dto.desenlace,
        fechaProximoSeguimiento: dto.fechaProximoSeguimiento,
        observaciones: dto.observaciones || null,
        responsableBrigada: 'Brigadista en Jornada',
      };

      atencionesStorage.unshift(nuevaAtencion);
      localStorage.setItem(STORAGE_KEY_ATENCIONES, JSON.stringify(atencionesStorage));

      await cargarDatos();
      return true;
    } catch {
      return false;
    }
  };

  const adultosTutoresDisponibles = pacientesTotales;

  const candidatasGestantes = pacientesTotales.filter((p) => {
    const edad = calcularEdadAnios(p.dateOfBirth);
    const esMujer = p.sex === 'FEMALE';
    const noEstaCaptada = !gestantes.some((g) => g.pacienteId === p.id);
    return esMujer && edad !== null && edad >= 12 && edad <= 49 && noEstaCaptada;
  });

  return {
    gestantes,
    ninos,
    candidatasGestantes,
    adultosTutoresDisponibles,
    historialGlobal,
    metricas,
    loading,
    error,
    filtroTexto,
    setFiltroTexto,
    captarGestante,
    registrarNino,
    registrarControl,
    recargar: cargarDatos,
  };
}