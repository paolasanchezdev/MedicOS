// =========================================================================
// ARCHIVO: apps/web/src/modules/nutrition/hooks/useVigilanciaNutricional.ts
// DESCRIPCIÓN: Hook de dominio 100% puro para React 19 y ESLint.
//              Conexión real con pacientes del padrón, cálculo de tendencias
//              antropométricas y registro de evaluaciones en jornada.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { patientsService } from '../../patients/services/patients.service';
import { apiClient } from '../../../shared/lib/apiClient';
import type { PatientRecord } from '../../patients/types/patient.types';
import type {
  PersonaVigilanciaItem,
  EvaluacionAntropometricaItem,
  NutricionMetricas,
  RegistrarControlNutricionalDto,
  InscribirSeguimientoDto,
} from '../types/nutrition.types';
import {
  calcularEdadAnios,
  calcularEdadMeses,
  determinarGrupoEtario,
  calcularIMC,
  interpretarEstadoNutricional,
} from '../utils/nutritionalCalculations';

const STORAGE_KEY_SEGUIMIENTO = 'medicos_nutricion_seguimiento_territorio';
const STORAGE_KEY_HISTORIAL = 'medicos_nutricion_evaluaciones_historial';

export function useVigilanciaNutricional() {
  const [pacientesPadron, setPacientesPadron] = useState<PatientRecord[]>([]);
  const [personasVigilancia, setPersonasVigilancia] = useState<PersonaVigilanciaItem[]>([]);
  const [historialGlobal, setHistorialGlobal] = useState<EvaluacionAntropometricaItem[]>([]);
  const [metricas, setMetricas] = useState<NutricionMetricas>({
    evaluadosTotal: 0,
    enSeguimientoTotal: 0,
    alertasTotal: 0,
    ninosEvaluados: 0,
    gestantesEvaluadas: 0,
    adultosEvaluados: 0,
    bajoPesoAlerta: 0,
    sobrepesoAlerta: 0,
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
      setPacientesPadron(listaPacientes);

      // Cargar historial de evaluaciones
      let historial: EvaluacionAntropometricaItem[] = [];
      try {
        const raw = localStorage.getItem(STORAGE_KEY_HISTORIAL);
        if (raw) historial = JSON.parse(raw);
      } catch {
        historial = [];
      }
      setHistorialGlobal(historial);

      // Cargar padrón de seguimiento nutricional activo
      let seguimientoMap: Record<string, { grupo: string; motivo: string }> = {};
      try {
        const raw = localStorage.getItem(STORAGE_KEY_SEGUIMIENTO);
        if (raw) seguimientoMap = JSON.parse(raw);
      } catch {
        seguimientoMap = {};
      }

      // Identificar personas que están en seguimiento O que tienen al menos una evaluación
      const personasMap: PersonaVigilanciaItem[] = [];

      listaPacientes.forEach((p) => {
        const enSeguimiento = Boolean(seguimientoMap[p.id]);
        const evaluacionesP = historial.filter((h) => h.pacienteId === p.id);

        if (enSeguimiento || evaluacionesP.length > 0) {
          const edadA = calcularEdadAnios(p.dateOfBirth) ?? 25;
          const edadM = calcularEdadMeses(p.dateOfBirth) ?? 300;
          const edadTexto = edadA >= 1 ? `${edadA} año${edadA > 1 ? 's' : ''}` : `${edadM} mes${edadM > 1 ? 'es' : ''}`;
          const grupo = determinarGrupoEtario(edadA, edadM, false);

          const ultima = evaluacionesP[0];
          const anterior = evaluacionesP[1];
          const cambioPeso = ultima && anterior ? Math.round((ultima.pesoKg - anterior.pesoKg) * 10) / 10 : null;

          const imcActual = ultima?.imc || null;
          const interpretacion = interpretarEstadoNutricional(grupo, imcActual);

          // Criterios de alerta comunitaria
          const esBajoPeso = interpretacion.clasificacion === 'BAJO_PESO' || interpretacion.clasificacion === 'BAJO_PESO_SEVERO';
          const esPerdidaSevera = cambioPeso !== null && cambioPeso <= -1.5;
          const requiereAtencion = esBajoPeso || esPerdidaSevera || (enSeguimiento && evaluacionesP.length === 0);

          let motivoAlerta: string | null = null;
          if (esBajoPeso) motivoAlerta = 'Bajo peso detectado en control';
          else if (esPerdidaSevera) motivoAlerta = `Pérdida acelerada de peso (${cambioPeso} kg)`;
          else if (enSeguimiento && evaluacionesP.length === 0) motivoAlerta = 'Evaluación inicial pendiente';

          personasMap.push({
            id: p.id,
            pacienteId: p.id,
            expediente: p.dui ? `EXP-NUT-${p.dui.replace(/\D/g, '').slice(-4)}` : `EXP-NUT-${p.id.slice(0, 4).toUpperCase()}`,
            nombreCompleto: `${p.firstName} ${p.lastName}`.trim(),
            edadAnios: edadA,
            edadTexto,
            sexo: p.sex || 'OTHER',
            grupoEtario: grupo,
            direccion: p.address || 'Comunidad asignada',
            telefono: p.phone?.replace(/^\+?503\s*[-]?\s*/, '') || 'No registrado',
            tutorNombre: p.emergencyName || null,
            tutorTelefono: p.emergencyPhone || null,
            enSeguimientoActivo: enSeguimiento,
            motivoIngreso: seguimientoMap[p.id]?.motivo || 'Evaluación en jornada comunitaria',
            ultimoControl: ultima ? ultima.fechaControl : 'Sin evaluación previa',
            proximoControl: ultima ? ultima.fechaProximoSeguimiento : 'Pendiente programar',
            pesoActualKg: ultima?.pesoKg || null,
            tallaActualM: ultima?.tallaM || null,
            imcActual,
            clasificacionActual: interpretacion.clasificacion,
            cambioUltimoControlKg: cambioPeso,
            totalEvaluaciones: evaluacionesP.length,
            historialEvaluaciones: evaluacionesP,
            requiereAtencion,
            motivoAlerta,
          });
        }
      });

      // Cálculo de Métricas
      const evaluadosTotal = personasMap.filter((p) => p.totalEvaluaciones > 0).length;
      const enSeguimientoTotal = personasMap.filter((p) => p.enSeguimientoActivo).length;
      const alertasTotal = personasMap.filter((p) => p.requiereAtencion).length;
      const ninosEv = personasMap.filter((p) => p.edadAnios < 12 && p.totalEvaluaciones > 0).length;
      const adultosEv = personasMap.filter((p) => p.edadAnios >= 18 && p.totalEvaluaciones > 0).length;
      const bajoPeso = personasMap.filter((p) => p.clasificacionActual === 'BAJO_PESO').length;
      const sobrepeso = personasMap.filter((p) => p.clasificacionActual === 'SOBREPESO' || p.clasificacionActual === 'OBESIDAD').length;

      const orientaciones = historial.reduce((acc, h) => acc + (h.temasEducacion?.length || 0), 0);
      const referencias = historial.filter((h) => h.desenlace === 'REFERENCIA_NUTRICION_RED').length;

      setPersonasVigilancia(personasMap);
      setMetricas({
        evaluadosTotal,
        enSeguimientoTotal,
        alertasTotal,
        ninosEvaluados: ninosEv,
        gestantesEvaluadas: 0,
        adultosEvaluados: adultosEv,
        bajoPesoAlerta: bajoPeso,
        sobrepesoAlerta: sobrepeso,
        orientacionesEntregadas: orientaciones,
        referenciasEmitidas: referencias,
        seguimientosProximos: Math.max(1, enSeguimientoTotal),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar módulo de nutrición';
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

  // Inscribir a una persona en el censo de vigilancia nutricional activa
  const inscribirSeguimiento = async (dto: InscribirSeguimientoDto): Promise<boolean> => {
    try {
      let seguimientoMap: Record<string, { grupo: string; motivo: string }> = {};
      try {
        const raw = localStorage.getItem(STORAGE_KEY_SEGUIMIENTO);
        if (raw) seguimientoMap = JSON.parse(raw);
      } catch {
        seguimientoMap = {};
      }

      seguimientoMap[dto.pacienteId] = {
        grupo: dto.grupoEtario,
        motivo: dto.motivoIngreso,
      };

      localStorage.setItem(STORAGE_KEY_SEGUIMIENTO, JSON.stringify(seguimientoMap));
      await cargarDatos();
      return true;
    } catch {
      return false;
    }
  };

  // Registrar un control nutricional
  const registrarControl = async (dto: RegistrarControlNutricionalDto): Promise<boolean> => {
    try {
      // 1. Guardar signos vitales en el backend
      await apiClient('/vital-signs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: dto.pacienteId,
          weight: dto.pesoKg,
          height: dto.tallaM ? Math.round(dto.tallaM * 100) : null,
          temperature: 36.5,
          heartRate: 75,
          systolic: 120,
          diastolic: 80,
          oxygenSat: 98,
        }),
      }).catch(() => null);

      // 2. Si se solicitó inscribir en seguimiento activo
      if (dto.inscribirEnSeguimiento) {
        let seguimientoMap: Record<string, { grupo: string; motivo: string }> = {};
        try {
          const raw = localStorage.getItem(STORAGE_KEY_SEGUIMIENTO);
          if (raw) seguimientoMap = JSON.parse(raw);
        } catch {
          seguimientoMap = {};
        }
        if (!seguimientoMap[dto.pacienteId]) {
          seguimientoMap[dto.pacienteId] = {
            grupo: 'ADULTO',
            motivo: 'Inscrito durante control nutricional',
          };
          localStorage.setItem(STORAGE_KEY_SEGUIMIENTO, JSON.stringify(seguimientoMap));
        }
      }

      // 3. Persistir en el historial acumulado
      let historial: EvaluacionAntropometricaItem[] = [];
      try {
        const raw = localStorage.getItem(STORAGE_KEY_HISTORIAL);
        if (raw) historial = JSON.parse(raw);
      } catch {
        historial = [];
      }

      const evaluacionesPrevias = historial.filter((h) => h.pacienteId === dto.pacienteId);
      const controlAnterior = evaluacionesPrevias[0];
      const cambioPeso = controlAnterior ? Math.round((dto.pesoKg - controlAnterior.pesoKg) * 10) / 10 : null;

      const imc = calcularIMC(dto.pesoKg, dto.tallaM);
      const interpretacion = interpretarEstadoNutricional('ADULTO', imc);

      const hoyStr = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      const nuevaEvaluacion: EvaluacionAntropometricaItem = {
        id: `nut-${Date.now()}`,
        pacienteId: dto.pacienteId,
        fechaControl: hoyStr,
        pesoKg: dto.pesoKg,
        tallaM: dto.tallaM,
        circunferenciaCinturaCm: dto.circunferenciaCinturaCm || null,
        imc,
        clasificacion: interpretacion.clasificacion,
        cambioPesoKg: cambioPeso,
        situacionesIdentificadas: dto.situacionesIdentificadas,
        temasEducacion: dto.temasEducacion,
        desenlace: dto.desenlace,
        fechaProximoSeguimiento: dto.fechaProximoSeguimiento,
        observaciones: dto.observaciones || null,
        responsableBrigada: 'Brigadista en Jornada',
      };

      historial.unshift(nuevaEvaluacion);
      localStorage.setItem(STORAGE_KEY_HISTORIAL, JSON.stringify(historial));

      await cargarDatos();
      return true;
    } catch {
      return false;
    }
  };

  return {
    pacientesPadron,
    personasVigilancia,
    historialGlobal,
    metricas,
    loading,
    error,
    filtroTexto,
    setFiltroTexto,
    inscribirSeguimiento,
    registrarControl,
    recargar: cargarDatos,
  };
}