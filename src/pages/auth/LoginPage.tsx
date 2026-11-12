import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '@/pages/auth/components/AuthLayout';
import AuthAlert from '@/pages/auth/components/AuthAlert';
import { supabase } from '@/lib/supabase';
import { AUTH_ROUTES, authCallbackUrl, authErrorMessage, validateOrdinaryPostAuthNext } from '@/lib/auth';
import { useResendCooldown } from '@/hooks/useResendCooldown';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resending, setResending] = useState(false);
  const cooldown = useResendCooldown(45);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Ingresá tu correo y contraseña para continuar.');
      return;
    }
    setLoading(true);
    setError('');
    setStatus('');
    setNeedsConfirmation(false);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) {
        if (authError.message.toLowerCase().includes('email not confirmed')) {
          setNeedsConfirmation(true);
        }
        throw new Error(authErrorMessage(authError.message));
      }
      navigate(validateOrdinaryPostAuthNext(next, AUTH_ROUTES.account), { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No pudimos iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim() || !cooldown.ready) return;
    setResending(true);
    setStatus('');
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: { emailRedirectTo: authCallbackUrl(AUTH_ROUTES.account) },
      });
      if (resendError) throw new Error(authErrorMessage(resendError.message));
      cooldown.start();
      setStatus('Te enviamos un código nuevo a tu correo. También podés abrir el enlace del mensaje.');
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : 'No pudimos reenviar el correo.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Ingresá a tu cuenta para administrar tus anuncios y ver los vehículos que guardaste."
      imageSrc="https://readdy.ai/api/search-image?query=premium%20editorial%20photo%20of%20a%20person%20holding%20car%20keys%20next%20to%20a%20elegant%20dark%20sedan%20in%20a%20minimal%20parking%20garage%20with%20warm%20soft%20lighting%20and%20moody%20tones&width=1200&height=1600&seq=auth-login-01&orientation=portrait"
      imageAlt="Persona con las llaves de su vehículo"
      quote="Publiqué mi Tucson un martes y el viernes ya había cerrado la venta con un comprador de Heredia."
      quoteAuthor="María F. · Vendió su SUV en 3 días"
      footer={
        <p>
          ¿Todavía no tenés cuenta?{' '}
          <Link to={AUTH_ROUTES.register} className="cursor-pointer font-bold text-primary-700 hover:text-primary-800">
            Crear cuenta gratis
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="min-w-0">
          <label className="label-base" htmlFor="login-email">
            Correo electrónico
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input-base"
            placeholder="tu@correo.com"
            required
          />
        </div>

        <div className="min-w-0">
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label className="label-base mb-0" htmlFor="login-password">
              Contraseña
            </label>
            <Link
              to={AUTH_ROUTES.forgot}
              className="cursor-pointer whitespace-nowrap text-xs font-semibold text-foreground-600 transition hover:text-foreground-950"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input-base pr-11"
              placeholder="Tu contraseña"
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

        {error && <AuthAlert variant="error">{error}</AuthAlert>}
        {status && <AuthAlert variant="success">{status}</AuthAlert>}

        {needsConfirmation && (
          <div className="flex flex-col gap-2 rounded-xl border border-dashed border-background-300 px-3 py-3">
            <p className="text-xs leading-relaxed text-foreground-600">
              Podés reenviar el correo de confirmación a <strong className="text-foreground-900">{email}</strong> y
              volver a intentar.
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || !cooldown.ready}
              className="btn-outline self-start px-4 py-2 text-xs"
            >
              {resending ? (
                <>
                  <i className="ri-loader-4-line animate-spin" aria-hidden="true" /> Enviando…
                </>
              ) : cooldown.ready ? (
                <>
                  <i className="ri-mail-send-line" aria-hidden="true" /> Reenviar confirmación
                </>
              ) : (
                <>Reenviar en {cooldown.remaining}s</>
              )}
            </button>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary mt-1 w-full py-3.5">
          {loading ? (
            <>
              <i className="ri-loader-4-line animate-spin" aria-hidden="true" />
              Ingresando…
            </>
          ) : (
            <>
              Ingresar a mi cuenta
              <i className="ri-arrow-right-line" aria-hidden="true" />
            </>
          )}
        </button>

        <p className="text-center text-xs leading-relaxed text-foreground-500">
          Al ingresar aceptás los términos y la política de privacidad de Motora.
        </p>
      </form>
    </AuthLayout>
  );
}