import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background-100">
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground-950 text-background-50">
            <i className="ri-steering-2-line animate-pulse text-xl" aria-hidden="true" />
          </span>
          <p className="text-sm font-medium text-foreground-500">Cargando tu cuenta…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/ingresar" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}