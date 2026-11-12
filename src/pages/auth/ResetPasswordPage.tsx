import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/pages/auth/components/AuthLayout';
import AuthAlert from '@/pages/auth/components/AuthAlert';
import { supabase } from '@/lib/supabase';
import { AUTH_ROUTES, authErrorMessage } from '@/lib/auth';

const RESET_IMAGE =
  'https://readdy.ai/api/search-image?query=bright%20editorial%20photo%20of%20a%20modern%20car%20interior%20with%20a%20smartphone%20on%20the%20console%20and%20sunlight%20through%20the%20windshield%2C%20warm%20neutral%20tones%20and%20clean%20composition&width=1200&height=1600&seq=auth-reset-01&orientation=portrait';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setHasSession(Boolean(data.session));
      })
      .catch(() => {
        if (active) setHasSession(false);
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(() => {
      navigate(AUTH_ROUTES.login, { replace: true });
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [done, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw new Error(authErrorMessage(updateError.message));
      setDone(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No pudimos actualizar tu contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <p>
      ¿Prefiero empezar de nuevo?{' '}
      <Link to={AUTH_ROUTES.forgot} className="cursor-pointer font-bold text-primary-700 hover:text-primary-800">
        Pedir otro código
      </Link>
    </p>
  );

  return (
    <AuthLayout
      title="Creá una contraseña nueva"
      subtitle="Elegí una contraseña distinta a la anterior y volvé a entrar a tu cuenta."
      imageSrc={RESET_IMAGE}
      imageAlt="Interior de un vehículo con un teléfono en la consola"
      quote="Cambiar la contraseña me tomó menos de un minuto y seguí con mis anuncios sin perder nada."
      quoteAuthor="Karla R. · Usuaria de Motora"
      footer={footer}
    >
      {done ? (
        <div className="card-surface flex flex-col items-center gap-3 px-6 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-100 text-accent-700">
            <i className="ri-lock-unlock-line text-3xl" aria-hidden="true" />
          </span>
          <h2 className="font-heading text-base font-bold text-foreground-950">Contraseña actualizada</h2>
          <p className="text-sm leading-relaxed text-foreground-600">
            Todo listo. Te llevamos a la pantalla de ingreso para que entres con tu contraseña nueva.
          </p>
          <Link to={AUTH_ROUTES.login} className="btn-primary mt-2 px-5 py-2.5">
            Ir a ingresar
          </Link>
        </div>
      ) : checking ? (
        <div className="card-surface flex items-center justify-center gap-2 px-6 py-10 text-sm text-foreground-600">
          <i className="ri-loader-4-line animate-spin" aria-hidden="true" />
          Verificando tu solicitud…
        </div>
      ) : !hasSession ? (
        <div className="card-surface flex flex-col items-center gap-3 px-6 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-700">
            <i className="ri-time-line text-3xl" aria-hidden="true" />
          </span>
          <h2 className="font-heading text-base font-bold text-foreground-950">Este enlace ya venció</h2>
          <p className="text-sm leading-relaxed text-foreground-600">
            Por seguridad, los enlaces de recuperación duran poco. Pedí un código nuevo y volvés a empezar en
            segundos.
          </p>
          <Link to={AUTH_ROUTES.forgot} className="btn-primary mt-2 px-5 py-2.5">
            Pedir un código nuevo
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="min-w-0">
            <label className="label-base" htmlFor="reset-password">
              Contraseña nueva
            </label>
            <div className="relative">
              <input
                id="reset-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="input-base pr-11"
                placeholder="Mínimo 6 caracteres"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-foreground-500 transition hover:bg-background-200"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="min-w-0">
            <label className="label-base" htmlFor="reset-confirm">
              Repetir contraseña
            </label>
            <input
              id="reset-confirm"
              name="confirm_password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="input-base"
              placeholder="Repetí tu contraseña nueva"
              required
            />
          </div>

          {error && <AuthAlert variant="error">{error}</AuthAlert>}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin" aria-hidden="true" />
                Guardando…
              </>
            ) : (
              <>
                Guardar contraseña
                <i className="ri-check-line" aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}