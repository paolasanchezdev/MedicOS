import React from 'react';
import { ShiftSummaryCards } from './components/ShiftSummaryCards';
import { QuickActions } from './components/QuickActions';
import { AttendanceOverview } from './components/AttendanceOverview';
import { ActiveBrigadeInfo } from './components/ActiveBrigadeInfo';
import { RecentPatientsTable } from './components/RecentPatientsTable';

export const BrigadistDashboardPage: React.FC = () => {
  const userName = 'Paola';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Buenos días';
    if (hour >= 12 && hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const greeting = getGreeting();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Cabecera estilo iOS / Minimalista y Responsiva */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold tracking-wider text-teal-600 uppercase">
            Panel de Operaciones
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-0.5">
            {greeting}, {userName}.
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-slate-100/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Sincronizado</span>
        </div>
      </div>

      <ShiftSummaryCards />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7 space-y-6">
          <AttendanceOverview />
          <ActiveBrigadeInfo />
        </div>
        <div className="xl:col-span-5">
          <QuickActions />
        </div>
      </div>

      <RecentPatientsTable />
    </div>
  );
};

export default BrigadistDashboardPage;