import React from 'react';
import { Outlet } from 'react-router-dom';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="w-full pb-10 animate-in fade-in duration-300">
      <Outlet />
    </div>
  );
};

export default DashboardLayout;