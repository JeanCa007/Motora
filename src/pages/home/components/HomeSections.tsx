import { Link } from 'react-router-dom';

const SELL_BENEFITS = [
  'Publicación gratuita en menos de 5 minutos',
  'Tus fotos y datos visibles para miles de compradores',
  'Recibí consultas directas a tu correo y teléfono',
];

const STEPS = [
  {
    icon: 'ri-user-add-line',
    title: 'Creá tu cuenta',
    description: 'Registrate gratis con tu correo. Solo necesitás un minuto para empezar a publicar.',
  },
  {
    icon: 'ri-image-add-line',
    title: 'Subí tu vehículo',
    description: 'Agregá marca, año, kilometraje y fotos reales. Mientras más detalle, más consultas recibís.',
  },
  {
    icon: 'ri-whatsapp-line',
    title: 'Coordiná la venta',
    description: 'Los interesados te escriben directo. Vos decidís con quién y cuándo cerrar el trato.',
  },
];

const TRUST_ITEMS = [
  {
    icon: 'ri-shield-check-line',
    title: 'Anuncios con datos claros',
    description: 'Año, kilometraje, precio y ubicación visibles desde el primer vistazo, sin sorpresas.',
  },
  {
    icon: 'ri-flashlight-line',
    title: 'Búsqueda en segundos',
    description: 'Filtros combinables por marca, tipo, provincia y precio para llegar rápido a lo que buscás.',
  },
  {
    icon: 'ri-chat-3-line',
    title: 'Contacto directo',
    description: 'Hablás con el dueño del carro, sin comisiones ni intermediarios de por medio.',
  },
  {
    icon: 'ri-map-pin-2-line',
    title: 'Cobertura nacional',
    description: 'Vehículos en las siete provincias, desde San José hasta Guanacaste y Limón.',
  },
];

export function SellBanner() {
  return (
    <section className="w-full px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid grid-cols-1 overflow-hidden rounded-3xl bg-foreground-950 lg:grid-cols-2">
          <div className="flex flex-col justify-center p-8 md:p-12 lg:p-14">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-500/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-primary-400">
              <i className="ri-money-dollar-circle-line" aria-hidden="true" />
              Vendé sin comisiones
            </span>
            <h2 className="mt-5 text-balance font-heading text-3xl font-extrabold leading-tight text-background-50 md:text-4xl">
              Publicá tu auto gratis y vendelo más rápido.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-background-300 md:text-base">
              En Motora no cobramos por publicar. Tu anuncio queda visible para compradores de todo el país
              y las consultas llegan directo a tu teléfono.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {SELL_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5 text-sm text-background-200">
                  <i className="ri-checkbox-circle-fill mt-0.5 text-primary-400" aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/publicar" className="btn-primary px-6">
                Publicar mi vehículo
                <i className="ri-arrow-right-line" aria-hidden="true" />
              </Link>
              <Link
                to="/registro"
                className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-background-50/25 px-6 py-3 text-sm font-bold text-background-50 transition hover:bg-background-50/10"
              >
                Crear cuenta
              </Link>
            </div>
          </div>

          <div className="relative min-h-[280px] lg:min-h-full">
            <img
              src="https://readdy.ai/api/search-image?query=warm%20lifestyle%20photo%20of%20a%20person%20handing%20car%20keys%20to%20a%20happy%20buyer%20next%20to%20a%20clean%20silver%20SUV%20in%20a%20sunny%20driveway%20with%20soft%20natural%20light%20and%20neutral%20tones&width=1200&height=1000&seq=sell-banner-02&orientation=portrait"
              alt="Comprador recibiendo las llaves de su nuevo vehículo"
              title="Vendé tu auto en Costa Rica · Motora"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground-950 via-foreground-950/20 to-transparent lg:via-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="w-full bg-background-200/60 px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="max-w-2xl">
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-600">
            <span className="h-px w-6 bg-primary-500" />
            Cómo funciona
          </p>
          <h2 className="text-balance font-heading text-2xl font-extrabold text-foreground-950 md:text-4xl">
            Vender tu carro nunca fue tan simple
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {STEPS.map((step, index) => (
            <div key={step.title} className="card-surface relative flex flex-col gap-3 p-6 md:p-7">
              <span className="absolute right-5 top-5 font-heading text-4xl font-extrabold text-background-200">
                0{index + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                <i className={`${step.icon} text-xl`} aria-hidden="true" />
              </span>
              <h3 className="font-heading text-lg font-bold text-foreground-950">{step.title}</h3>
              <p className="text-sm leading-relaxed text-foreground-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="w-full px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.4fr] lg:items-center">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-600">
              <span className="h-px w-6 bg-accent-500" />
              Por qué Motora
            </p>
            <h2 className="text-balance font-heading text-2xl font-extrabold text-foreground-950 md:text-4xl">
              Compra y venta de autos con información real
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground-600 md:text-base">
              Reunimos en un solo lugar los vehículos disponibles del país, con fichas completas y
              vendedores identificados para que decidas con confianza.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="rounded-2xl border border-background-200 bg-background-50 p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100 text-accent-700">
                  <i className={`${item.icon} text-lg`} aria-hidden="true" />
                </span>
                <h3 className="mt-3 font-heading text-base font-bold text-foreground-950">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}