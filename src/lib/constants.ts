export const BRANDS = [
  'Toyota',
  'Hyundai',
  'Nissan',
  'Honda',
  'Kia',
  'Mazda',
  'Suzuki',
  'Mitsubishi',
  'Ford',
  'Chevrolet',
  'BMW',
  'Mercedes-Benz',
  'Volkswagen',
  'Isuzu',
  'Jeep',
];

export const PROVINCES = [
  'San José',
  'Alajuela',
  'Cartago',
  'Heredia',
  'Guanacaste',
  'Puntarenas',
  'Limón',
];

export const BODY_TYPES = ['SUV', 'Sedán', 'Pickup', 'Hatchback', 'Microbús', 'Deportivo'];

export const TRANSMISSIONS = ['Automática', 'Manual', 'CVT'];

export const FUEL_TYPES = ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico'];

export const CONDITIONS = ['Usado', 'Nuevo'];

export const FEATURE_HIGHLIGHTS = [
  { key: 'Aire acondicionado', icon: 'ri-snowflake-line' },
  { key: 'Cámara de reversa', icon: 'ri-camera-lens-line' },
  { key: 'Pantalla táctil', icon: 'ri-smartphone-line' },
  { key: 'Cuero', icon: 'ri-checkbox-circle-line' },
  { key: 'Techo panorámico', icon: 'ri-sun-line' },
  { key: '4x4', icon: 'ri-roadster-line' },
  { key: 'Apple CarPlay', icon: 'ri-apple-fill' },
  { key: 'Control de crucero', icon: 'ri-speed-up-line' },
  { key: 'Sensores de parqueo', icon: 'ri-radar-line' },
  { key: 'Financiamiento', icon: 'ri-bank-card-line' },
];

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
  { value: 'year-desc', label: 'Año más nuevo' },
  { value: 'mileage-asc', label: 'Menor kilometraje' },
];

export const PRICE_RANGES = [
  { label: 'Hasta $10.000', value: '10000' },
  { label: 'Hasta $18.000', value: '18000' },
  { label: 'Hasta $25.000', value: '25000' },
  { label: 'Hasta $35.000', value: '35000' },
  { label: 'Hasta $50.000', value: '50000' },
];

export const BODY_TYPE_CARDS = [
  {
    key: 'SUV',
    label: 'SUVs',
    description: 'Espacio y altura para toda la familia',
    image:
      'https://readdy.ai/api/search-image?query=professional%20automotive%20photography%20of%20a%20modern%20white%20SUV%20parked%20on%20a%20mountain%20road%20at%20golden%20hour%20with%20soft%20warm%20light%20and%20clean%20neutral%20background&width=900&height=700&seq=body-suv-01&orientation=landscape',
  },
  {
    key: 'Sedán',
    label: 'Sedanes',
    description: 'Comodidad y eficiencia en ciudad',
    image:
      'https://readdy.ai/api/search-image?query=professional%20automotive%20photography%20of%20a%20dark%20gray%20sedan%20on%20a%20city%20avenue%20with%20soft%20evening%20light%20and%20minimal%20clean%20background&width=900&height=700&seq=body-sedan-02&orientation=landscape',
  },
  {
    key: 'Pickup',
    label: 'Pickups',
    description: 'Fuerza para trabajo y aventura',
    image:
      'https://readdy.ai/api/search-image?query=professional%20automotive%20photography%20of%20a%20rugged%20pickup%20truck%20on%20a%20dirt%20road%20with%20dust%20and%20warm%20sunset%20light%20minimal%20neutral%20background&width=900&height=700&seq=body-pickup-03&orientation=landscape',
  },
  {
    key: 'Hatchback',
    label: 'Hatchbacks',
    description: 'Compactos y económicos',
    image:
      'https://readdy.ai/api/search-image?query=professional%20automotive%20photography%20of%20a%20compact%20hatchback%20car%20in%20a%20bright%20urban%20setting%20with%20soft%20daylight%20and%20clean%20neutral%20background&width=900&height=700&seq=body-hatch-04&orientation=landscape',
  },
];