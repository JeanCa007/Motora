export interface Vehicle {
  id: string;
  seller_id: string | null;
  seller_name: string;
  seller_phone: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  mileage: number;
  transmission: string;
  fuel_type: string;
  body_type: string;
  condition: string;
  province: string;
  city: string;
  description: string;
  images: string[];
  features: string[];
  status: string;
  views: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  province: string;
  role: string;
  created_at: string;
}

export interface VehicleFilters {
  brand: string;
  bodyType: string;
  province: string;
  maxPrice: string;
  query: string;
}

export interface CatalogQuery extends VehicleFilters {
  transmission: string;
  fuel: string;
  condition: string;
  minYear: string;
  sort: string;
}