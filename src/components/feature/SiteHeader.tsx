import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { to: '/autos', label: 'Comprar autos' },
  { to: '/autos?body=Suv', label: 'SUVs' },
  { to: '/autos?body=Pickup', label: 'Pickups' },
  { to: '/autos?body=Sedan', label: 'Sedanes' },
];

function initialsOf(name: string, email: string) {
  const base = name.trim() || email;
  const parts = base.split(/[\s@._-]+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || 'U';
}

export default function SiteHeader() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setAccountOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-background-200 bg-background-50/90 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-4">
        <Link to="/" className="flex cursor-pointer items-center gap-2.5" aria-label="Motora, inicio">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground-950 text-background-50">
            <i className="ri-steering-2-line text-lg" aria-hidden="true" />
          </span>
          <span className="font-heading text-xl font-extrabold tracking-tight text-foreground-950">
            Motora<span className="text-primary-500">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="cursor-pointer whitespace-nowrap text-sm font-semibold text-foreground-600 transition-colors hover:text-foreground-950"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/publicar"
            className="cursor-pointer whitespace-nowrap text-sm font-semibold text-accent-600 transition-colors hover:text-accent-700"
          >
            Vender mi auto
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            to="/mi-cuenta?tab=favoritos"
            className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-background-300 text-foreground-700 transition hover:border-foreground-900 hover:text-foreground-950 sm:flex"
            aria-label="Mis favoritos"
          >
            <i className="ri-heart-3-line text-lg" aria-hidden="true" />
          </Link>

          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-full bg-background-200" />
          ) : user ? (
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-background-300 py-1 pl-1 pr-2 transition hover:border-foreground-300"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 font-heading text-xs font-bold text-background-50">
                  {initialsOf(profile?.full_name ?? '', user.email ?? '')}
                </span>
                <span className="hidden max-w-[110px] truncate text-sm font-semibold text-foreground-800 md:block">
                  {profile?.full_name?.split(' ')[0] || 'Mi cuenta'}
                </span>
                <i className="ri-arrow-down-s-line text-foreground-500" aria-hidden="true" />
              </button>

              {accountOpen && (
                <div
                  className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-background-200 bg-background-50 p-1.5 shadow-lift"
                  role="menu"
                >
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-bold text-foreground-950">
                      {profile?.full_name || 'Mi cuenta'}
                    </p>
                    <p className="truncate text-xs text-foreground-500">{user.email}</p>
                  </div>
                  <div className="my-1 h-px bg-background-200" />
                  <Link
                    to="/mi-cuenta"
                    onClick={() => setAccountOpen(false)}
                    className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground-700 transition hover:bg-background-100"
                  >
                    <i className="ri-dashboard-3-line" aria-hidden="true" /> Mis anuncios
                  </Link>
                  <Link
                    to="/mi-cuenta?tab=favoritos"
                    onClick={() => setAccountOpen(false)}
                    className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground-700 transition hover:bg-background-100"
                  >
                    <i className="ri-heart-3-line" aria-hidden="true" /> Favoritos
                  </Link>
                  <Link
                    to="/mi-cuenta?tab=perfil"
                    onClick={() => setAccountOpen(false)}
                    className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground-700 transition hover:bg-background-100"
                  >
                    <i className="ri-user-settings-line" aria-hidden="true" /> Mi perfil
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-primary-700 transition hover:bg-primary-50"
                  >
                    <i className="ri-logout-box-r-line" aria-hidden="true" /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/ingresar"
                className="cursor-pointer whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold text-foreground-700 transition hover:bg-background-100 hover:text-foreground-950"
              >
                Ingresar
              </Link>
              <Link to="/publicar" className="btn-primary px-4 py-2.5">
                <i className="ri-add-line" aria-hidden="true" />
                Publicar gratis
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-background-300 text-foreground-800 lg:hidden"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <i className={menuOpen ? 'ri-close-line text-xl' : 'ri-menu-line text-xl'} aria-hidden="true" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-background-200 bg-background-50 px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Navegación móvil">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground-700 transition hover:bg-background-100"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/publicar"
              onClick={() => setMenuOpen(false)}
              className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold text-accent-600 transition hover:bg-background-100"
            >
              Vender mi auto
            </Link>
          </nav>
          {!user && (
            <div className="mt-3 flex flex-col gap-2 border-t border-background-200 pt-3">
              <Link to="/ingresar" onClick={() => setMenuOpen(false)} className="btn-outline w-full">
                Ingresar
              </Link>
              <Link to="/registro" onClick={() => setMenuOpen(false)} className="btn-primary w-full">
                Crear cuenta gratis
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}