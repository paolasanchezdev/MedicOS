// apps/web/src/portals/admin/pages/dashboard/resumen/ResumenPage.tsx
import { 
  Users, 
  Stethoscope, 
  Radio, 
  AlertTriangle, 
  ArrowUpRight, 
  RefreshCw, 
  Database, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export const ResumenPage = () => {
  // Datos métricos que se consumirán de la API REST / GraphQL
  const metrics = [
    { label: 'Pacientes Registrados', value: '1,284', subtext: '+12.5% este mes', icon: Users, status: 'neutral' },
    { label: 'Brigadas en Campo', value: '18', subtext: '4 activas hoy', icon: Stethoscope, status: 'success' },
    { label: 'Sincronización Nodos', value: '99.4%', subtext: 'Latencia: 24ms', icon: Radio, status: 'success' },
    { label: 'Alertas Pendientes', value: '3', subtext: 'Requieren revisión', icon: AlertTriangle, status: 'warning' },
  ];

  // Ejemplo de estructura de datos real recibida de la Base de Datos
  const recentBrigades = [
    { id: 'BRG-2026-004', region: 'Santiago Texacuangos', doctor: 'Dra. E. Zarya', patients: 42, status: 'En Proceso', sync: 'Sincronizado' },
    { id: 'BRG-2026-003', region: 'San Salvador Sur', doctor: 'Dr. M. Rivas', patients: 118, status: 'Finalizada', sync: 'Sincronizado' },
    { id: 'BRG-2026-002', region: 'Santo Tomás Central', doctor: 'Dra. K. Morales', patients: 89, status: 'Finalizada', sync: 'Pendiente' },
    { id: 'BRG-2026-001', region: 'Panchimalco Norte', doctor: 'Dr. A. Gómez', patients: 64, status: 'Finalizada', sync: 'Sincronizado' },
  ];

  return (
    <div className="space-y-6">
      {/* Titular y Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Panel de Control Operativo
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Estado de brigadas médicas, sincronización de base de datos local y métricas generales.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs">
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Sincronizar BD</span>
          </button>
          <button className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs">
            <span>Exportar Informe</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid de KPIs / Tarjetas Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.label}
              className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-slate-500">{item.label}</span>
                <div className="p-1.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                  {item.value}
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  {item.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sección Dual: Tabla de Brigadas y Estado de Servidor/Nodos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tabla Principal (2 Columnas) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Brigadas Médicas Recientes
              </h2>
              <p className="text-[11px] text-slate-500">Registros sincronizados con el servidor local</p>
            </div>
            <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded">
              Total: 18
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-mono text-[11px] border-b border-slate-200 uppercase">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Código</th>
                  <th className="py-2.5 px-4 font-semibold">Ubicación / Sector</th>
                  <th className="py-2.5 px-4 font-semibold">Médico Cargo</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Atenciones</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Sincronización</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {recentBrigades.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">{b.id}</td>
                    <td className="py-3 px-4 text-slate-700">{b.region}</td>
                    <td className="py-3 px-4 text-slate-600">{b.doctor}</td>
                    <td className="py-3 px-4 text-center font-mono font-medium text-slate-800">{b.patients}</td>
                    <td className="py-3 px-4 text-right">
                      {b.sync === 'Sincronizado' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3" /> Pendiente
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card de Estado de Infraestructura / DB (1 Columna) */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-700" />
              Estado de Base de Datos
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Conexión activa al motor MariaDB / SQLite
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1.5">
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Host BD:</span>
                <span className="font-bold text-slate-900">localhost:3306</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Base de Datos:</span>
                <span className="font-bold text-slate-900">medicos_db</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Última réplica:</span>
                <span className="text-slate-700">Hace 3 mins</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Nodos Descentralizados
              </span>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200 text-[11px]">
                <span className="text-slate-700">Nodo Principal (San Salvador)</span>
                <span className="text-emerald-600 font-bold">Activo</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200 text-[11px]">
                <span className="text-slate-700">Nodo Local (Texacuangos)</span>
                <span className="text-emerald-600 font-bold">Activo</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};