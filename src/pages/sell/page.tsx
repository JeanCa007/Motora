import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteHeader from '@/components/feature/SiteHeader';
import SiteFooter from '@/components/feature/SiteFooter';
import PhotoUploader from '@/pages/sell/components/PhotoUploader';
import { useAuth } from '@/context/AuthContext';
import { supabase, VEHICLE_BUCKET } from '@/lib/supabase';
import { BODY_TYPES, BRANDS, CONDITIONS, FUEL_TYPES, PROVINCES, TRANSMISSIONS } from '@/lib/constants';

const FEATURE_OPTIONS = [
  'Aire acondicionado',
  'Cámara de reversa',
  'Pantalla táctil',
  'Cuero',
  'Techo panorámico',
  '4x4',
  'Apple CarPlay',
  'Control de crucero',
  'Sensores de parqueo',
  'Financiamiento',
  'Llantas nuevas',
  'Garantía de fábrica',
];

const YEARS = Array.from({ length: 27 }, (_, index) => new Date().getFullYear() + 1 - index);

export default function SellPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [brand, setBrand] = useState('Toyota');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [price, setPrice] = useState('');
  const [mileage, setMileage] = useState('');
  const [transmission, setTransmission] = useState('Automática');
  const [fuel, setFuel] = useState('Gasolina');
  const [bodyType, setBodyType] = useState('SUV');
  const [condition, setCondition] = useState('Usado');
  const [province, setProvince] = useState(profile?.province || 'San José');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);

  const title = useMemo(() => `${brand} ${model.trim() || 'Modelo'} ${year}`.replace(/\s+/g, ' ').trim(), [brand, model, year]);

  const toggleFeature = (feature: string) => {
    setFeatures((current) =>
      current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature],
    );
  };

  const uploadPhotos = async (): Promise<string[]> => {
    if (!user || photos.length === 0) return [];
    const urls: string[] = [];
    for (let index = 0; index < photos.length; index += 1) {
      const file = photos[index];
      const extension = (file.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
      const path = `${user.id}/${Date.now()}-${index}.${extension || 'jpg'}`;
      const { error: uploadError } = await supabase.storage.from(VEHICLE_BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(VEHICLE_BUCKET).getPublicUrl(path);
      if (data?.publicUrl) urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      navigate('/ingresar');
      return;
    }
    if (!model.trim()) {
      setError('Escribí el modelo del vehículo.');
      return;
    }
    const numericPrice = Number(price);
    if (!numericPrice || numericPrice <= 0) {
      setError('Ingresá un precio válido en dólares.');
      return;
    }
    if (photos.length === 0) {
      setError('Agregá al menos una foto real del vehículo.');
      return;
    }

    setPublishing(true);
    setError('');
    try {
      const imageUrls = await uploadPhotos();
      const { data, error: insertError } = await supabase
        .from('vehicles')
        .insert({
          seller_id: user.id,
          seller_name: profile?.full_name || user.email?.split('@')[0] || 'Vendedor Motora',
          seller_phone: profile?.phone ?? '',
          title,
          brand,
          model: model.trim(),
          year: Number(year),
          price: numericPrice,
          currency: 'USD',
          mileage: Number(mileage) || 0,
          transmission,
          fuel_type: fuel,
          body_type: bodyType,
          condition,
          province,
          city: city.trim(),
          description: description.trim().slice(0, 1200),
          images: imageUrls,
          features,
          status: 'active',
        })
        .select('id')
        .single();

      if (insertError) throw insertError;
      navigate(`/auto/${data.id}`);
    } catch {
      setError('No pudimos publicar tu anuncio. Revisá los datos e intentá de nuevo.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-100">
      <SiteHeader />
      <main className="flex-1">
        <div className="w-full border-b border-background-200 bg-background-50 px-4 py-8 md:px-8 md:py-10">
          <div className="mx-auto w-full max-w-[1100px]">
            <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-xs text-foreground-500">
              <Link to="/" className="cursor-pointer transition-colors hover:text-foreground-900">
                Inicio
              </Link>
              <i className="ri-arrow-right-s-line" aria-hidden="true" />
              <span className="font-semibold text-foreground-800">Publicar vehículo</span>
            </nav>
            <h1 className="mt-4 font-heading text-3xl font-extrabold text-foreground-950 md:text-4xl">
              Publicá tu vehículo gratis
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground-600 md:text-base">
              Completá los datos, subí fotos reales y tu anuncio quedará visible para compradores de todo el
              país en cuestión de segundos.
            </p>
          </div>
        </div>

        <div className="w-full px-4 py-8 md:px-8">
          <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <form id="sell-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
              <section className="card-surface p-5 md:p-6">
                <h2 className="font-heading text-lg font-bold text-foreground-950">Datos del vehículo</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label className="label-base" htmlFor="sell-brand">
                      Marca
                    </label>
                    <select
                      id="sell-brand"
                      name="brand"
                      value={brand}
                      onChange={(event) => setBrand(event.target.value)}
                      className="input-base cursor-pointer"
                    >
                      {BRANDS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-0">
                    <label className="label-base" htmlFor="sell-model">
                      Modelo
                    </label>
                    <input
                      id="sell-model"
                      name="model"
                      type="text"
                      value={model}
                      onChange={(event) => setModel(event.target.value)}
                      className="input-base"
                      placeholder="Ej. RAV4 Hybrid"
                      required
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="label-base" htmlFor="sell-year">
                      Año
                    </label>
                    <select
                      id="sell-year"
                      name="year"
                      value={year}
                      onChange={(event) => setYear(event.target.value)}
                      className="input-base cursor-pointer"
                    >
                      {YEARS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-0">
                    <label className="label-base" htmlFor="sell-price">
                      Precio (USD)
                    </label>
                    <input
                      id="sell-price"
                      name="price"
                      type="number"
                      min="500"
                      step="100"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                      className="input-base"
                      placeholder="18500"
                      required
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="label-base" htmlFor="sell-mileage">
                      Kilometraje
                    </label>
                    <input
                      id="sell-mileage"
                      name="mileage"
                      type="number"
                      min="0"
                      step="100"
                      value={mileage}
                      onChange={(event) => setMileage(event.target.value)}
                      className="input-base"
                      placeholder="45000"
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="label-base" htmlFor="sell-transmission">
                      Transmisión
                    </label>
                    <select
                      id="sell-transmission"
                      name="transmission"
                      value={transmission}
                      onChange={(event) => setTransmission(event.target.value)}
                      className="input-base cursor-pointer"
                    >
                      {TRANSMISSIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-0">
                    <label className="label-base" htmlFor="sell-fuel">
                      Combustible
                    </label>
                    <select
                      id="sell-fuel"
                      name="fuel"
                      value={fuel}
                      onChange={(event) => setFuel(event.target.value)}
                      className="input-base cursor-pointer"
                    >
                      {FUEL_TYPES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-0">
                    <label className="label-base" htmlFor="sell-body">
                      Tipo de carro
                    </label>
                    <select
                      id="sell-body"
                      name="body_type"
                      value={bodyType}
                      onChange={(event) => setBodyType(event.target.value)}
                      className="input-base cursor-pointer"
                    >
                      {BODY_TYPES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="label-base">Condición</span>
                  <div className="flex flex-wrap gap-2">
                    {CONDITIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCondition(item)}
                        className={`cursor-pointer whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition ${
                          condition === item
                            ? 'border-foreground-950 bg-foreground-950 text-background-50'
                            : 'border-background-300 bg-background-50 text-foreground-600 hover:border-foreground-400'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="card-surface p-5 md:p-6">
                <h2 className="font-heading text-lg font-bold text-foreground-950">Fotos del vehículo</h2>
                <p className="mt-1 text-sm text-foreground-600">
                  Los anuncios con buenas fotos reciben hasta 3 veces más consultas.
                </p>
                <div className="mt-4">
                  <PhotoUploader files={photos} onChange={setPhotos} />
                </div>
              </section>

              <section className="card-surface p-5 md:p-6">
                <h2 className="font-heading text-lg font-bold text-foreground-950">Descripción y extras</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label className="label-base" htmlFor="sell-province">
                      Provincia
                    </label>
                    <select
                      id="sell-province"
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
                    <label className="label-base" htmlFor="sell-city">
                      Cantón o ciudad
                    </label>
                    <input
                      id="sell-city"
                      name="city"
                      type="text"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      className="input-base"
                      placeholder="Ej. Escazú"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="label-base" htmlFor="sell-description">
                    Descripción
                  </label>
                  <textarea
                    id="sell-description"
                    name="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value.slice(0, 1200))}
                    rows={5}
                    maxLength={1200}
                    className="input-base resize-none"
                    placeholder="Contá el estado del vehículo, el mantenimiento, si tiene prenda o si aceptás cambios."
                  />
                  <p className="mt-1 text-right text-[11px] text-foreground-400">{description.length}/1200</p>
                </div>

                <div className="mt-2">
                  <span className="label-base">Extras incluidos</span>
                  <div className="flex flex-wrap gap-2">
                    {FEATURE_OPTIONS.map((feature) => {
                      const selected = features.includes(feature);
                      return (
                        <button
                          key={feature}
                          type="button"
                          onClick={() => toggleFeature(feature)}
                          className={`cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                            selected
                              ? 'border-accent-500 bg-accent-500 text-background-50'
                              : 'border-background-300 bg-background-50 text-foreground-600 hover:border-foreground-400'
                          }`}
                        >
                          {selected && <i className="ri-check-line mr-1" aria-hidden="true" />}
                          {feature}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {error && (
                <p className="flex items-start gap-2 rounded-xl bg-primary-50 px-3 py-2.5 text-xs font-medium text-primary-800">
                  <i className="ri-error-warning-line mt-0.5" aria-hidden="true" />
                  {error}
                </p>
              )}

              <div className="lg:hidden">
                <button type="submit" disabled={publishing} className="btn-primary w-full py-3.5">
                  {publishing ? 'Publicando…' : 'Publicar mi anuncio'}
                </button>
              </div>
            </form>

            <aside className="flex flex-col gap-4">
              <div className="card-surface sticky top-24 p-5">
                <p className="label-base">Vista previa del título</p>
                <p className="font-heading text-lg font-extrabold text-foreground-950">{title}</p>
                <div className="mt-4 flex flex-col gap-2 border-t border-background-200 pt-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-500">Precio</span>
                    <span className="font-bold text-foreground-950">
                      {price ? `$${Number(price).toLocaleString('es-CR')}` : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-500">Fotos</span>
                    <span className="font-bold text-foreground-950">{photos.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-500">Ubicación</span>
                    <span className="font-bold text-foreground-950">{province}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const form = document.getElementById('sell-form') as HTMLFormElement | null;
                    form?.requestSubmit();
                  }}
                  disabled={publishing}
                  className="btn-primary mt-5 hidden w-full lg:inline-flex"
                >
                  {publishing ? (
                    <>
                      <i className="ri-loader-4-line animate-spin" aria-hidden="true" />
                      Publicando…
                    </>
                  ) : (
                    <>
                      <i className="ri-upload-cloud-2-line" aria-hidden="true" />
                      Publicar anuncio
                    </>
                  )}
                </button>

                <p className="mt-3 rounded-xl bg-background-100 px-3 py-2.5 text-[11px] leading-relaxed text-foreground-500">
                  Publicar es totalmente gratis. Tu anuncio queda activo de inmediato y podés eliminarlo desde
                  Mi cuenta cuando quieras.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}