import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import BaseLayout from '../layout/BaseLayout';

import MuiTheme from '../mui-theme';

import SignInPage from '../pages/auth/SignInPage';

import LangContextProvider from '../providers/LangContextProvider';
import StateContextProvider from '../providers/StateContextProvider';

import TeamList from '@/components/list/TeamsList';
import AppHome from '@/pages/AppHome';
import NewPasswordPage from '@/pages/auth/NewPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import ValidateCodePage from '@/pages/auth/ValidateCodePage';
import LoadCity from '@/pages/loader/LoadCity';
import MyCity from '@/pages/my-city/MyCityPage';
import MyCommunity from '@/pages/my-community/MyCommunityPage';
import HeatMapPage from '@/pages/reports/HeatMapPage';
import SitesPage from '@/pages/reports/SitesPage';
import VisitPage from '@/pages/reports/VisitPage';
import VisitsList from '@/pages/visits/VisitsPage';
import CityList from '../components/list/CityList';
import OrganizationList from '../components/list/OrganizationList';
import RoleList from '../components/list/RoleList';
import SpecialPlaceList from '../components/list/SpecialPlacesList';
import UserList from '../components/list/UserList';
import PageLayout from '../layout/PageLayout';
import RouterErrorPage from '../pages/RouterErrorPage';
import BaseAdminPage from '../pages/admin/BaseAdminPage';
import CreateAccountPage from '../pages/auth/CreateAccountPage';
import CreateSuccessPage from '../pages/auth/CreateSuccess';
import LoadUser from '../pages/loader/LoadUser';
import Loader from '../themed/loader/Loader';
import ProtectedRoute from './ProtectedRoute';
import { LoadVisit } from '@/pages/loader/LoadVisit';

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 5, // 5 seconds
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PageLayout>
        <AppHome />
      </PageLayout>
    ),
    errorElement: <RouterErrorPage />,
  },
  {
    path: 'my-city',
    element: (
      <ProtectedRoute>
        <PageLayout>
          <MyCity />
        </PageLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: 'my-community',
    element: (
      <ProtectedRoute>
        <PageLayout>
          <MyCommunity />
        </PageLayout>
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorPage />,
  },
  {
    path: 'visits',
    element: (
      <ProtectedRoute>
        <PageLayout>
          <VisitsList />
        </PageLayout>
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorPage />,
  },
  {
    path: 'visits/:id/edit',
    element: (
      <ProtectedRoute>
        <PageLayout>
          <LoadVisit />
        </PageLayout>
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorPage />,
  },
  {
    path: 'reports',
    element: (
      <ProtectedRoute>
        <PageLayout>
          <Outlet />
        </PageLayout>
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorPage />,
    children: [
      {
        path: 'sites',
        element: <SitesPage />,
      },
      {
        path: 'heat-map',
        element: <HeatMapPage />,
      },
      {
        path: 'visits',
        element: <VisitPage />,
        errorElement: <RouterErrorPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <BaseAdminPage />,
    children: [
      {
        path: 'organizations',
        element: <OrganizationList />,
      },
      {
        path: 'roles',
        element: <RoleList />,
      },
      {
        path: 'users',
        element: <UserList />,
      },
      {
        path: 'users/:id/edit',
        element: <LoadUser />,
      },
      {
        path: 'cities',
        element: <CityList />,
      },
      {
        path: 'cities/:id/edit',
        element: <LoadCity />,
      },
      {
        path: 'special-places',
        element: <SpecialPlaceList />,
      },
      {
        path: 'teams',
        element: <TeamList />,
      },
    ],
    errorElement: <RouterErrorPage />,
  },
  {
    path: '/login',
    element: (
      <BaseLayout signUp auth={false}>
        <SignInPage />
      </BaseLayout>
    ),
    errorElement: <RouterErrorPage />,
  },
  {
    path: '/register',
    element: (
      <BaseLayout>
        <CreateAccountPage />
      </BaseLayout>
    ),
    errorElement: <RouterErrorPage />,
  },
  {
    path: '/register-success',
    element: (
      <BaseLayout signUp>
        <CreateSuccessPage />
      </BaseLayout>
    ),
    errorElement: <RouterErrorPage />,
  },
  {
    path: '/reset-password',
    element: (
      <BaseLayout auth={false}>
        <ResetPasswordPage />
      </BaseLayout>
    ),
    errorElement: <RouterErrorPage />,
  },
  {
    path: '/validate-code',
    element: (
      <BaseLayout auth={false}>
        <ValidateCodePage />
      </BaseLayout>
    ),
    errorElement: <RouterErrorPage />,
  },
  {
    path: '/new-password',
    element: (
      <BaseLayout auth={false}>
        <NewPasswordPage />
      </BaseLayout>
    ),
    errorElement: <RouterErrorPage />,
  },
]);

export function AppRouter() {
  return (
    <MuiTheme>
      <Suspense fallback={<Loader />}>
        <StateContextProvider>
          <LangContextProvider>
            <QueryClientProvider client={queryClient}>
              <RouterProvider router={router} />
              {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </QueryClientProvider>
          </LangContextProvider>
        </StateContextProvider>
      </Suspense>
    </MuiTheme>
  );
}

export default AppRouter;
