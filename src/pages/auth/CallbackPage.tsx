import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AUTH_ROUTES, authErrorMessage, validateOrdinaryPostAuthNext } from '@/lib/auth';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const code = searchParams.get('code');
    const nextParam = searchParams.get('next');
    const providerError = searchParams.get('error_description') ?? searchParams.get('error');

    if (providerError) {
      setError('El enlace expiró o ya fue utilizado. Pedí uno nuevo e intentá otra vez.');
      return;
    }
    if (!code) {
      setError('Este enlace no es válido. Volvé a ingresar o pedí un código nuevo.');
      return;
    }

    const completeSession = async () => {
      try {
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) throw new Error(authErrorMessage(exchangeError.message));

        if (data?.redirectType === 'recovery') {
          navigate(AUTH_ROUTES.reset, { replace: true });
          return;
        }

        navigate(validateOrdinaryPostAuthNext(nextParam, '/'), { replace: true });
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'No pudimos completar el ingreso. Intentá de nuevo.',
        );
      }
    };

    completeSession();
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background-100 px-4 py-16">
      <div className="card-surface w-full max-w-[440px] px-6 py-10 text-center">
        <Link to="/" className="mb-6 inline-flex cursor-pointer items-center gap-2.5" aria-label="Motora, inicio">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground-950 text-background-50">
            <i className="ri-steering-2-line text-lg" aria-hidden="true" />
          </span>
          <span className="font-heading text-xl font-extrabold tracking-tight text-foreground-950">
            Motora<span className="text-primary-500">.</span>
          </span>
        </Link>

        {error ? (
          <div className="flex flex-col items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-700">
              <i className="ri-link-unlink text-3xl" aria-hidden="true" />
            </span>
            <h1 className="font-heading text-lg font-bold text-foreground-950">No pudimos completar el ingreso</h1>
            <p className="text-sm leading-relaxed text-foreground-600">{error}</p>
            <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row">
              <Link to={AUTH_ROUTES.login} className="btn-primary w-full py-3">
                Ir a ingresar
              </Link>
              <Link to={AUTH_ROUTES.forgot} className="btn-outline w-full py-3">
                Recuperar contraseña
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-100 text-accent-700">
              <i className="ri-loader-4-line animate-spin text-3xl" aria-hidden="true" />
            </span>
            <h1 className="font-heading text-lg font-bold text-foreground-950">Estamos confirmando tu cuenta</h1>
            <p className="text-sm leading-relaxed text-foreground-600">
              Esto toma solo un momento. No cierres esta ventana.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}