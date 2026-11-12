import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/pages/auth/components/AuthLayout';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Ingresá tu correo y contraseña para continuar.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) {
        const message = authError.message.toLowerCase();
        if (message.includes('invalid login')) {
          throw new Error('Correo o contraseña incorrectos. Verificá tus datos e intentá de nuevo.');
        }
        if (message.includes('email not confirmed')) {
          throw new Error('Tu correo todavía no está confirmado. Revisá tu bandeja de entrada.');
        }
        throw new Error(authError.message);
      }
      navigate('/mi-cuenta');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No pudimos iniciar sesión.');
    } finally {
      setLoading(false);
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
          <Link to="/registro" className="cursor-pointer font-bold text-primary-700 hover:text-primary-800">
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
          <label className="label-base" htmlFor="login-password">
            Contraseña
          </label>
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

        {error && (
          <p className="flex items-start gap-2 rounded-xl bg-primary-50 px-3 py-2.5 text-xs font-medium text-primary-800">
            <i className="ri-error-warning-line mt-0.5" aria-hidden="true" />
            {error}
          </p>
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
      </form>
    </AuthLayout>
  );
}