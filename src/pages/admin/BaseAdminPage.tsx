import { Outlet } from 'react-router-dom';
import PageLayout from '../../layout/PageLayout';
import ProtectedRoute from '../../routes/ProtectedRoute';

export function BaseAdminPage() {
  return (
    <ProtectedRoute>
      <PageLayout>
        <Outlet />
      </PageLayout>
    </ProtectedRoute>
  );
}

export default BaseAdminPage;
