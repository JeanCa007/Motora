import { Link } from 'react-router-dom';
import SearchForm from '@/components/feature/SearchForm';

const STATS = [
  { value: '2.400+', label: 'Vehículos publicados' },
  { value: '15', label: 'Marcas disponibles' },
  { value: '7', label: 'Provincias cubiertas' },
];

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-foreground-950">
      <img
        src="https://readdy.ai/api/search-image?query=cinematic%20wide%20shot%20of%20a%20luxury%20dark%20gray%20SUV%20parked%20on%20a%20wet%20mountain%20road%20at%20dusk%20with%20dramatic%20warm%20rim%20light%20and%20deep%20shadows%20moody%20premium%20automotive%20photography&width=1920&height=1080&seq=hero-motora-01&orientation=landscape"
        alt="SUV premium en una carretera de montaña al atardecer"
        title="Compra autos en Costa Rica · Motora"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground-950 via-foreground-950/90 to-foreground-950/40" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-foreground-950 to-transparent" />

      <div className="relative flex min-h-[560px] w-full flex-col justify-center px-4 py-14 md:min-h-[660px] md:px-8 md:py-16">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="max-w-2xl animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-background-50/20 bg-background-50/10 px-3.5 py-1.5 text-xs font-semibold text-background-100 backdrop-blur">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary-400" />
              El marketplace de autos #1 de Costa Rica
            </span>

            <h1 className="mt-5 text-balance font-heading text-4xl font-extrabold leading-[1.05] text-background-50 md:text-6xl">
              Tu próximo carro, <span className="text-primary-400">sin vueltas</span> y al mejor precio.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-background-200 md:text-lg">
              Miles de vehículos verificados en todo el país. Compará precios, revisá el historial y
              contactá al vendedor directo, sin comisiones ocultas.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/autos" className="btn-primary px-6">
                Explorar vehículos
                <i className="ri-arrow-right-line" aria-hidden="true" />
              </Link>
              <Link
                to="/publicar"
                className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-background-50/25 px-6 py-3 text-sm font-bold text-background-50 transition hover:bg-background-50/10"
              >
                <i className="ri-add-line" aria-hidden="true" />
                Vender mi auto
              </Link>
            </div>
          </div>

          <div className="mt-10 w-full rounded-3xl border border-background-50/10 bg-background-50 p-4 shadow-lift md:mt-12 md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <i className="ri-filter-3-line text-primary-600" aria-hidden="true" />
              <p className="font-heading text-sm font-bold text-foreground-900">Encontrá tu vehículo ideal</p>
            </div>
            <SearchForm />
          </div>

          <dl className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-2">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-heading text-2xl font-extrabold text-background-50">{stat.value}</dd>
                <span className="text-xs font-medium text-background-300">{stat.label}</span>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}