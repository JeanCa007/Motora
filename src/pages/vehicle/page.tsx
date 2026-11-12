import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SiteHeader from '@/components/feature/SiteHeader';
import SiteFooter from '@/components/feature/SiteFooter';
import VehicleCard from '@/components/feature/VehicleCard';
import Gallery from '@/pages/vehicle/components/Gallery';
import ContactModal from '@/pages/vehicle/components/ContactModal';
import { supabase } from '@/lib/supabase';
import { formatMileage, formatPrice, timeAgo } from '@/lib/format';
import { FEATURE_HIGHLIGHTS } from '@/lib/constants';
import { useFavorite } from '@/hooks/useFavorite';
import type { Vehicle } from '@/types';

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [similar, setSimilar] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const { isFavorite, toggle } = useFavorite(id ?? '');

  const load = useCallback(async () => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    setNotFound(false);
    try {
      const { data, error: requestError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (requestError) throw requestError;
      if (!data) {
        setNotFound(true);
        setVehicle(null);
        return;
      }
      const current = data as Vehicle;
      setVehicle(current);

      const { data: related } = await supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'active')
        .eq('body_type', current.body_type)
        .neq('id', current.id)
        .order('created_at', { ascending: false })
        .limit(3);
      setSimilar((related ?? []) as Vehicle[]);
    } catch {
      setError('No pudimos cargar este vehículo. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background-100">
        <SiteHeader />
        <main className="flex-1 px-4 py-10 md:px-8">
          <div className="mx-auto w-full max-w-[1280px] animate-pulse">
            <div className="h-4 w-40 rounded-full bg-background-200" />
            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
              <div className="aspect-[16/10] w-full rounded-2xl bg-background-200" />
              <div className="h-72 rounded-2xl bg-background-200" />
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (notFound || !vehicle) {
    return (
      <div className="flex min-h-screen flex-col bg-background-100">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center px-4 py-20">
          <div className="flex max-w-md flex-col items-center gap-3 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background-200 text-foreground-500">
              <i className="ri-car-line text-3xl" aria-hidden="true" />
            </span>
            <h1 className="font-heading text-2xl font-extrabold text-foreground-950">
              Este vehículo ya no está disponible
            </h1>
            <p className="text-sm text-foreground-600">
              Puede que el anuncio haya sido vendido o eliminado. Mirá otros vehículos similares disponibles.
            </p>
            {error && <p className="text-xs font-medium text-primary-700">{error}</p>}
            <Link to="/autos" className="btn-primary mt-2 px-5 py-2.5">
              Ver otros vehículos
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const specs = [
    { icon: 'ri-calendar-line', label: 'Año', value: String(vehicle.year) },
    { icon: 'ri-roadster-line', label: 'Kilometraje', value: formatMileage(vehicle.mileage) },
    { icon: 'ri-settings-3-line', label: 'Transmisión', value: vehicle.transmission },
    { icon: 'ri-gas-station-line', label: 'Combustible', value: vehicle.fuel_type },
    { icon: 'ri-car-line', label: 'Tipo', value: vehicle.body_type },
    { icon: 'ri-shield-check-line', label: 'Condición', value: vehicle.condition },
  ];

  const sellerInitials = vehicle.seller_name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className="flex min-h-screen flex-col bg-background-100">
      <SiteHeader />
      <main className="flex-1">
        <div className="w-full px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-[1280px]">
            <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-2 text-xs text-foreground-500">
              <Link to="/" className="cursor-pointer transition-colors hover:text-foreground-900">
                Inicio
              </Link>
              <i className="ri-arrow-right-s-line" aria-hidden="true" />
              <Link to="/autos" className="cursor-pointer transition-colors hover:text-foreground-900">
                Vehículos
              </Link>
              <i className="ri-arrow-right-s-line" aria-hidden="true" />
              <Link
                to={`/autos?brand=${encodeURIComponent(vehicle.brand)}`}
                className="cursor-pointer transition-colors hover:text-foreground-900"
              >
                {vehicle.brand}
              </Link>
              <i className="ri-arrow-right-s-line" aria-hidden="true" />
              <span className="truncate font-semibold text-foreground-800">{vehicle.model}</span>
            </nav>

            <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
              <div className="min-w-0">
                <Gallery images={vehicle.images ?? []} title={vehicle.title} />

                <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="chip">{vehicle.condition}</span>
                      {vehicle.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-bold text-primary-800">
                          <i className="ri-fire-line" aria-hidden="true" />
                          Destacado
                        </span>
                      )}
                      <span className="chip">
                        <i className="ri-time-line" aria-hidden="true" />
                        {timeAgo(vehicle.created_at)}
                      </span>
                    </div>
                    <h1 className="mt-3 text-balance font-heading text-2xl font-extrabold text-foreground-950 md:text-4xl">
                      {vehicle.title}
                    </h1>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-foreground-600">
                      <i className="ri-map-pin-line text-base text-foreground-400" aria-hidden="true" />
                      {vehicle.province}
                      {vehicle.city ? `, ${vehicle.city}` : ''}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-2xl border border-background-200 bg-background-50 px-5 py-4 md:text-right">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-400">
                      Precio de venta
                    </p>
                    <p className="mt-1 font-heading text-3xl font-extrabold text-foreground-950">
                      {formatPrice(vehicle.price)}
                    </p>
                    <p className="text-xs text-foreground-500">{vehicle.currency}</p>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {specs.map((spec) => (
                    <div key={spec.label} className="rounded-xl border border-background-200 bg-background-50 p-4">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-foreground-400">
                        <i className={`${spec.icon} text-sm`} aria-hidden="true" />
                        {spec.label}
                      </span>
                      <p className="mt-1.5 font-heading text-sm font-bold text-foreground-950">{spec.value}</p>
                    </div>
                  ))}
                </div>

                <section className="mt-8">
                  <h2 className="font-heading text-lg font-bold text-foreground-950">Descripción del vendedor</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground-700">
                    {vehicle.description || 'El vendedor no agregó una descripción para este vehículo.'}
                  </p>
                </section>

                {(vehicle.features ?? []).length > 0 && (
                  <section className="mt-8">
                    <h2 className="font-heading text-lg font-bold text-foreground-950">Equipamiento y extras</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {vehicle.features.map((feature) => {
                        const match = FEATURE_HIGHLIGHTS.find(
                          (item) => item.key.toLowerCase() === feature.toLowerCase(),
                        );
                        return (
                          <span
                            key={feature}
                            className="inline-flex items-center gap-1.5 rounded-full border border-background-300 bg-background-50 px-3 py-2 text-xs font-semibold text-foreground-700"
                          >
                            <i className={`${match?.icon ?? 'ri-checkbox-circle-line'} text-accent-600`} aria-hidden="true" />
                            {feature}
                          </span>
                        );
                      })}
                    </div>
                  </section>
                )}

                <section className="mt-8 rounded-2xl border border-accent-200 bg-accent-50 p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-500 text-background-50">
                      <i className="ri-shield-check-line text-lg" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="font-heading text-base font-bold text-accent-900">
                        Recomendaciones antes de comprar
                      </h2>
                      <p className="mt-1.5 text-sm leading-relaxed text-accent-800">
                        Coordiná una revisión mecánica en un taller de confianza, verificá el traspaso y el
                        pago del marchamo antes de cerrar el trato. Nunca enviés dinero por adelantado sin ver
                        el vehículo.
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <aside className="min-w-0">
                <div className="card-surface sticky top-24 p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground-950 font-heading text-sm font-bold text-background-50">
                      {sellerInitials || 'M'}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-heading text-sm font-bold text-foreground-950">
                        {vehicle.seller_name || 'Vendedor Motora'}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-foreground-500">
                        <i className="ri-verified-badge-line text-accent-600" aria-hidden="true" />
                        Vendedor verificado
                      </p>
                    </div>
                  </div>

                  <button type="button" onClick={() => setContactOpen(true)} className="btn-primary mt-5 w-full">
                    <i className="ri-chat-3-line" aria-hidden="true" />
                    Contactar al vendedor
                  </button>

                  <a
                    href={`tel:+506${(vehicle.seller_phone || '').replace(/\D/g, '')}`}
                    className="btn-outline mt-2 w-full"
                  >
                    <i className="ri-phone-line" aria-hidden="true" />
                    {vehicle.seller_phone || 'Ver teléfono'}
                  </a>

                  <button
                    type="button"
                    onClick={toggle}
                    className={`mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border px-5 py-3 text-sm font-semibold transition ${
                      isFavorite
                        ? 'border-primary-500 bg-primary-50 text-primary-800'
                        : 'border-background-300 bg-background-50 text-foreground-800 hover:border-foreground-300'
                    }`}
                  >
                    <i className={isFavorite ? 'ri-heart-3-fill' : 'ri-heart-3-line'} aria-hidden="true" />
                    {isFavorite ? 'Guardado en favoritos' : 'Guardar en favoritos'}
                  </button>

                  <div className="mt-5 flex flex-col gap-2.5 border-t border-background-200 pt-4">
                    {[
                      { icon: 'ri-checkbox-circle-line', text: 'Datos del anuncio completos' },
                      { icon: 'ri-message-2-line', text: 'Respuesta directa del dueño' },
                      { icon: 'ri-money-dollar-circle-line', text: 'Sin comisiones para el comprador' },
                    ].map((item) => (
                      <p key={item.text} className="flex items-center gap-2 text-xs text-foreground-600">
                        <i className={`${item.icon} text-accent-600`} aria-hidden="true" />
                        {item.text}
                      </p>
                    ))}
                  </div>

                  <p className="mt-4 rounded-xl bg-background-100 px-3 py-2.5 text-[11px] leading-relaxed text-foreground-500">
                    Anuncio publicado el {new Date(vehicle.created_at).toLocaleDateString('es-CR')}. Motora no
                    participa en la negociación ni en el pago.
                  </p>
                </div>
              </aside>
            </div>

            {similar.length > 0 && (
              <section className="mt-12">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-extrabold text-foreground-950 md:text-2xl">
                      Vehículos similares
                    </h2>
                    <p className="mt-1.5 text-sm text-foreground-600">
                      Otras opciones de tipo {vehicle.body_type} que podrían interesarte.
                    </p>
                  </div>
                  <Link
                    to={`/autos?body=${encodeURIComponent(vehicle.body_type)}`}
                    className="inline-flex w-fit cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-background-300 bg-background-50 px-4 py-2.5 text-sm font-bold text-foreground-800 transition hover:border-foreground-900 hover:bg-foreground-950 hover:text-background-50"
                  >
                    Ver más
                    <i className="ri-arrow-right-line" aria-hidden="true" />
                  </Link>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {similar.map((item) => (
                    <VehicleCard key={item.id} vehicle={item} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />

      <ContactModal vehicle={vehicle} open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}