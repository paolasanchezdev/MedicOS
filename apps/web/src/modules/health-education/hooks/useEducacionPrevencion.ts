// =========================================================================
// ARCHIVO: apps/web/src/modules/health-education/hooks/useEducacionPrevencion.ts
// DESCRIPCIÓN: Hook de dominio 100% puro para React 19 y ESLint.
//              Vinculación estricta y limpia sin inferencias automáticas erróneas.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { patientsService } from '../../patients/services/patients.service';
import type { PatientRecord } from '../../patients/types/patient.types';
import type {
  ActividadEducativaItem,
  ControlVectoresItem,
  EducacionPrevencionMetricas,
  RegistrarActividadEducativaDto,
  RegistrarControlVectoresDto,
  ArticuloGuiaRef,
} from '../types/health-education.types';
import { ALL_HEALTH_ARTICLES } from '../data/articles';

const STORAGE_KEY_EDUCACION = 'medicos_actividades_educacion_territorio';
const STORAGE_KEY_VECTORES = 'medicos_control_vectores_territorio';

function esFechaDeHoy(fechaStr: string): boolean {
  if (!fechaStr) return false;
  const hoy = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return fechaStr.trim() === hoy.trim();
}

// Resuelve de forma estricta ÚNICAMENTE artículos que coincidan exactamente con ID o título
function resolverArticulosEstrictos(
  temas: string[] = [],
  articulosPrevios?: ArticuloGuiaRef[]
): ArticuloGuiaRef[] {
  // Si ya tiene artículos previos válidos, filtrar cualquier residuo accidental de diarreicas
  if (articulosPrevios && articulosPrevios.length > 0) {
    return articulosPrevios.filter((a) => a.id !== 'art-prev-6' && !a.title.toLowerCase().includes('diarreica'));
  }

  const resultado: ArticuloGuiaRef[] = [];

  temas.forEach((tema) => {
    const tLower = tema.toLowerCase().trim();
    // Excluir terminantemente diarreicas si se originó de vectores
    if (tLower.includes('diarreica') || tLower.includes('diarrea')) return;

    const encontrado = ALL_HEALTH_ARTICLES.find(
      (art) =>
        art.id === tema ||
        art.title.toLowerCase().trim() === tLower ||
        (tLower.includes('dengue') && art.id === 'art-prev-1') ||
        (tLower.includes('criadero') && art.id === 'art-prev-2')
    );

    if (encontrado && !resultado.some((r) => r.id === encontrado.id)) {
      resultado.push({
        id: encontrado.id,
        slug: encontrado.slug,
        title: encontrado.title,
        category: encontrado.category,
        categoryLabel: encontrado.categoryLabel,
        summary: encontrado.summary,
        keyPoints: encontrado.keyPoints,
      });
    }
  });

  return resultado;
}

