export const SaludSistemaPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-medicos-dark-blue">Salud del Sistema</h1>
        <p className="text-sm text-medicos-muted mt-1">
          Monitoreo en tiempo real de infraestructura, servidores y sincronización offline.
        </p>
      </div>

      <div className="p-6 bg-medicos-surface rounded-2xl border border-medicos-soft-border shadow-xs">
        <p className="text-sm text-medicos-muted">
          Métricas de rendimiento y latencia de nodos en construcción...
        </p>
      </div>
    </div>
  );
};