import {
  BODY_TYPES,
  BRANDS,
  CONDITIONS,
  FUEL_TYPES,
  PRICE_RANGES,
  PROVINCES,
  TRANSMISSIONS,
} from '@/lib/constants';
import type { CatalogQuery } from '@/types';

interface FiltersProps {
  values: CatalogQuery;
  onChange: (key: keyof CatalogQuery, value: string) => void;
  onReset: () => void;
}

const YEARS = Array.from({ length: 16 }, (_, index) => String(new Date().getFullYear() - index));

export default function Filters({ values, onChange, onReset }: FiltersProps) {
  const activeCount = [
    values.brand,
    values.bodyType,
    values.province,
    values.maxPrice,
    values.minYear,
    values.transmission,
    values.fuel,
    values.condition,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-bold text-foreground-950">Filtros</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-xs font-bold text-primary-700 transition hover:text-primary-800"
          >
            <i className="ri-close-circle-line" aria-hidden="true" />
            Limpiar ({activeCount})
          </button>
        )}
      </div>

      <div>
        <label className="label-base" htmlFor="filter-query">
          Palabra clave
        </label>
        <div className="relative">
          <i
            className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400"
            aria-hidden="true"
          />
          <input
            id="filter-query"
            type="text"
            value={values.query}
            onChange={(event) => onChange('query', event.target.value)}
            placeholder="Ej. RAV4, Hilux, Tucson"
            className="input-base pl-9"
          />
        </div>
      </div>

      <div>
        <label className="label-base" htmlFor="filter-brand">
          Marca
        </label>
        <select
          id="filter-brand"
          value={values.brand}
          onChange={(event) => onChange('brand', event.target.value)}
          className="input-base cursor-pointer"
        >
          <option value="">Todas las marcas</option>
          {BRANDS.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-base" htmlFor="filter-body">
          Tipo de carro
        </label>
        <select
          id="filter-body"
          value={values.bodyType}
          onChange={(event) => onChange('bodyType', event.target.value)}
          className="input-base cursor-pointer"
        >
          <option value="">Todos los tipos</option>
          {BODY_TYPES.map((body) => (
            <option key={body} value={body}>
              {body}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-base" htmlFor="filter-province">
          Provincia
        </label>
        <select
          id="filter-province"
          value={values.province}
          onChange={(event) => onChange('province', event.target.value)}
          className="input-base cursor-pointer"
        >
          <option value="">Todo el país</option>
          {PROVINCES.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-base" htmlFor="filter-price">
          Precio máximo
        </label>
        <select
          id="filter-price"
          value={values.maxPrice}
          onChange={(event) => onChange('maxPrice', event.target.value)}
          className="input-base cursor-pointer"
        >
          <option value="">Sin límite</option>
          {PRICE_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-base" htmlFor="filter-year">
          Año desde
        </label>
        <select
          id="filter-year"
          value={values.minYear}
          onChange={(event) => onChange('minYear', event.target.value)}
          className="input-base cursor-pointer"
        >
          <option value="">Cualquier año</option>
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year} o más nuevo
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-base" htmlFor="filter-transmission">
          Transmisión
        </label>
        <select
          id="filter-transmission"
          value={values.transmission}
          onChange={(event) => onChange('transmission', event.target.value)}
          className="input-base cursor-pointer"
        >
          <option value="">Cualquiera</option>
          {TRANSMISSIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-base" htmlFor="filter-fuel">
          Combustible
        </label>
        <select
          id="filter-fuel"
          value={values.fuel}
          onChange={(event) => onChange('fuel', event.target.value)}
          className="input-base cursor-pointer"
        >
          <option value="">Cualquiera</option>
          {FUEL_TYPES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className="label-base">Condición</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange('condition', '')}
            className={`cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
              values.condition === ''
                ? 'border-foreground-950 bg-foreground-950 text-background-50'
                : 'border-background-300 bg-background-50 text-foreground-600 hover:border-foreground-400'
            }`}
          >
            Todos
          </button>
          {CONDITIONS.map((condition) => (
            <button
              key={condition}
              type="button"
              onClick={() => onChange('condition', condition)}
              className={`cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                values.condition === condition
                  ? 'border-foreground-950 bg-foreground-950 text-background-50'
                  : 'border-background-300 bg-background-50 text-foreground-600 hover:border-foreground-400'
              }`}
            >
              {condition}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}