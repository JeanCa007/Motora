export function formatPrice(value: number | null | undefined): string {
  const safe = Number(value ?? 0);
  return `$${new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 }).format(safe)}`;
}

export function formatNumber(value: number | null | undefined): string {
  const safe = Number(value ?? 0);
  return new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 }).format(safe);
}

export function formatMileage(value: number | null | undefined): string {
  const safe = Number(value ?? 0);
  if (safe <= 0) return '0 km';
  return `${formatNumber(safe)} km`;
}

export function formatShortDate(iso: string): string {
  try {
    const date = new Date(iso);
    return new Intl.DateTimeFormat('es-CR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  } catch {
    return '';
  }
}

export function timeAgo(iso: string): string {
  const created = new Date(iso).getTime();
  if (Number.isNaN(created)) return '';
  const diff = Math.max(0, Date.now() - created);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return minutes <= 1 ? 'hace un momento' : `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? 'hace 1 hora' : `hace ${hours} horas`;
  const days = Math.floor(hours / 24);
  if (days < 30) return days === 1 ? 'hace 1 día' : `hace ${days} días`;
  const months = Math.floor(days / 30);
  return months === 1 ? 'hace 1 mes' : `hace ${months} meses`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}