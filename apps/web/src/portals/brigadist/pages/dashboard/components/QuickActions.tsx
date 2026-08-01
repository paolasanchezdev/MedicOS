import React from 'react';
import { UserPlus, QrCode, FileText, RefreshCw, ArrowRight, Zap, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBrigade } from '@/modules/brigades/hooks/useBrigade';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { triggerSync, isSyncing } = useBrigade();

  const actions = [
    {
      title: 'Registrar Paciente',
      desc: 'Añadir nuevo expediente al sistema',
      icon: UserPlus,
      onClick: () => navigate('/brigadista/pacientes'),
      style: 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 border-teal-500',
      iconBg: 'bg-white/15 text-white',
    },
    {
      title: 'Escanear Carné',
      desc: 'Lectura rápida por código QR',
      icon: QrCode,
      onClick: () => navigate('/brigadista/escanear'),
      style: 'bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/10 border-slate-800',
      iconBg: 'bg-white/15 text-white',
    },
    {
      title: 'Nueva Consulta',
      desc: 'Iniciar registro médico en campo',
      icon: FileText,
      onClick: () => navigate('/brigadista/consultas'),
      style: 'bg-slate-50 hover:bg-slate-100/80 text-slate-800 border-slate-200/80',
      iconBg: 'bg-white text-teal-700 shadow-xs border border-slate-200/60',
    },
    {
      title: isSyncing ? 'Sincronizando...' : 'Forzar Sincro',
      desc: isSyncing ? 'Subiendo cambios locales...' : 'Actualizar base de datos local',
      icon: isSyncing ? Loader2 : RefreshCw,
      onClick: () => triggerSync?.(),
      style: 'bg-slate-50 hover:bg-slate-100/80 text-slate-800 border-slate-200/80',
      iconBg: 'bg-white text-teal-700 shadow-xs border border-slate-200/60',
      spin: isSyncing,
    },
  ];

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          Acciones Rápidas
        </h3>
        <span className="text-[10px] font-medium text-slate-400">Teclas rápidas</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={action.onClick}
              disabled={action.spin}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 text-left group active:scale-[0.98] ${action.style}`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-105 ${action.iconBg}`}>
                  <Icon className={`w-4 h-4 ${action.spin ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight tracking-tight">{action.title}</h4>
                  <p className="text-[11px] opacity-80 mt-0.5 font-normal">
                    {action.desc}
                  </p>
                </div>
              </div>
              <div className="p-1 rounded-lg opacity-60 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;