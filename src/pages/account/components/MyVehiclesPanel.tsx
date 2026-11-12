import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Vehicle } from '@/types';
import { formatMileage, formatPrice, formatShortDate } from '@/lib/format';
import { supabase } from '@/lib/supabase';

interface MyVehiclesPanelProps {
  vehicles: Vehicle[];
  loading: boolean;
  error: string;
  onReload: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Publicado',
  sold: 'Vendido',
  paused: 'Pausado',
};

export default function MyVehiclesPanel({ vehicles, loading, error, onReload }: MyVehiclesPanelProps) {
  const [pendingDelete, setPendingDelete] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    setFeedback('');
    try {
      const { error: deleteError } = await supabase.from('vehicles').delete().eq('id', pendingDelete.id);
      if (deleteError) throw deleteError;
      setPendingDelete(null);
      onReload();
    } catch {
      setFeedback('No pudimos eliminar el anuncio. Intentá de nuevo.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1].map((item) => (
          <div key={item} className="h-24 animate-pulse rounded-2xl bg-background-200" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-surface flex flex-col items-center gap-3 px-6 py-12 text-center">
        <i className="ri-error-warning-line text-3xl text-primary-600" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground-700">{error}</p>
        <button type="button" onClick={onReload} className="btn-outline px-4 py-2.5">
          Reintentar
        </button>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="card-surface flex flex-col items-center gap-3 px-6 py-14 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background-200 text-foreground-500">
          <i className="ri-car-line text-2xl" aria-hidden="true" />
        </span>
        <h3 className="font-heading text-lg font-bold text-foreground-950">Todavía no publicaste ningún auto</h3>
        <p className="max-w-sm text-sm text-foreground-600">
          Publicá tu vehículo gratis y empezá a recibir consultas de compradores de todo el país.
        </p>
        <Link to="/publicar" className="btn-primary mt-1 px-5 py-2.5">
          <i className="ri-add-line" aria-hidden="true" />
          Publicar mi primer auto
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {feedback && (
        <p className="rounded-xl bg-primary-50 px-3 py-2.5 text-xs font-medium text-primary-800">{feedback}</p>
      )}

      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className="card-surface flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-background-200">
              {vehicle.images?.[0] ? (
                <img
                  src={vehicle.images[0]}
                  alt={vehicle.title}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-foreground-300">
                  <i className="ri-image-line text-xl" aria-hidden="true" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                    vehicle.status === 'active'
                      ? 'bg-accent-100 text-accent-800'
                      : 'bg-background-200 text-foreground-600'
                  }`}
                >
                  {STATUS_LABEL[vehicle.status] ?? vehicle.status}
                </span>
                <span className="text-[11px] text-foreground-400">
                  Publicado el {formatShortDate(vehicle.created_at)}
                </span>
              </div>
              <Link
                to={`/auto/${vehicle.id}`}
                className="mt-1 block cursor-pointer truncate font-heading text-sm font-bold text-foreground-950 hover:text-primary-600"
              >
                {vehicle.title}
              </Link>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-600">
                <span className="font-bold text-foreground-950">{formatPrice(vehicle.price)}</span>
                <span>{formatMileage(vehicle.mileage)}</span>
                <span>{vehicle.province}</span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              to={`/auto/${vehicle.id}`}
              className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-background-300 px-3.5 py-2 text-xs font-bold text-foreground-800 transition hover:border-foreground-900 hover:bg-foreground-950 hover:text-background-50"
            >
              <i className="ri-eye-line" aria-hidden="true" />
              Ver
            </Link>
            <button
              type="button"
              onClick={() => setPendingDelete(vehicle)}
              className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-background-300 px-3.5 py-2 text-xs font-bold text-primary-700 transition hover:border-primary-500 hover:bg-primary-50"
            >
              <i className="ri-delete-bin-line" aria-hidden="true" />
              Eliminar
            </button>
          </div>
        </div>
      ))}

      {pendingDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Cancelar"
            onClick={() => setPendingDelete(null)}
            className="absolute inset-0 cursor-pointer bg-foreground-950/65 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-background-50 p-6">
            <h3 className="font-heading text-lg font-bold text-foreground-950">¿Eliminar este anuncio?</h3>
            <p className="mt-2 text-sm text-foreground-600">
              Se eliminará <strong className="text-foreground-900">{pendingDelete.title}</strong> y no se podrá
              recuperar.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="btn-outline px-4 py-2.5"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="btn-primary px-4 py-2.5"
              >
                {deleting ? 'Eliminando…' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}