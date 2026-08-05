import React from 'react';
import {
  Sparkles,
  Activity,
  Users,
  ShieldAlert,
  TrendingUp,
  Download,
  Share2,
  AlertTriangle,
} from 'lucide-react';

export const ResumenAutoridadPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-medicos-dark-blue">
            Centro de Inteligencia Sanitaria
          </h1>
          <p className="text-sm text-medicos-muted mt-0.5">
            Panel Ejecutivo de Vigilancia Epidemiológica y Cobertura Nacional
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-medicos-surface border border-medicos-soft-border rounded-xl text-xs font-medium text-medicos-dark-blue hover:bg-medicos-light-bg transition-colors">
            <Download className="w-4 h-4 text-medicos-teal" />
            <span>Exportar Informe</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-medicos-surface border border-medicos-soft-border rounded-xl text-xs font-medium text-medicos-dark-blue hover:bg-medicos-light-bg transition-colors">
            <Share2 className="w-4 h-4 text-medicos-teal" />
            <span>Compartir</span>
          </button>
          <div className="flex items-center gap-2 bg-medicos-teal/10 text-medicos-teal px-3 py-2 rounded-xl text-xs font-semibold border border-medicos-teal/20">
            <Sparkles className="w-4 h-4" />
            <span>IA Predictiva Activa</span>
          </div>
        </div>
      </header>

      {/* Grid de Tarjetas Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-medicos-surface border border-medicos-soft-border rounded-2xl shadow-2xs">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-medicos-muted font-medium">
              Brigadas Realizadas
            </span>
            <Activity className="w-4 h-4 text-medicos-teal" />
          </div>
          <p className="text-2xl font-bold text-medicos-dark-blue">142</p>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% este mes</span>
          </div>
        </div>

        <div className="p-4 bg-medicos-surface border border-medicos-soft-border rounded-2xl shadow-2xs">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-medicos-muted font-medium">
              Comunidades Cubiertas
            </span>
            <Users className="w-4 h-4 text-medicos-teal" />
          </div>
          <p className="text-2xl font-bold text-medicos-dark-blue">89</p>
          <span className="text-[11px] text-emerald-600 font-medium">
            78% del objetivo regional
          </span>
        </div>

        <div className="p-4 bg-medicos-surface border border-medicos-soft-border rounded-2xl shadow-2xs">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-medicos-muted font-medium">
              Pacientes Atendidos
            </span>
            <Users className="w-4 h-4 text-medicos-teal" />
          </div>
          <p className="text-2xl font-bold text-medicos-dark-blue">12,450</p>
          <span className="text-[11px] text-medicos-muted">
            Consultas registradas
          </span>
        </div>

        <div className="p-4 bg-medicos-surface border border-medicos-soft-border rounded-2xl shadow-2xs">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-medicos-muted font-medium">
              Alertas Prioritarias
            </span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">3 Activas</p>
          <span className="text-[11px] text-amber-600 font-medium">
            Atención requerida
          </span>
        </div>
      </div>

      {/* Analítica e Inteligencia Artificial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Síntesis IA */}
        <div className="lg:col-span-2 p-5 bg-medicos-surface border border-medicos-soft-border rounded-2xl shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-medicos-soft-border pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-medicos-teal" />
              <h2 className="font-bold text-medicos-dark-blue text-sm">
                Análisis Sintetizado por IA Sanitaria
              </h2>
            </div>
            <span className="text-[11px] text-medicos-muted">
              Actualizado hoy
            </span>
          </div>

          <div className="p-4 bg-medicos-light-bg/60 border border-medicos-soft-border/60 rounded-xl space-y-2 text-xs leading-relaxed text-medicos-dark-blue">
            <p>
              <strong className="text-medicos-teal font-semibold">
                Tendencia Respiratoria:
              </strong>{' '}
              Se detecta un incremento moderado de síntomas respiratorios en sectores rurales. Se aconseja movilizar brigadas móviles con insumos de diagnóstico rápido.
            </p>
            <p>
              <strong className="text-amber-600 font-semibold">
                Vigilancia Vectorial:
              </strong>{' '}
              Las condiciones climáticas actuales incrementan el índice larvario en municipios de baja cobertura.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-medicos-surface border border-medicos-soft-border rounded-xl">
              <span className="text-[11px] text-medicos-muted">Dengue</span>
              <p className="text-sm font-bold text-amber-600 mt-0.5">
                Riesgo Medio
              </p>
            </div>
            <div className="p-3 bg-medicos-surface border border-medicos-soft-border rounded-xl">
              <span className="text-[11px] text-medicos-muted">
                IRA (Infecciones Respiratorias)
              </span>
              <p className="text-sm font-bold text-rose-600 mt-0.5">
                Alerta Moderada
              </p>
            </div>
            <div className="p-3 bg-medicos-surface border border-medicos-soft-border rounded-xl">
              <span className="text-[11px] text-medicos-muted">
                Vacunación
              </span>
              <p className="text-sm font-bold text-emerald-600 mt-0.5">
                84% Cobertura
              </p>
            </div>
          </div>
        </div>

        {/* Panel de Alertas Rápidas */}
        <div className="p-5 bg-medicos-surface border border-medicos-soft-border rounded-2xl shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-medicos-soft-border pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-medicos-dark-blue text-sm">
              Alertas Epidemiológicas
            </h2>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                Zona Central
              </span>
              <p className="text-xs font-semibold text-rose-950">
                Aumento de Casos Febriles
              </p>
              <p className="text-[11px] text-rose-800">
                Seguimiento preventivo en proceso.
              </p>
            </div>

            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                Zona Paracentral
              </span>
              <p className="text-xs font-semibold text-amber-950">
                Refuerzo de Vacunación Requerido
              </p>
              <p className="text-[11px] text-amber-800">
                Próximas jornadas en programación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumenAutoridadPage;