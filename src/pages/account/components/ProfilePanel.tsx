import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { PROVINCES } from '@/lib/constants';

export default function ProfilePanel() {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('San José');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setFullName(profile?.full_name ?? '');
    setPhone(profile?.phone ?? '');
    setProvince(profile?.province || 'San José');
  }, [profile]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    if (!fullName.trim()) {
      setStatus('error');
      setFeedback('Escribí tu nombre completo.');
      return;
    }
    setStatus('saving');
    setFeedback('');
    try {
      const { error } = await supabase.from('profiles').upsert(
        {
          id: user.id,
          full_name: fullName.trim(),
          phone: phone.trim(),
          province,
        },
        { onConflict: 'id' },
      );
      if (error) throw error;
      await refreshProfile();
      setStatus('saved');
      setFeedback('Tus datos se actualizaron correctamente.');
    } catch {
      setStatus('error');
      setFeedback('No pudimos guardar tus datos. Intentá de nuevo.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface flex flex-col gap-4 p-5 md:p-6">
      <div>
        <h2 className="font-heading text-lg font-bold text-foreground-950">Datos personales</h2>
        <p className="mt-1 text-sm text-foreground-600">
          Estos datos se muestran a los compradores cuando publicás un vehículo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <label className="label-base" htmlFor="profile-name">
            Nombre completo
          </label>
          <input
            id="profile-name"
            name="full_name"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="input-base"
            placeholder="Tu nombre"
          />
        </div>
        <div className="min-w-0">
          <label className="label-base" htmlFor="profile-phone">
            Teléfono
          </label>
          <input
            id="profile-phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="input-base"
            placeholder="8888 8888"
          />
        </div>
        <div className="min-w-0">
          <label className="label-base" htmlFor="profile-province">
            Provincia
          </label>
          <select
            id="profile-province"
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
        <div className="min-w-0">
          <label className="label-base" htmlFor="profile-email">
            Correo electrónico
          </label>
          <input
            id="profile-email"
            name="email"
            type="email"
            value={user?.email ?? ''}
            readOnly
            className="input-base cursor-not-allowed bg-background-200 text-foreground-500"
          />
        </div>
      </div>

      {feedback && (
        <p
          className={`flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs font-medium ${
            status === 'error' ? 'bg-primary-50 text-primary-800' : 'bg-accent-50 text-accent-800'
          }`}
        >
          <i
            className={status === 'error' ? 'ri-error-warning-line mt-0.5' : 'ri-checkbox-circle-line mt-0.5'}
            aria-hidden="true"
          />
          {feedback}
        </p>
      )}

      <div>
        <button type="submit" disabled={status === 'saving'} className="btn-primary px-5 py-2.5">
          {status === 'saving' ? (
            <>
              <i className="ri-loader-4-line animate-spin" aria-hidden="true" />
              Guardando…
            </>
          ) : (
            'Guardar cambios'
          )}
        </button>
      </div>
    </form>
  );
}