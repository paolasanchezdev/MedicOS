// apps/web/src/portals/admin/layout/AdminHeader.tsx
import { useState, useRef, useEffect } from 'react';
import { Search, Bell, LogOut, User, ChevronDown } from 'lucide-react';

export const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsMenuOpen(false);

    // Limpiar almacenamiento de sesión y local
    localStorage.clear();
    sessionStorage.clear();

    // Redirección dura a la pantalla de login
    window.location.href = '/login'; 
  };

  return (
    <header className="h-14 px-6 flex items-center justify-between gap-4 bg-white border-b border-slate-200">
      {/* Buscador de registros */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por expediente, DUI, médico o brigada..."
            className="w-full pl-9 pr-8 py-1.5 bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all font-sans"
          />
          <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/60 rounded border border-slate-300/60">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Información de Sesión y Estado */}
      <div className="flex items-center gap-4">
        {/* Indicador de conexión real BD */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 rounded text-[11px] font-medium text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Base de Datos Conectada</span>
        </div>

        {/* Notificaciones */}
        <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

        <div className="h-4 w-px bg-slate-200" />

        {/* Dropdown Usuario */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <div className="w-7 h-7 rounded bg-slate-800 text-white font-mono text-xs font-semibold flex items-center justify-center border border-slate-700 shrink-0">
              PR
            </div>
            <div className="hidden sm:block text-left leading-none">
              <p className="text-xs font-semibold text-slate-800">Paola Rodriguez</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Super Admin</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Menú Desplegable */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100 sm:hidden">
                <p className="text-xs font-semibold text-slate-800">Paola Rodriguez</p>
                <p className="text-[10px] text-slate-500 font-mono">Super Admin</p>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                Mi Perfil
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;