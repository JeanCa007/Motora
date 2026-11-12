import type { RouteObject } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/home/page';
import CatalogPage from '@/pages/catalog/page';
import VehicleDetailPage from '@/pages/vehicle/page';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import AccountPage from '@/pages/account/page';
import SellPage from '@/pages/sell/page';
import RequireAuth from '@/components/feature/RequireAuth';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/autos',
    element: <CatalogPage />,
  },
  {
    path: '/auto/:id',
    element: <VehicleDetailPage />,
  },
  {
    path: '/ingresar',
    element: <LoginPage />,
  },
  {
    path: '/registro',
    element: <RegisterPage />,
  },
  {
    path: '/mi-cuenta',
    element: (
      <RequireAuth>
        <AccountPage />
      </RequireAuth>
    ),
  },
  {
    path: '/publicar',
    element: (
      <RequireAuth>
        <SellPage />
      </RequireAuth>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;