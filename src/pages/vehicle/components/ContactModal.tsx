import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { Vehicle } from '@/types';

interface ContactModalProps {
  vehicle: Vehicle;
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ vehicle, open, onClose }: ContactModalProps) {
  const { user, profile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(profile?.full_name ?? '');
    setPhone(profile?.phone ?? '');
    setEmail(user?.email ?? '');
    setMessage(
      `Hola, me interesa el ${vehicle.title} (${vehicle.year}) publicado en Motora. ¿Sigue disponible?`,
    );
    setStatus('idle');
    setFeedback('');
  }, [open, profile, user, vehicle]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setFeedback('Completá tu nombre, correo y mensaje para enviar la consulta.');
      return;
    }
    setStatus('sending');
    setFeedback('');
    try {
      const { error } = await supabase.from('inquiries').insert({
        vehicle_id: vehicle.id,
        seller_id: vehicle.seller_id,
        buyer_id: user?.id ?? null,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim().slice(0, 500),
      });
      if (error) throw error;
      setStatus('success');
      setFeedback('Tu consulta fue enviada. El vendedor te contactará pronto.');
    } catch {
      setStatus('error');
      setFeedback('No pudimos enviar tu consulta. Intentá de nuevo en un momento.');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-foreground-950/65 backdrop-blur-sm"
      />
      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-background-50 shadow-lift sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4 border-b border-background-200 px-5 py-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground-950">Contactar al vendedor</h2>
            <p className="mt-1 line-clamp-1 text-xs text-foreground-500">{vehicle.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-background-300 text-foreground-700 transition hover:bg-background-100"
            aria-label="Cerrar formulario"
          >
            <i className="ri-close-line text-lg" aria-hidden="true" />
          </button>
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-100 text-accent-700">
              <i className="ri-checkbox-circle-line text-3xl" aria-hidden="true" />
            </span>
            <h3 className="font-heading text-lg font-bold text-foreground-950">¡Consulta enviada!</h3>
            <p className="max-w-sm text-sm text-foreground-600">{feedback}</p>
            <button type="button" onClick={onClose} className="btn-primary mt-2 px-5 py-2.5">
              Entendido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 overflow-y-auto px-5 py-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="min-w-0">
                <label className="label-base" htmlFor="contact-name">
                  Nombre
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="input-base"
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="min-w-0">
                <label className="label-base" htmlFor="contact-phone">
                  Teléfono
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="input-base"
                  placeholder="8888 8888"
                />
              </div>
            </div>

            <div className="min-w-0">
              <label className="label-base" htmlFor="contact-email">
                Correo electrónico
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input-base"
                placeholder="tu@correo.com"
                required
              />
            </div>

            <div className="min-w-0">
              <label className="label-base" htmlFor="contact-message">
                Mensaje
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value.slice(0, 500))}
                rows={4}
                maxLength={500}
                className="input-base resize-none"
                required
              />
              <p className="mt-1 text-right text-[11px] text-foreground-400">{message.length}/500</p>
            </div>

            {status === 'error' && (
              <p className="flex items-start gap-2 rounded-xl bg-primary-50 px-3 py-2.5 text-xs font-medium text-primary-800">
                <i className="ri-error-warning-line mt-0.5" aria-hidden="true" />
                {feedback}
              </p>
            )}

            <button type="submit" disabled={status === 'sending'} className="btn-primary mt-1 w-full">
              {status === 'sending' ? (
                <>
                  <i className="ri-loader-4-line animate-spin" aria-hidden="true" />
                  Enviando…
                </>
              ) : (
                <>
                  <i className="ri-send-plane-line" aria-hidden="true" />
                  Enviar consulta
                </>
              )}
            </button>
            <p className="text-center text-[11px] leading-relaxed text-foreground-400">
              Al enviar aceptás que el vendedor reciba tus datos de contacto para responder tu consulta.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}