export function useEducacionPrevencion() {
  const [pacientesPadron, setPacientesPadron] = useState<PatientRecord[]>([]);
  const [actividadesEducativas, setActividadesEducativas] = useState<ActividadEducativaItem[]>([]);
  const [controlesVectores, setControlesVectores] = useState<ControlVectoresItem[]>([]);
  const [metricas, setMetricas] = useState<EducacionPrevencionMetricas>({
    actividadesEducativasTotal: 0,
    accionesVectoresTotal: 0,
    personasAlcanzadasTotal: 0,
    viviendasInspeccionadasTotal: 0,
    viviendasConCriaderosTotal: 0,
    pendientesSeguimientoTotal: 0,
    actividadesHoy: 0,
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

      // 1. Cargar actividades educativas y purgar cualquier artículo de diarreicas no deseado
      let educacionList: ActividadEducativaItem[] = [];
      try {
        const rawEdu = localStorage.getItem(STORAGE_KEY_EDUCACION);
        if (rawEdu) {
          const parsed = JSON.parse(rawEdu);
          if (Array.isArray(parsed)) {
            educacionList = parsed.map((item: ActividadEducativaItem) => {
              const temasFiltrados = (item.temasAbordados || []).filter(
                (t) => !t.toLowerCase().includes('diarreica') && !t.toLowerCase().includes('diarrea')
              );

              return {
                ...item,
                temasAbordados: temasFiltrados,
                responsableBrigada: 'Carlos Pérez (Brigadista Territorial)',
                articulosGuia: resolverArticulosEstrictos(temasFiltrados, item.articulosGuia),
              };
            });
            localStorage.setItem(STORAGE_KEY_EDUCACION, JSON.stringify(educacionList));
          }
        }
      } catch (err: unknown) {
        console.warn('[Educación] Error leyendo almacenamiento local:', err);
      }

      // 2. Cargar controles de vectores
      let vectoresList: ControlVectoresItem[] = [];
      try {
        const rawVec = localStorage.getItem(STORAGE_KEY_VECTORES);
        if (rawVec) {
          const parsed = JSON.parse(rawVec);
          if (Array.isArray(parsed)) {
            vectoresList = parsed.map((item: ControlVectoresItem) => ({
              ...item,
              responsableBrigada: 'Carlos Pérez (Brigadista Territorial)',
            }));
            localStorage.setItem(STORAGE_KEY_VECTORES, JSON.stringify(vectoresList));
          }
        }
      } catch (err: unknown) {
        console.warn('[Vectores] Error leyendo almacenamiento local:', err);
      }

      // 3. Métricas reales de la jornada
      const personasAlcanzadas = educacionList.reduce((acc, a) => acc + (a.cantidadPersonas || 0), 0);
      const viviendasInsp = vectoresList.reduce((acc, v) => acc + (v.viviendasInspeccionadas || 0), 0);
      const viviendasCriaderos = vectoresList.reduce((acc, v) => acc + (v.viviendasConHallazgos || 0), 0);
      const pendientesSeg = vectoresList.filter((v) => v.requiereSeguimiento).length;
      const actHoy =
        educacionList.filter((e) => esFechaDeHoy(e.fecha)).length +
        vectoresList.filter((v) => esFechaDeHoy(v.fecha)).length;

      setActividadesEducativas(educacionList);
      setControlesVectores(vectoresList);
      setMetricas({
        actividadesEducativasTotal: educacionList.length,
        accionesVectoresTotal: vectoresList.length,
        personasAlcanzadasTotal: personasAlcanzadas,
        viviendasInspeccionadasTotal: viviendasInsp,
        viviendasConCriaderosTotal: viviendasCriaderos,
        pendientesSeguimientoTotal: pendientesSeg,
        actividadesHoy: actHoy,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar actividades territoriales';
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

  const registrarActividadEducativa = async (dto: RegistrarActividadEducativaDto): Promise<boolean> => {
    try {
      let educacionList: ActividadEducativaItem[] = [];
      try {
        const raw = localStorage.getItem(STORAGE_KEY_EDUCACION);
        if (raw) educacionList = JSON.parse(raw);
      } catch (err: unknown) {
        console.warn('[Educación] Error al parsear lista previa:', err);
      }

      let pacNombre: string | null = null;
      let pacExp: string | null = null;
      if (dto.pacienteId) {
        const p = pacientesPadron.find((pac) => pac.id === dto.pacienteId);
        if (p) {
          pacNombre = `${p.firstName} ${p.lastName}`.trim();
          pacExp = p.dui ? `EXP-${p.dui.replace(/\D/g, '').slice(-4)}` : `EXP-${p.id.slice(0, 4).toUpperCase()}`;
        }
      }

      const articulosReales = resolverArticulosEstrictos(dto.temasAbordados, dto.articulosGuia);

      const nueva: ActividadEducativaItem = {
        id: `edu-${Date.now()}`,
        fecha: dto.fecha,
        lugar: dto.lugar.trim(),
        sector: dto.sector?.trim(),
        modalidad: dto.modalidad,
        pacienteId: dto.pacienteId || null,
        pacienteNombre: pacNombre,
        pacienteExpediente: pacExp,
        cantidadPersonas: dto.modalidad === 'INDIVIDUAL' ? 1 : dto.cantidadPersonas,
        gruposPoblacionales: dto.gruposPoblacionales,
        temasAbordados: articulosReales.map((a) => a.title),
        articulosGuia: articulosReales,
        materialUtilizado: dto.materialUtilizado,
        observaciones: dto.observaciones?.trim() || null,
        responsableBrigada: 'Carlos Pérez (Brigadista Territorial)',
      };

      educacionList.unshift(nueva);
      localStorage.setItem(STORAGE_KEY_EDUCACION, JSON.stringify(educacionList));
      await cargarDatos();
      return true;
    } catch {
      return false;
    }
  };

  const registrarControlVectores = async (dto: RegistrarControlVectoresDto): Promise<boolean> => {
    try {
      let vectoresList: ControlVectoresItem[] = [];
      try {
        const raw = localStorage.getItem(STORAGE_KEY_VECTORES);
        if (raw) vectoresList = JSON.parse(raw);
      } catch (err: unknown) {
        console.warn('[Vectores] Error al parsear lista previa:', err);
      }

      const nuevo: ControlVectoresItem = {
        id: `vec-${Date.now()}`,
        fecha: dto.fecha,
        comunidad: dto.comunidad.trim(),
        sector: dto.sector.trim(),
        referenciaUbicacion: dto.referenciaUbicacion?.trim() || null,
        tipoActividad: dto.tipoActividad,
        viviendasInspeccionadas: dto.viviendasInspeccionadas,
        viviendasConHallazgos: dto.viviendasConHallazgos,
        hallazgos: dto.hallazgos,
        accionesRealizadas: dto.accionesRealizadas,
        requiereSeguimiento: dto.requiereSeguimiento,
        motivoSeguimiento: dto.motivoSeguimiento?.trim() || null,
        fechaPropuestaSeguimiento: dto.fechaPropuestaSeguimiento || null,
        observaciones: dto.observaciones?.trim() || null,
        responsableBrigada: 'Carlos Pérez (Brigadista Territorial)',
      };

      vectoresList.unshift(nuevo);
      localStorage.setItem(STORAGE_KEY_VECTORES, JSON.stringify(vectoresList));

      // Si se vinculó consejería simultánea de vectores, asociar únicamente Dengue y Criaderos
      if (dto.incluirEducacionSimultanea) {
        const articulosDengue: ArticuloGuiaRef[] = ALL_HEALTH_ARTICLES.filter(
          (art) => art.id === 'art-prev-1' || art.id === 'art-prev-2'
        ).map((art) => ({
          id: art.id,
          slug: art.slug,
          title: art.title,
          category: art.category,
          categoryLabel: art.categoryLabel,
          summary: art.summary,
          keyPoints: art.keyPoints,
        }));

        let educacionList: ActividadEducativaItem[] = [];
        try {
          const raw = localStorage.getItem(STORAGE_KEY_EDUCACION);
          if (raw) educacionList = JSON.parse(raw);
        } catch { /* empty */ }

        educacionList.unshift({
          id: `edu-simultanea-${Date.now()}`,
          fecha: dto.fecha,
          lugar: dto.comunidad.trim(),
          sector: dto.sector.trim(),
          modalidad: 'FAMILIAR',
          cantidadPersonas: dto.viviendasInspeccionadas * 3,
          gruposPoblacionales: ['Familias', 'Comunidad general'],
          temasAbordados: articulosDengue.map((a) => a.title),
          articulosGuia: articulosDengue,
          materialUtilizado: ['Orientación familiar directa', 'Demostración práctica'],
          observaciones: `Consejería preventiva sobre control de criaderos brindada durante inspección ambiental en ${dto.comunidad}.`,
          responsableBrigada: 'Carlos Pérez (Brigadista Territorial)',
        });
        localStorage.setItem(STORAGE_KEY_EDUCACION, JSON.stringify(educacionList));
      }

      await cargarDatos();
      return true;
    } catch {
      return false;
    }
  };

  const eliminarActividad = async (tipo: 'educacion' | 'vectores', id: string): Promise<boolean> => {
    try {
      if (tipo === 'educacion') {
        const raw = localStorage.getItem(STORAGE_KEY_EDUCACION);
        const lista = raw ? JSON.parse(raw) : [];
        const filtrada = lista.filter((item: ActividadEducativaItem) => item.id !== id);
        localStorage.setItem(STORAGE_KEY_EDUCACION, JSON.stringify(filtrada));
      } else {
        const raw = localStorage.getItem(STORAGE_KEY_VECTORES);
        const lista = raw ? JSON.parse(raw) : [];
        const filtrada = lista.filter((item: ControlVectoresItem) => item.id !== id);
        localStorage.setItem(STORAGE_KEY_VECTORES, JSON.stringify(filtrada));
      }
      await cargarDatos();
      return true;
    } catch {
      return false;
    }
  };

  return {
    pacientesPadron,
    actividadesEducativas,
    controlesVectores,
    metricas,
    loading,
    error,
    filtroTexto,
    setFiltroTexto,
    registrarActividadEducativa,
    registrarControlVectores,
    eliminarActividad,
    recargar: cargarDatos,
  };
}