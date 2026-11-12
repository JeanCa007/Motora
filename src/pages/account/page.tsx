import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SiteHeader from '@/components/feature/SiteHeader';
import SiteFooter from '@/components/feature/SiteFooter';
import VehicleCard from '@/components/feature/VehicleCard';
import MyVehiclesPanel from '@/pages/account/components/MyVehiclesPanel';
import ProfilePanel from '@/pages/account/components/ProfilePanel';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Vehicle } from '@/types';

const TABS = [
  { key: 'anuncios', label: 'Mis anuncios', icon: 'ri-car-line' },
  { key: 'favoritos', label: 'Favoritos', icon: 'ri-heart-3-line' },
  { key: 'perfil', label: 'Mi perfil', icon: 'ri-user-settings-line' },
];

export default function AccountPage() {
  const { user, profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') ?? 'anuncios';

  const [myVehicles, setMyVehicles] = useState<Vehicle[]>([]);
  const [favorites, setFavorites] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [vehiclesError, setVehiclesError] = useState('');
  const [favoritesError, setFavoritesError] = useState('');

  const loadVehicles = useCallback(async () => {
    if (!user) return;
    setLoadingVehicles(true);
    setVehiclesError('');
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMyVehicles((data ?? []) as Vehicle[]);
    } catch {
      setVehiclesError('No pudimos cargar tus anuncios.');
    } finally {
      setLoadingVehicles(false);
    }
  }, [user]);

  const loadFavorites = useCallback(async () => {
    if (!user) return;
    setLoadingFavorites(true);
    setFavoritesError('');
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('vehicle_id, vehicles(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      const rows = (data ?? []) as unknown as { vehicles: Vehicle | null }[];
      setFavorites(rows.map((row) => row.vehicles).filter((item): item is Vehicle => Boolean(item)));
    } catch {
      setFavoritesError('No pudimos cargar tus favoritos.');
    } finally {
      setLoadingFavorites(false);
    }
  }, [user]);

  useEffect(() => {
    loadVehicles();
    loadFavorites();
  }, [loadVehicles, loadFavorites]);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Mi cuenta';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className="flex min-h-screen flex-col bg-background-100">
      <SiteHeader />
      <main className="flex-1">
        <div className="w-full border-b border-background-200 bg-background-50 px-4 py-8 md:px-8 md:py-10">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-foreground-950 font-heading text-lg font-bold text-background-50">
                {initials || 'M'}
              </span>
              <div className="min-w-0">
                <h1 className="truncate font-heading text-2xl font-extrabold text-foreground-950 md:text-3xl">
                  Hola, {displayName}
                </h1>
                <p className="truncate text-sm text-foreground-600">{user?.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">
                <i className="ri-car-line" aria-hidden="true" />
                {myVehicles.length} anuncios
              </span>
              <span className="chip">
                <i className="ri-heart-3-line" aria-hidden="true" />
                {favorites.length} favoritos
              </span>
              <Link to="/publicar" className="btn-primary px-4 py-2.5">
                <i className="ri-add-line" aria-hidden="true" />
                Publicar auto
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full px-4 py-8 md:px-8">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="flex flex-wrap gap-1 rounded-full border border-background-200 bg-background-50 px-1 py-1 sm:w-fit">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSearchParams({ tab: tab.key }, { replace: true })}
                    className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-foreground-950 text-background-50'
                        : 'text-foreground-600 hover:bg-background-100'
                    }`}
                  >
                    <i className={tab.icon} aria-hidden="true" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6">
              {activeTab === 'favoritos' ? (
                loadingFavorites ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[0, 1, 2].map((item) => (
                      <div key={item} className="card-surface overflow-hidden">
                        <div className="aspect-[4/3] w-full animate-pulse bg-background-200" />
                        <div className="h-24 animate-pulse bg-background-100" />
                      </div>
                    ))}
                  </div>
                ) : favoritesError ? (
                  <div className="card-surface flex flex-col items-center gap-3 px-6 py-12 text-center">
                    <i className="ri-error-warning-line text-3xl text-primary-600" aria-hidden="true" />
                    <p className="text-sm font-medium text-foreground-700">{favoritesError}</p>
                    <button type="button" onClick={loadFavorites} className="btn-outline px-4 py-2.5">
                      Reintentar
                    </button>
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="card-surface flex flex-col items-center gap-3 px-6 py-14 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background-200 text-foreground-500">
                      <i className="ri-heart-3-line text-2xl" aria-hidden="true" />
                    </span>
                    <h2 className="font-heading text-lg font-bold text-foreground-950">No tenés favoritos todavía</h2>
                    <p className="max-w-sm text-sm text-foreground-600">
                      Guardá los vehículos que te interesen con el corazón y comparalos después.
                    </p>
                    <Link to="/autos" className="btn-primary mt-1 px-5 py-2.5">
                      Explorar vehículos
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((vehicle) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                  </div>
                )
              ) : activeTab === 'perfil' ? (
                <ProfilePanel />
              ) : (
                <MyVehiclesPanel
                  vehicles={myVehicles}
                  loading={loadingVehicles}
                  error={vehiclesError}
                  onReload={() => {
                    loadVehicles();
                    loadFavorites();
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}