import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import BaseLayout from '../layout/BaseLayout';

import MuiTheme from '../mui-theme';

import SignInPage from '../pages/auth/SignInPage';

import LangContextProvider from '../providers/LangContextProvider';
import StateContextProvider from '../providers/StateContextProvider';

import TeamList from '@/components/list/TeamsList';
import LoadCity from '@/pages/loader/LoadCity';
import MyCity from '@/pages/my-city/MyCityPage';
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
      <ProtectedRoute>
        <PageLayout>
          <Outlet />
        </PageLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'my-city',
        element: <MyCity />,
      },
    ],
    errorElement: <RouterErrorPage />,
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
      <BaseLayout>
        <CreateSuccessPage />
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
