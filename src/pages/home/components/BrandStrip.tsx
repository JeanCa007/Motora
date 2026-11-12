import { Link } from 'react-router-dom';
import { BRANDS, BODY_TYPE_CARDS } from '@/lib/constants';

export function BrandStrip() {
  return (
    <section className="w-full border-y border-background-200 bg-background-50 px-4 py-8 md:px-8">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <p className="whitespace-nowrap font-heading text-sm font-bold uppercase tracking-wide text-foreground-500">
            Marcas populares
          </p>
          <div className="hide-scrollbar flex items-center gap-2.5 overflow-x-auto pb-1">
            {BRANDS.slice(0, 11).map((brand) => (
              <Link
                key={brand}
                to={`/autos?brand=${encodeURIComponent(brand)}`}
                className="cursor-pointer whitespace-nowrap rounded-full border border-background-300 bg-background-100 px-4 py-2 text-sm font-semibold text-foreground-700 transition hover:border-foreground-950 hover:bg-foreground-950 hover:text-background-50"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function BodyTypeGrid() {
  return (
    <section className="w-full px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="max-w-2xl">
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-600">
            <span className="h-px w-6 bg-primary-500" />
            Explorá por tipo
          </p>
          <h2 className="text-balance font-heading text-2xl font-extrabold text-foreground-950 md:text-4xl">
            ¿Qué tipo de carro andás buscando?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground-600 md:text-base">
            Desde SUVs familiares hasta pickups de trabajo. Elegí una categoría y compará opciones reales
            disponibles en el país.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BODY_TYPE_CARDS.map((card) => (
            <Link
              key={card.key}
              to={`/autos?body=${encodeURIComponent(card.key)}`}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-background-200 bg-foreground-950"
            >
              <div className="relative h-[240px] w-full overflow-hidden">
                <img
                  src={card.image}
                  alt={`${card.label} en venta en Costa Rica`}
                  title={`Vehículos tipo ${card.label} · Motora`}
                  className="h-full w-full object-cover object-center opacity-80 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground-950 via-foreground-950/40 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-heading text-lg font-bold text-background-50">{card.label}</h3>
                <p className="mt-1 text-xs leading-snug text-background-300">{card.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary-400">
                  Ver disponibles
                  <i className="ri-arrow-right-line" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}