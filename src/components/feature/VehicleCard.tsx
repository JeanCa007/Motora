import { Link } from 'react-router-dom';
import type { Vehicle } from '@/types';
import { formatMileage, formatPrice, timeAgo } from '@/lib/format';
import { useFavorite } from '@/hooks/useFavorite';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const { isFavorite, toggle, busy } = useFavorite(vehicle.id);
  const cover = vehicle.images?.[0] ?? '';

  return (
    <article className="card-surface group overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-background-300 hover:shadow-lift">
      <div className="relative">
        <Link to={`/auto/${vehicle.id}`} className="block cursor-pointer">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-background-200">
            {cover ? (
              <img
                src={cover}
                alt={`${vehicle.title} en venta en ${vehicle.province}`}
                title={`${vehicle.title} · ${vehicle.brand} ${vehicle.model}`}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.06]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-foreground-300">
                <i className="ri-image-line text-4xl" aria-hidden="true" />
              </div>
            )}
          </div>
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-background-50/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground-800 backdrop-blur">
            {vehicle.condition}
          </span>
          {vehicle.featured && (
            <span className="rounded-full bg-primary-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground-950">
              Destacado
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={toggle}
          disabled={busy}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          className={`absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full backdrop-blur transition ${
            isFavorite
              ? 'bg-primary-500 text-foreground-950'
              : 'bg-background-50/90 text-foreground-700 hover:bg-background-50'
          }`}
        >
          <i className={isFavorite ? 'ri-heart-3-fill text-base' : 'ri-heart-3-line text-base'} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-col gap-3 p-4 md:p-5">
        <div>
          <Link to={`/auto/${vehicle.id}`} className="cursor-pointer">
            <h3 className="line-clamp-1 font-heading text-base font-bold text-foreground-950 transition-colors group-hover:text-primary-600 md:text-lg">
              {vehicle.title}
            </h3>
          </Link>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground-500">
            <i className="ri-map-pin-line text-sm" aria-hidden="true" />
            <span className="truncate">
              {vehicle.province}
              {vehicle.city ? `, ${vehicle.city}` : ''}
            </span>
            <span className="text-foreground-300">·</span>
            <span className="whitespace-nowrap">{timeAgo(vehicle.created_at)}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-foreground-600">
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <i className="ri-calendar-line text-sm text-foreground-400" aria-hidden="true" />
            {vehicle.year}
          </span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <i className="ri-roadster-line text-sm text-foreground-400" aria-hidden="true" />
            {formatMileage(vehicle.mileage)}
          </span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <i className="ri-settings-3-line text-sm text-foreground-400" aria-hidden="true" />
            {vehicle.transmission}
          </span>
        </div>

        <div className="mt-1 flex items-end justify-between gap-2 border-t border-background-200 pt-3">
          <div>
            <p className="font-heading text-xl font-extrabold text-foreground-950">{formatPrice(vehicle.price)}</p>
            <p className="text-[11px] font-medium uppercase tracking-wide text-foreground-400">{vehicle.currency}</p>
          </div>
          <Link
            to={`/auto/${vehicle.id}`}
            className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-background-300 px-3.5 py-2 text-xs font-bold text-foreground-800 transition hover:border-foreground-900 hover:bg-foreground-950 hover:text-background-50"
          >
            Ver detalle
            <i className="ri-arrow-right-line" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}