import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/pages/auth/components/AuthLayout';
import AuthAlert from '@/pages/auth/components/AuthAlert';
import CodeInput from '@/pages/auth/components/CodeInput';
import { supabase } from '@/lib/supabase';
import { AUTH_ROUTES, authCallbackUrl, authErrorMessage } from '@/lib/auth';
import { useResendCooldown } from '@/hooks/useResendCooldown';

const RECOVERY_IMAGE =
  'https://readdy.ai/api/search-image?query=calm%20editorial%20photo%20of%20a%20person%20sitting%20in%20a%20parked%20car%20at%20dusk%20checking%20a%20phone%20with%20warm%20dashboard%20lights%20and%20a%20quiet%20minimal%20street%20scene&width=1200&height=1600&seq=auth-recovery-01&orientation=portrait';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const cooldown = useResendCooldown(45);

  const sendRecovery = async () => {
    const { error: sendError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: authCallbackUrl(AUTH_ROUTES.reset),
    });
    if (sendError) throw new Error(authErrorMessage(sendError.message));
  };

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      setError('Escribí el correo con el que creaste tu cuenta.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendRecovery();
      cooldown.start();
      setStep('code');
      setCode('');
      setStatus(`Enviamos un código de 6 dígitos a ${email.trim()}. Si no lo ves, revisá spam.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No pudimos enviar el correo.');
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
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: 'recovery',
      });
      if (verifyError) throw new Error(authErrorMessage(verifyError.message));
      navigate(AUTH_ROUTES.reset, { replace: true });
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
      await sendRecovery();
      cooldown.start();
      setStatus('Te enviamos un código nuevo para restablecer tu contraseña.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No pudimos reenviar el código.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Recuperá tu contraseña"
      subtitle="Te enviamos un código de 6 dígitos para que puedas crear una contraseña nueva en minutos."
      imageSrc={RECOVERY_IMAGE}
      imageAlt="Persona revisando su teléfono dentro de un vehículo"
      quote="Olvidé mi contraseña un domingo y en dos minutos ya estaba publicando de nuevo mi anuncio."
      quoteAuthor="José M. · Vendedor verificado"
      footer={
        <p>
          ¿Te acordaste de tu contraseña?{' '}
          <Link to={AUTH_ROUTES.login} className="cursor-pointer font-bold text-primary-700 hover:text-primary-800">
            Volver a ingresar
          </Link>
        </p>
      }
    >
      {step === 'email' ? (
        <form onSubmit={handleSend} className="flex flex-col gap-4">
          <div className="min-w-0">
            <label className="label-base" htmlFor="recovery-email">
              Correo de tu cuenta
            </label>
            <input
              id="recovery-email"
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

          {error && <AuthAlert variant="error">{error}</AuthAlert>}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin" aria-hidden="true" />
                Enviando código…
              </>
            ) : (
              <>
                Enviarme el código
                <i className="ri-mail-send-line" aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div className="card-surface flex items-center gap-3 px-4 py-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700">
              <i className="ri-shield-keyhole-line text-lg" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground-500">Código enviado a</p>
              <p className="truncate text-sm font-bold text-foreground-950">{email}</p>
            </div>
          </div>

          <div className="min-w-0">
            <span className="label-base">Código de recuperación</span>
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
                Continuar
                <i className="ri-arrow-right-line" aria-hidden="true" />
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
                setStep('email');
                setError('');
                setStatus('');
              }}
              className="cursor-pointer whitespace-nowrap font-semibold text-foreground-600 transition hover:text-foreground-950"
            >
              Cambiar correo
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}