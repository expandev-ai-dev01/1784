import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { App } from '@/App';
import { MainLayout } from '@/layouts/MainLayout';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ErrorBoundary } from '@/core/components/ErrorBoundary';

const HomePage = lazy(() => import('@/pages/Home'));
const VehicleListPage = lazy(() => import('@/pages/VehicleList'));
const VehicleDetailPage = lazy(() => import('@/pages/VehicleDetail'));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
);

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <HomePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'vehicles',
            element: (
              <SuspenseWrapper>
                <VehicleListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'vehicle/:id',
            element: (
              <SuspenseWrapper>
                <VehicleDetailPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
]);
