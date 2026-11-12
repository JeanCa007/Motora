import { Link } from 'react-router-dom';
import type { Vehicle } from '@/types';
import VehicleCard from '@/components/feature/VehicleCard';

interface VehicleGridSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  vehicles: Vehicle[];
  loading: boolean;
  error?: string;
  onRetry?: () => void;
  viewAllHref?: string;
  theme?: 'light' | 'muted';
}

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

export default function VehicleGridSection({
  eyebrow,
  title,
  description,
  vehicles,
  loading,
  error,
  onRetry,
  viewAllHref,
  theme = 'light',
}: VehicleGridSectionProps) {
  return (
    <section className={`w-full px-4 py-14 md:px-8 md:py-20 ${theme === 'muted' ? 'bg-background-200/60' : ''}`}>
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-600">
                <span className="h-px w-6 bg-primary-500" />
                {eyebrow}
              </p>
            )}
            <h2 className="text-balance font-heading text-2xl font-extrabold text-foreground-950 md:text-4xl">
              {title}
            </h2>
            {description && (
              <p className="mt-3 text-sm leading-relaxed text-foreground-600 md:text-base">{description}</p>
            )}
          </div>
          {viewAllHref && (
            <Link
              to={viewAllHref}
              className="inline-flex w-fit cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-background-300 bg-background-50 px-4 py-2.5 text-sm font-bold text-foreground-800 transition hover:border-foreground-900 hover:bg-foreground-950 hover:text-background-50"
            >
              Ver todos
              <i className="ri-arrow-right-line" aria-hidden="true" />
            </Link>
          )}
        </div>

        {error ? (
          <div className="card-surface mt-8 flex flex-col items-center gap-3 px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
              <i className="ri-error-warning-line text-2xl" aria-hidden="true" />
            </span>
            <p className="text-sm font-medium text-foreground-700">{error}</p>
            {onRetry && (
              <button type="button" onClick={onRetry} className="btn-outline mt-1 px-4 py-2.5">
                <i className="ri-refresh-line" aria-hidden="true" />
                Reintentar
              </button>
            )}
          </div>
        ) : loading ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <CardSkeleton key={item} />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="card-surface mt-8 flex flex-col items-center gap-3 px-6 py-14 text-center">
            <i className="ri-car-line text-4xl text-foreground-300" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground-600">Todavía no hay vehículos para mostrar.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}