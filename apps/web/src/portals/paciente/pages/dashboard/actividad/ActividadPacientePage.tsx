import React, { useState } from 'react';
import { Stethoscope, Pill, Activity, FileText, Filter } from 'lucide-react';

interface ActividadItem {
  id: string;
  fechaGrupo: 'Hoy' | 'Ayer' | 'Esta semana';
  tipo: 'CONSULTA' | 'MEDICAMENTO' | 'ESTUDIO' | 'EXPEDIENTE' | 'RECETA';
  titulo: string;
  descripcion: string;
  hora: string;
}

export const ActividadPacientePage: React.FC = () => {
  const [filtro, setFiltro] = useState<string>('Todo');

  const actividades: ActividadItem[] = [
    { id: '1', fechaGrupo: 'Hoy', tipo: 'MEDICAMENTO', titulo: 'Medicamento tomado', descripcion: 'Omeprazol 20 mg - Dosis matutina registrada', hora: 'Hace 2 horas' },
    { id: '2', fechaGrupo: 'Ayer', tipo: 'CONSULTA', titulo: 'Consulta médica', descripcion: 'Cardiología — Dr. Roberto Gómez (Revisión general)', hora: 'Ayer, 10:42 AM' },
    { id: '3', fechaGrupo: 'Ayer', tipo: 'ESTUDIO', titulo: 'Resultado de laboratorio', descripcion: 'Perfil lipídico completo disponible en expediente', hora: 'Ayer, 08:15 AM' },
    { id: '4', fechaGrupo: 'Esta semana', tipo: 'RECETA', titulo: 'Receta actualizada', descripcion: 'Losartán 50 mg añadida al tratamiento activo', hora: '05 Ago, 03:20 PM' },
    { id: '5', fechaGrupo: 'Esta semana', tipo: 'EXPEDIENTE', titulo: 'Documento clínico agregado', descripcion: 'Certificado de aptitud física general', hora: '04 Ago, 11:00 AM' }
  ];

  const categorias = ['Todo', 'Consultas', 'Medicamentos', 'Estudios', 'Expediente'];

  const filtrarActividad = (item: ActividadItem) => {
    if (filtro === 'Todo') return true;
    if (filtro === 'Consultas' && item.tipo === 'CONSULTA') return true;
    if (filtro === 'Medicamentos' && (item.tipo === 'MEDICAMENTO' || item.tipo === 'RECETA')) return true;
    if (filtro === 'Estudios' && item.tipo === 'ESTUDIO') return true;
    if (filtro === 'Expediente' && item.tipo === 'EXPEDIENTE') return true;
    return false;
  };

  const actividadesFiltradas = actividades.filter(filtrarActividad);
  const grupos = ['Hoy', 'Ayer', 'Esta semana'] as const;

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'MEDICAMENTO':
      case 'RECETA':
        return <Pill className="w-4 h-4 text-sky-600" />;
      case 'CONSULTA':
        return <Stethoscope className="w-4 h-4 text-medicos-teal" />;
      case 'ESTUDIO':
        return <Activity className="w-4 h-4 text-indigo-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* ENCABEZADO */}
      <div className="space-y-1 pt-2">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Historial de Actividad
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Registro cronológico de tu expediente, consultas y tratamientos.
        </p>
      </div>

      {/* FILTROS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold pr-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Filtrar:
        </div>
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
              filtro === cat 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'bg-white border border-slate-200/70 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LISTA AGRUPADA */}
      <div className="space-y-6">
        {grupos.map((grupo) => {
          const itemsGrupo = actividadesFiltradas.filter((item) => item.fechaGrupo === grupo);
          if (itemsGrupo.length === 0) return null;

          return (
            <div key={grupo} className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{grupo}</h3>
              
              <div className="space-y-3 relative pl-4 before:absolute before:left-1.75 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-100">
                {itemsGrupo.map((act) => (
                  <div key={act.id} className="relative flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs group">
                    <div className="absolute -left-4 top-5 w-3.5 h-3.5 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0">
                      {getIcon(act.tipo)}
                    </div>

                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{act.titulo}</h4>
                        <span className="text-[11px] font-medium text-slate-400">{act.hora}</span>
                      </div>
                      <p className="text-xs text-slate-600">{act.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ActividadPacientePage;