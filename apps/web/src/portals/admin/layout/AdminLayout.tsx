import { DashboardLayout } from '../../../layouts/DashboardLayout/DashboardLayout';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export const AdminLayout = () => {
  return (
    <DashboardLayout
      sidebar={({ isCollapsed }: { isCollapsed: boolean }) => <AdminSidebar isCollapsed={isCollapsed} />}
      header={<AdminHeader />}
    />
  );
};

export default AdminLayout;