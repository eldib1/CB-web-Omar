import { ListingStatus } from './enums';

export interface CarListingSummary {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  images: string[];
  description: string;
  status: ListingStatus;
}

export interface SellerInfo {
  id: number;
  name: string;
  email: string;
  rating: number;
  totalListings: number;
}

export interface CarListingDetail {
  id: number;
  title: string;
  description: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  vin: string;
  transmission: string;
  fuelType: string;
  bodyType: string;
  color: string;
  interiorColor: string;
  images: string[];
  videos: string[];
  documents: string[];
  seller: SellerInfo;
  status: ListingStatus;
  createdDate: string;
  currentOffers?: number;
}

export interface CreateListingRequest {
  title: string;
  description: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  vin?: string;
  transmission: string;
  fuelType: string;
  bodyType: string;
  color: string;
  interiorColor?: string;
  listingCode?: string;
}

export interface ListingSearchParams {
  make?: string;
  model?: string;
  year?: number;
  minPrice?: number;
  maxPrice?: number;
  mileage?: number;
  location?: string;
  status?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface RejectListingRequest {
  reason: string;
}
