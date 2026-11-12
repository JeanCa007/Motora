import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/pages/auth/components/AuthLayout';
import { supabase } from '@/lib/supabase';
import { PROVINCES } from '@/lib/constants';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('San José');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

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
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName.trim(), phone: phone.trim() } },
      });
      if (authError) {
        const message = authError.message.toLowerCase();
        if (message.includes('already registered')) {
          throw new Error('Ese correo ya tiene una cuenta. Probá ingresando o recuperá tu contraseña.');
        }
        throw new Error(authError.message);
      }

      if (data.user) {
        try {
          await supabase
            .from('profiles')
            .upsert(
              { id: data.user.id, full_name: fullName.trim(), phone: phone.trim(), province },
              { onConflict: 'id' },
            );
        } catch {
          /* el perfil se completa al iniciar sesión */
        }
      }

      if (data.session) {
        navigate('/mi-cuenta');
      } else {
        setNeedsConfirmation(true);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No pudimos crear tu cuenta.');
    } finally {
      setLoading(false);
    }
  };

  if (needsConfirmation) {
    return (
      <AuthLayout
        title="Confirmá tu correo"
        subtitle="Te enviamos un enlace de confirmación. Una vez confirmado podrás ingresar y publicar tu vehículo."
        imageSrc="https://readdy.ai/api/search-image?query=warm%20editorial%20photo%20of%20a%20family%20receiving%20car%20keys%20in%20front%20of%20a%20clean%20silver%20SUV%20on%20a%20sunny%20driveway%20with%20soft%20natural%20light%20and%20neutral%20tones&width=1200&height=1600&seq=auth-register-02&orientation=portrait"
        imageAlt="Familia recibiendo las llaves de su nuevo vehículo"
        quote="Registrarme tomó un minuto y en la misma tarde ya tenía mi anuncio con fotos publicado."
        quoteAuthor="Andrés Q. · Vendió su Honda CR-V"
        footer={
          <p>
            ¿Ya tenés cuenta?{' '}
            <Link to="/ingresar" className="cursor-pointer font-bold text-primary-700 hover:text-primary-800">
              Ingresar
            </Link>
          </p>
        }
      >
        <div className="card-surface flex flex-col items-center gap-3 px-6 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-100 text-accent-700">
            <i className="ri-mail-check-line text-3xl" aria-hidden="true" />
          </span>
          <h2 className="font-heading text-base font-bold text-foreground-950">Revisá tu bandeja de entrada</h2>
          <p className="text-sm leading-relaxed text-foreground-600">
            Enviamos un enlace de confirmación a <strong className="text-foreground-900">{email}</strong>. Si no
            lo encontrás, revisá la carpeta de spam.
          </p>
          <Link to="/ingresar" className="btn-primary mt-2 px-5 py-2.5">
            Ir a ingresar
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Creá tu cuenta gratis"
      subtitle="Publicá tu vehículo, guardá tus autos favoritos y recibí consultas de compradores reales."
      imageSrc="https://readdy.ai/api/search-image?query=warm%20editorial%20photo%20of%20a%20family%20receiving%20car%20keys%20in%20front%20of%20a%20clean%20silver%20SUV%20on%20a%20sunny%20driveway%20with%20soft%20natural%20light%20and%20neutral%20tones&width=1200&height=1600&seq=auth-register-02&orientation=portrait"
      imageAlt="Familia recibiendo las llaves de su nuevo vehículo"
      quote="Registrarme tomó un minuto y en la misma tarde ya tenía mi anuncio con fotos publicado."
      quoteAuthor="Andrés Q. · Vendió su Honda CR-V"
      footer={
        <p>
          ¿Ya tenés cuenta?{' '}
          <Link to="/ingresar" className="cursor-pointer font-bold text-primary-700 hover:text-primary-800">
            Ingresar
          </Link>
        </p>
      }
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
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input-base"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          <div className="min-w-0">
            <label className="label-base" htmlFor="register-confirm">
              Repetir contraseña
            </label>
            <input
              id="register-confirm"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="input-base"
              placeholder="Repetí tu contraseña"
              required
            />
          </div>
        </div>

        <label htmlFor="register-terms" className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-foreground-600">
          <input
            id="register-terms"
            name="terms"
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-0.5 h-4 w-4 cursor-pointer accent-primary-500"
          />
          <span>
            Acepto los términos y condiciones y la política de privacidad de Motora, y confirmo que la
            información que publicaré es verídica.
          </span>
        </label>

        {error && (
          <p className="flex items-start gap-2 rounded-xl bg-primary-50 px-3 py-2.5 text-xs font-medium text-primary-800">
            <i className="ri-error-warning-line mt-0.5" aria-hidden="true" />
            {error}
          </p>
        )}

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