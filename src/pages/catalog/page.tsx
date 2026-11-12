import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SiteHeader from '@/components/feature/SiteHeader';
import SiteFooter from '@/components/feature/SiteFooter';
import VehicleCard from '@/components/feature/VehicleCard';
import Filters from '@/pages/catalog/components/Filters';
import { supabase } from '@/lib/supabase';
import { SORT_OPTIONS } from '@/lib/constants';
import type { CatalogQuery, Vehicle } from '@/types';

const BODY_MAP: Record<string, string> = {
  suv: 'SUV',
  sedan: 'Sedán',
  pickup: 'Pickup',
  hatchback: 'Hatchback',
  microbus: 'Microbús',
  deportivo: 'Deportivo',
};

function normalizeBodyParam(raw: string): string {
  if (!raw) return '';
  const key = raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return BODY_MAP[key] ?? raw;
}

const EMPTY_FILTERS: CatalogQuery = {
  brand: '',
  bodyType: '',
  province: '',
  maxPrice: '',
  query: '',
  transmission: '',
  fuel: '',
  condition: '',
  minYear: '',
  sort: 'recent',
};

function CardSkeleton() {
  return (
    <div className="card-surface overflow-hidden">
      <div className="aspect-[4/3] w-full animate-pulse bg-background-200" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-background-200" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-background-200" />
        <div className="h-8 w-1/3 animate-pulse rounded-full bg-background-200" />
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<CatalogQuery>(() => ({
    brand: searchParams.get('brand') ?? '',
    bodyType: normalizeBodyParam(searchParams.get('body') ?? ''),
    province: searchParams.get('province') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    query: searchParams.get('q') ?? '',
    transmission: searchParams.get('transmission') ?? '',
    fuel: searchParams.get('fuel') ?? '',
    condition: searchParams.get('condition') ?? '',
    minYear: searchParams.get('minYear') ?? '',
    sort: searchParams.get('sort') ?? 'recent',
  }));
  const [debouncedQuery, setDebouncedQuery] = useState(filters.query);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(filters.query), 380);
    return () => clearTimeout(timer);
  }, [filters.query]);

  const syncUrl = useCallback(
    (next: CatalogQuery) => {
      const params = new URLSearchParams();
      if (next.brand) params.set('brand', next.brand);
      if (next.bodyType) params.set('body', next.bodyType);
      if (next.province) params.set('province', next.province);
      if (next.maxPrice) params.set('maxPrice', next.maxPrice);
      if (next.query) params.set('q', next.query);
      if (next.transmission) params.set('transmission', next.transmission);
      if (next.fuel) params.set('fuel', next.fuel);
      if (next.condition) params.set('condition', next.condition);
      if (next.minYear) params.set('minYear', next.minYear);
      if (next.sort && next.sort !== 'recent') params.set('sort', next.sort);
      setSearchParams(params, { replace: true });
    },
    [setSearchParams],
  );

  const handleChange = useCallback(
    (key: keyof CatalogQuery, value: string) => {
      setFilters((current) => {
        const next = { ...current, [key]: value };
        syncUrl(next);
        return next;
      });
    },
    [syncUrl],
  );

  const handleReset = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setDebouncedQuery('');
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let request = supabase.from('vehicles').select('*').eq('status', 'active');

      if (filters.brand) request = request.eq('brand', filters.brand);
      if (filters.bodyType) request = request.eq('body_type', filters.bodyType);
      if (filters.province) request = request.eq('province', filters.province);
      if (filters.transmission) request = request.eq('transmission', filters.transmission);
      if (filters.fuel) request = request.eq('fuel_type', filters.fuel);
      if (filters.condition) request = request.eq('condition', filters.condition);
      if (filters.maxPrice) request = request.lte('price', Number(filters.maxPrice));
      if (filters.minYear) request = request.gte('year', Number(filters.minYear));

      const term = debouncedQuery.trim().replace(/[%,]/g, '');
      if (term) {
        request = request.or(`title.ilike.%${term}%,brand.ilike.%${term}%,model.ilike.%${term}%`);
      }

      switch (filters.sort) {
        case 'price-asc':
          request = request.order('price', { ascending: true });
          break;
        case 'price-desc':
          request = request.order('price', { ascending: false });
          break;
        case 'year-desc':
          request = request.order('year', { ascending: false });
          break;
        case 'mileage-asc':
          request = request.order('mileage', { ascending: true });
          break;
        default:
          request = request.order('created_at', { ascending: false });
      }

      const { data, error: requestError } = await request.limit(60);
      if (requestError) throw requestError;
      setVehicles((data ?? []) as Vehicle[]);
    } catch {
      setError('No pudimos cargar los vehículos. Revisá tu conexión e intentá de nuevo.');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedQuery]);

  useEffect(() => {
    load();
  }, [load]);

  const activeChips = [
    filters.brand && { key: 'brand' as const, label: filters.brand },
    filters.bodyType && { key: 'bodyType' as const, label: filters.bodyType },
    filters.province && { key: 'province' as const, label: filters.province },
    filters.condition && { key: 'condition' as const, label: filters.condition },
    filters.transmission && { key: 'transmission' as const, label: filters.transmission },
    filters.fuel && { key: 'fuel' as const, label: filters.fuel },
  ].filter(Boolean) as { key: keyof CatalogQuery; label: string }[];

  return (
    <div className="flex min-h-screen flex-col bg-background-100">
      <SiteHeader />
      <main className="flex-1">
        <div className="w-full border-b border-background-200 bg-background-50 px-4 py-8 md:px-8 md:py-10">
          <div className="mx-auto w-full max-w-[1280px]">
            <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-xs text-foreground-500">
              <Link to="/" className="cursor-pointer transition-colors hover:text-foreground-900">
                Inicio
              </Link>
              <i className="ri-arrow-right-s-line" aria-hidden="true" />
              <span className="font-semibold text-foreground-800">Vehículos</span>
            </nav>
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-heading text-3xl font-extrabold text-foreground-950 md:text-4xl">
                  Vehículos disponibles
                </h1>
                <p className="mt-2 text-sm text-foreground-600">
                  {loading
                    ? 'Buscando los mejores autos para vos…'
                    : `${vehicles.length} ${vehicles.length === 1 ? 'vehículo encontrado' : 'vehículos encontrados'} en Costa Rica`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="btn-outline w-fit lg:hidden"
              >
                <i className="ri-equalizer-line" aria-hidden="true" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        <div className="w-full px-4 py-8 md:px-8">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 lg:flex-row">
            <aside className="hidden lg:block lg:w-[280px] lg:shrink-0">
              <div className="card-surface sticky top-24 p-5">
                <Filters values={filters} onChange={handleChange} onReset={handleReset} />
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {activeChips.length === 0 ? (
                    <p className="chip">
                      <i className="ri-list-check" aria-hidden="true" />
                      Todos los vehículos
                    </p>
                  ) : (
                    activeChips.map((chip) => (
                      <button
                        key={chip.key}
                        type="button"
                        onClick={() => handleChange(chip.key, '')}
                        className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-foreground-900 bg-foreground-950 px-3 py-1.5 text-xs font-semibold text-background-50 transition hover:bg-foreground-800"
                      >
                        {chip.label}
                        <i className="ri-close-line" aria-hidden="true" />
                      </button>
                    ))
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="whitespace-nowrap text-xs font-semibold text-foreground-500">
                    Ordenar por
                  </label>
                  <select
                    id="sort"
                    value={filters.sort}
                    onChange={(event) => handleChange('sort', event.target.value)}
                    className="cursor-pointer rounded-xl border border-background-300 bg-background-50 px-3 py-2 text-xs font-semibold text-foreground-800 focus:border-primary-500 focus:outline-none"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error ? (
                <div className="card-surface mt-6 flex flex-col items-center gap-3 px-6 py-16 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <i className="ri-wifi-off-line text-2xl" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-medium text-foreground-700">{error}</p>
                  <button type="button" onClick={load} className="btn-outline mt-1 px-4 py-2.5">
                    <i className="ri-refresh-line" aria-hidden="true" />
                    Reintentar
                  </button>
                </div>
              ) : loading ? (
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {[0, 1, 2, 3, 4, 5].map((item) => (
                    <CardSkeleton key={item} />
                  ))}
                </div>
              ) : vehicles.length === 0 ? (
                <div className="card-surface mt-6 flex flex-col items-center gap-3 px-6 py-16 text-center">
                  <i className="ri-car-line text-4xl text-foreground-300" aria-hidden="true" />
                  <h2 className="font-heading text-lg font-bold text-foreground-950">
                    No encontramos vehículos con esos filtros
                  </h2>
                  <p className="max-w-sm text-sm text-foreground-600">
                    Probá ampliar el rango de precio o quitar algún filtro para ver más opciones.
                  </p>
                  <button type="button" onClick={handleReset} className="btn-primary mt-2 px-5 py-2.5">
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Cerrar filtros"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 cursor-pointer bg-foreground-950/60 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 flex w-[90%] max-w-sm flex-col bg-background-50">
            <div className="flex items-center justify-between border-b border-background-200 px-4 py-4">
              <p className="font-heading text-base font-bold text-foreground-950">Filtrar vehículos</p>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-background-300 text-foreground-700"
                aria-label="Cerrar"
              >
                <i className="ri-close-line text-lg" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <Filters values={filters} onChange={handleChange} onReset={handleReset} />
            </div>
            <div className="border-t border-background-200 p-4">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="btn-primary w-full"
              >
                Ver {vehicles.length} resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}