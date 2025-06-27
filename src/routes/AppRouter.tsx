import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import ScrollToTop from '../hooks/scroll-to-top';
import NotFound from '../pages/not-found/NotFound';

const AdminHome = lazy(() => import('../pages/admin'));

const TrangCh = lazy(() => import('../pages/trangCh'));
const Login = lazy(() => import('../pages/login'));
const RegisterKOC = lazy(() => import('../pages/register/koc'));
const RegisterBS = lazy(() => import('../pages/register/bs'));
const Jobs = lazy(() => import('../pages/jobs'));
const Influencer = lazy(() => import('../pages/influencer'));
const UpgradeKOC = lazy(() => import('../pages/upgrade/koc'));
const UpgradeBS = lazy(() => import('../pages/upgrade/bs'));
const ProfileKOC = lazy(() => import('../pages/profile/koc'));
const ProfileBS = lazy(() => import('../pages/profile/bs'));
const HistoryBS = lazy(() => import('../pages/history/bs'));
const HistoryKOC = lazy(() => import('../pages/history/koc'));
const SuccessPage = lazy(() => import('../components/login/SuccessPage'));


export default function AppRouter() {
  const systemRoute = [
    {
      path: '/',
      element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ScrollToTop />
            <Outlet />
          </Suspense>
      ),
      children: [
        {
          path: '/',
          element: <TrangCh />
        },
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/admin',
          element: <AdminHome />
        },
        {
          path: '/register_koc',
          element: <RegisterKOC />
        },
        {
          path: '/register_business',
          element: <RegisterBS />
        },
        {
          path: '/home',
          element: <Jobs />
        },
        {
          path: '/influencer',
          element: <Influencer />
        },
        {
          path: '/upgrade_koc',
          element: <UpgradeKOC />
        },
        {
          path: '/upgrade_business',
          element: <UpgradeBS />
        },
        {
          path: '/profileKOC/:id',
          element: <ProfileKOC />
        },
        {
          path: '/profileBusiness/:id',
          element: <ProfileBS />
        },
        {
          path: '/history_business',
          element: <HistoryBS />
        },
        {
          path: '/history_koc',
          element: <HistoryKOC />
        },
        {
          path: '/success',
          element: <SuccessPage />
        },
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];

  const routes = useRoutes([...systemRoute, ...publicRoutes]);
  return routes;
}
