import { OfferStatus } from './enums';

export interface CreateOfferRequest {
  listingId: number;
  offerPrice: number;
  message?: string;
}

export interface PriceOfferSummary {
  id: number;
  listingId: number;
  buyerId: number;
  offerPrice: number;
  originalPrice: number;
  status: OfferStatus;
  message?: string;
  createdDate: string;
}

export interface PriceOfferDetail {
  id: number;
  listingId: number;
  buyerId: number;
  sellerId: number;
  offerPrice: number;
  originalPrice: number;
  status: OfferStatus;
  message?: string;
  buyerName: string;
  listing: { id: number; title: string };
  createdDate: string;
  rejectionReason?: string;
}

export interface RejectOfferRequest {
  rejectionReason: string;
}
