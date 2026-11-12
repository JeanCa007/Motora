import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/pages/auth/components/AuthLayout';
import AuthAlert from '@/pages/auth/components/AuthAlert';
import CodeInput from '@/pages/auth/components/CodeInput';
import { supabase } from '@/lib/supabase';
import { PROVINCES } from '@/lib/constants';
import { AUTH_ROUTES, authCallbackUrl, authErrorMessage } from '@/lib/auth';
import { useResendCooldown } from '@/hooks/useResendCooldown';

const REGISTER_IMAGE =
  'https://readdy.ai/api/search-image?query=warm%20editorial%20photo%20of%20a%20family%20receiving%20car%20keys%20in%20front%20of%20a%20clean%20silver%20SUV%20on%20a%20sunny%20driveway%20with%20soft%20natural%20light%20and%20neutral%20tones&width=1200&height=1600&seq=auth-register-02&orientation=portrait';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'code'>('form');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('San José');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const cooldown = useResendCooldown(45);

  const saveProfile = async (userId: string) => {
    try {
      await supabase
        .from('profiles')
        .upsert(
          { id: userId, full_name: fullName.trim(), phone: phone.trim(), province },
          { onConflict: 'id' },
        );
    } catch {
      /* el perfil se crea igual al ingresar */
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim()) {
      setError('Escribí tu nombre completo.');
      return;
    }
    if (!email.trim()) {
      setError('Escribí un correo electrónico válido.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!accepted) {
      setError('Necesitás aceptar los términos para crear tu cuenta.');
      return;
    }

    setLoading(true);
    setError('');
    setStatus('');
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: authCallbackUrl(AUTH_ROUTES.account),
          data: { full_name: fullName.trim(), phone: phone.trim(), province },
        },
      });
      if (authError) throw new Error(authErrorMessage(authError.message));

      if (data.session && data.user) {
        await saveProfile(data.user.id);
        navigate(AUTH_ROUTES.account, { replace: true });
        return;
      }

      setStep('code');
      setCode('');
      setStatus(`Enviamos un código de 6 dígitos a ${email.trim()}. También llega un enlace de confirmación.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No pudimos crear tu cuenta.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.trim().length !== 6) {
      setError('Ingresá los 6 dígitos que te enviamos por correo.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: 'signup',
      });
      if (verifyError) throw new Error(authErrorMessage(verifyError.message));
      if (!data.user) throw new Error('No pudimos confirmar tu cuenta. Intentá de nuevo.');

      await saveProfile(data.user.id);
      navigate(AUTH_ROUTES.account, { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'El código no es válido.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!cooldown.ready) return;
    setResending(true);
    setError('');
    setStatus('');
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: { emailRedirectTo: authCallbackUrl(AUTH_ROUTES.account) },
      });
      if (resendError) throw new Error(authErrorMessage(resendError.message));
      cooldown.start();
      setStatus('Te enviamos un código nuevo. Revisá también la carpeta de spam.');
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : 'No pudimos reenviar el código.');
    } finally {
      setResending(false);
    }
  };

  const footer = (
    <p>
      ¿Ya tenés cuenta?{' '}
      <Link to={AUTH_ROUTES.login} className="cursor-pointer font-bold text-primary-700 hover:text-primary-800">
        Ingresar
      </Link>
    </p>
  );

  if (step === 'code') {
    return (
      <AuthLayout
        title="Confirmá tu correo"
        subtitle="Ingresá el código de 6 dígitos que enviamos a tu correo para activar tu cuenta."
        imageSrc={REGISTER_IMAGE}
        imageAlt="Familia recibiendo las llaves de su nuevo vehículo"
        quote="Registrarme tomó un minuto y en la misma tarde ya tenía mi anuncio con fotos publicado."
        quoteAuthor="Andrés Q. · Vendió su Honda CR-V"
        footer={footer}
      >
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div className="card-surface flex items-center gap-3 px-4 py-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700">
              <i className="ri-mail-check-line text-lg" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground-500">Código enviado a</p>
              <p className="truncate text-sm font-bold text-foreground-950">{email}</p>
            </div>
          </div>

          <div className="min-w-0">
            <span className="label-base">Código de verificación</span>
            <CodeInput value={code} onChange={setCode} disabled={loading} hasError={Boolean(error)} autoFocus />
          </div>

          {error && <AuthAlert variant="error">{error}</AuthAlert>}
          {status && <AuthAlert variant="success">{status}</AuthAlert>}

          <button type="submit" disabled={loading || code.length !== 6} className="btn-primary w-full py-3.5">
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin" aria-hidden="true" />
                Verificando…
              </>
            ) : (
              <>
                Confirmar y entrar
                <i className="ri-check-line" aria-hidden="true" />
              </>
            )}
          </button>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || !cooldown.ready}
              className="cursor-pointer whitespace-nowrap font-semibold text-foreground-700 transition hover:text-foreground-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resending ? 'Enviando…' : cooldown.ready ? 'Reenviar código' : `Reenviar en ${cooldown.remaining}s`}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('form');
                setError('');
                setStatus('');
              }}
              className="cursor-pointer whitespace-nowrap font-semibold text-foreground-600 transition hover:text-foreground-950"
            >
              Cambiar correo
            </button>
          </div>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Creá tu cuenta gratis"
      subtitle="Publicá tu vehículo, guardá tus autos favoritos y recibí consultas de compradores reales."
      imageSrc={REGISTER_IMAGE}
      imageAlt="Familia recibiendo las llaves de su nuevo vehículo"
      quote="Registrarme tomó un minuto y en la misma tarde ya tenía mi anuncio con fotos publicado."
      quoteAuthor="Andrés Q. · Vendió su Honda CR-V"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="min-w-0">
          <label className="label-base" htmlFor="register-name">
            Nombre completo
          </label>
          <input
            id="register-name"
            name="full_name"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="input-base"
            placeholder="Ana Villalobos"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <label className="label-base" htmlFor="register-email">
              Correo
            </label>
            <input
              id="register-email"
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
            <label className="label-base" htmlFor="register-phone">
              Teléfono
            </label>
            <input
              id="register-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="input-base"
              placeholder="8888 8888"
            />
          </div>
        </div>

        <div className="min-w-0">
          <label className="label-base" htmlFor="register-province">
            Provincia
          </label>
          <select
            id="register-province"
            name="province"
            value={province}
            onChange={(event) => setProvince(event.target.value)}
            className="input-base cursor-pointer"
          >
            {PROVINCES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <label className="label-base" htmlFor="register-password">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="register-password"
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
            <label className="label-base" htmlFor="register-confirm">
              Repetir contraseña
            </label>
            <input
              id="register-confirm"
              name="confirm_password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="input-base"
              placeholder="Repetí tu contraseña"
              required
            />
          </div>
        </div>

        <label
          htmlFor="register-terms"
          className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-foreground-600"
        >
          <input
            id="register-terms"
            name="terms"
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-0.5 h-4 w-4 cursor-pointer accent-primary-500"
          />
          <span>
            Acepto los términos y condiciones y la política de privacidad de Motora, y confirmo que la información
            que publicaré es verídica.
          </span>
        </label>

        {error && <AuthAlert variant="error">{error}</AuthAlert>}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
          {loading ? (
            <>
              <i className="ri-loader-4-line animate-spin" aria-hidden="true" />
              Creando tu cuenta…
            </>
          ) : (
            <>
              Crear cuenta gratis
              <i className="ri-arrow-right-line" aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}