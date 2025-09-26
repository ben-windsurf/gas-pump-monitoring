export interface DBGasStation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  available_pumps: number;
  total_pumps: number;
  regular_price: number;
  premium_price: number;
  diesel_price: number;
  amenities: string;
  status: 'open' | 'busy' | 'closed';
  is_open_24_hours: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBUserTransaction {
  id: string;
  station_id: string;
  date: string;
  fuel_type: string;
  gallons: number;
  cost: number;
  created_at: string;
}

export interface DBUserData {
  id: string;
  name: string;
  email: string;
  member_since: string;
  total_fill_ups: number;
  total_gallons: number;
  total_cost: number;
  avg_price_per_gallon: number;
  favorite_station: string;
  updated_at: string;
}

export interface GasStation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  availablePumps: number;
  totalPumps: number;
  regularPrice: number;
  premiumPrice: number;
  dieselPrice: number;
  amenities: string[];
  status: 'open' | 'busy' | 'closed';
  isOpen24Hours: boolean;
}

export interface UserTransaction {
  id: string;
  station: string;
  date: string;
  fuelType: string;
  gallons: number;
  cost: number;
}

export interface UserData {
  name: string;
  email: string;
  memberSince: string;
  totalFillUps: number;
  totalGallons: number;
  totalCost: number;
  avgPricePerGallon: number;
  favoriteStation: string;
}
