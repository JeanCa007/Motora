import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRANDS, PROVINCES, PRICE_RANGES } from '@/lib/constants';

const BODY_OPTIONS = [
  { value: 'suv', label: 'SUV' },
  { value: 'sedan', label: 'Sedán' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'microbus', label: 'Microbús' },
];

interface SearchFormProps {
  tone?: 'light' | 'dark';
}

export default function SearchForm({ tone = 'light' }: SearchFormProps) {
  const navigate = useNavigate();
  const [brand, setBrand] = useState('');
  const [body, setBody] = useState('');
  const [province, setProvince] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const selectClass =
    tone === 'dark'
      ? 'w-full cursor-pointer appearance-none rounded-xl border border-background-50/20 bg-background-50/5 px-3.5 py-3 pr-9 text-sm font-medium text-background-50 focus:border-primary-400 focus:outline-none'
      : 'w-full cursor-pointer appearance-none rounded-xl border border-background-300 bg-background-50 px-3.5 py-3 pr-9 text-sm font-medium text-foreground-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20';

  const labelClass =
    tone === 'dark'
      ? 'mb-2 block text-[11px] font-bold uppercase tracking-wider text-background-300'
      : 'mb-2 block text-[11px] font-bold uppercase tracking-wider text-foreground-500';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (brand) params.set('brand', brand);
    if (body) params.set('body', body);
    if (province) params.set('province', province);
    if (maxPrice) params.set('maxPrice', maxPrice);
    const query = params.toString();
    navigate(query ? `/autos?${query}` : '/autos');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="relative w-full lg:flex-1">
          <label className={labelClass} htmlFor="search-brand">
            Marca
          </label>
          <select id="search-brand" value={brand} onChange={(e) => setBrand(e.target.value)} className={selectClass}>
            <option value="">Todas las marcas</option>
            {BRANDS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <i
            className={`ri-arrow-down-s-line pointer-events-none absolute bottom-3.5 right-3 text-base ${
              tone === 'dark' ? 'text-background-300' : 'text-foreground-400'
            }`}
            aria-hidden="true"
          />
        </div>

        <div className="relative w-full lg:flex-1">
          <label className={labelClass} htmlFor="search-body">
            Tipo de carro
          </label>
          <select id="search-body" value={body} onChange={(e) => setBody(e.target.value)} className={selectClass}>
            <option value="">Todos los tipos</option>
            {BODY_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <i
            className={`ri-arrow-down-s-line pointer-events-none absolute bottom-3.5 right-3 text-base ${
              tone === 'dark' ? 'text-background-300' : 'text-foreground-400'
            }`}
            aria-hidden="true"
          />
        </div>

        <div className="relative w-full lg:flex-1">
          <label className={labelClass} htmlFor="search-province">
            Provincia
          </label>
          <select
            id="search-province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className={selectClass}
          >
            <option value="">Todo el país</option>
            {PROVINCES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <i
            className={`ri-arrow-down-s-line pointer-events-none absolute bottom-3.5 right-3 text-base ${
              tone === 'dark' ? 'text-background-300' : 'text-foreground-400'
            }`}
            aria-hidden="true"
          />
        </div>

        <div className="relative w-full lg:flex-1">
          <label className={labelClass} htmlFor="search-price">
            Precio máximo
          </label>
          <select
            id="search-price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className={selectClass}
          >
            <option value="">Sin límite</option>
            {PRICE_RANGES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <i
            className={`ri-arrow-down-s-line pointer-events-none absolute bottom-3.5 right-3 text-base ${
              tone === 'dark' ? 'text-background-300' : 'text-foreground-400'
            }`}
            aria-hidden="true"
          />
        </div>

        <button type="submit" className="btn-primary w-full py-3.5 lg:w-auto lg:px-7">
          <i className="ri-search-line text-base" aria-hidden="true" />
          Buscar autos
        </button>
      </div>
    </form>
  );
}