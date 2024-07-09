import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import BaseLayout from '../layout/BaseLayout';

import MuiTheme from '../mui-theme';

import AppHome from '../pages/AppHome';
import SignInPage from '../pages/auth/SignInPage';

import LangContextProvider from '../providers/LangContextProvider';
import StateContextProvider from '../providers/StateContextProvider';
import ProtectedRoute from './ProtectedRoute';

import PageLayout from '../layout/PageLayout';
import RouterErrorPage from '../pages/RouterErrorPage';
import CreateAccountPage from '../pages/auth/CreateAccountPage';
import CreateSuccessPage from '../pages/auth/CreateSuccess';
import Loader from '../themed/loader/Loader';

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
    path: '/home',
    element: (
      <ProtectedRoute>
        <PageLayout>
          <AppHome />
        </PageLayout>
      </ProtectedRoute>
    ),
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
