interface AuthAlertProps {
  variant?: 'error' | 'success' | 'info';
  children: React.ReactNode;
}

const STYLES: Record<NonNullable<AuthAlertProps['variant']>, string> = {
  error: 'bg-primary-50 text-primary-800',
  success: 'bg-accent-50 text-accent-800',
  info: 'bg-background-200 text-foreground-700',
};

const ICONS: Record<NonNullable<AuthAlertProps['variant']>, string> = {
  error: 'ri-error-warning-line',
  success: 'ri-checkbox-circle-line',
  info: 'ri-information-line',
};

export default function AuthAlert({ variant = 'error', children }: AuthAlertProps) {
  return (
    <p className={`flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs font-medium leading-relaxed ${STYLES[variant]}`}>
      <i className={`${ICONS[variant]} mt-0.5 shrink-0`} aria-hidden="true" />
      <span className="min-w-0">{children}</span>
    </p>
  );
}