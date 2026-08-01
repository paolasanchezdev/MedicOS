import React from 'react';
import { Users, UserPlus, ClipboardList, Clock } from 'lucide-react';
import { useBrigade } from '@/modules/brigades/hooks/useBrigade';

export const ShiftSummaryCards: React.FC = () => {
  const { metrics } = useBrigade();

  const cards = [
    {
      title: 'Atendidos Hoy',
      value: metrics?.totalAttended ?? 0,
      icon: Users,
      color: 'text-teal-600 bg-teal-50 border-teal-100',
    },
    {
      title: 'Pacientes Nuevos',
      value: metrics?.newPatients ?? 0,
      icon: UserPlus,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Consultas',
      value: metrics?.consultationsRegistered ?? 0,
      icon: ClipboardList,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'En Seguimiento',
      value: metrics?.followUpPatients ?? 0,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-xs flex items-center justify-between hover:shadow-md transition-all duration-200"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {card.title}
              </p>
              <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">
                {card.value}
              </p>
            </div>
            <div className={`p-3 rounded-2xl border ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShiftSummaryCards;