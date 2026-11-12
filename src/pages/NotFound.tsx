import { Link } from 'react-router-dom';
import SiteHeader from '@/components/feature/SiteHeader';
import SiteFooter from '@/components/feature/SiteFooter';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background-100">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="flex max-w-md flex-col items-center gap-3 text-center">
          <p className="font-heading text-6xl font-extrabold text-background-300">404</p>
          <h1 className="font-heading text-2xl font-extrabold text-foreground-950">
            No encontramos esta página
          </h1>
          <p className="text-sm leading-relaxed text-foreground-600">
            El enlace que abriste no existe o fue movido. Volvé al inicio o explorá los vehículos disponibles.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Link to="/" className="btn-primary px-5 py-2.5">
              Ir al inicio
            </Link>
            <Link to="/autos" className="btn-outline px-5 py-2.5">
              Ver vehículos
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}