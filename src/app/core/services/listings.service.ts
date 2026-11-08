import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ListingStatus } from '../models/enums';
import {
  ApiResponse,
  PaginatedResponse,
  CarListingSummary,
  CarListingDetail,
  CreateListingRequest,
  ListingSearchParams,
  RejectListingRequest,
} from '../models';

const STATUS_BY_CODE: ListingStatus[] = [
  ListingStatus.Draft,
  ListingStatus.PendingApproval,
  ListingStatus.Active,
  ListingStatus.Inactive,
  ListingStatus.Sold,
  ListingStatus.Rejected,
];

/** Adapts the API's CarListingDto to the frontend's CarListingSummary. */
function toSummary(d: any): CarListingSummary {
  return {
    id: d.id,
    title: d.listingTitle,
    make: d.make,
    model: d.model,
    year: d.year,
    engineSize: d.engineSize ?? '',
    price: d.startingPrice,
    mileage: d.mileage,
    location: d.sellerLocation ?? '',
    images: d.imageUrls ?? [],
    description: d.listingDescription ?? '',
    status: STATUS_BY_CODE[d.status] ?? ListingStatus.Active,
    isFeatured: !!d.isFeatured,
  };
}

@Injectable({ providedIn: 'root' })
export class ListingsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/carlistings`;

  search(params: ListingSearchParams): Observable<ApiResponse<PaginatedResponse<CarListingSummary>>> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        httpParams = httpParams.set(key, String(val));
      }
    });
    return this.http.get<any>(`${this.base}/search`, { params: httpParams }).pipe(
      map((res) => ({
        success: true,
        message: '',
        data: {
          items: (res.items ?? []).map(toSummary),
          totalCount: res.totalItems ?? 0,
          pageNumber: res.pageNumber ?? 1,
          pageSize: res.pageSize ?? params.pageSize ?? 12,
        },
      })),
    );
  }

  /** Returns the currently featured listing, or null if none is set. */
  getFeatured(): Observable<CarListingSummary | null> {
    return this.http.get<any>(`${this.base}/featured`).pipe(map(toSummary));
  }

  /** Marks a listing as the featured one; unfeatures any other (admin only). */
  feature(id: number): Observable<any> {
    return this.http.post<any>(`${this.base}/${id}/feature`, {});
  }

  /** Removes the featured flag from a listing (admin only). */
  unfeature(id: number): Observable<any> {
    return this.http.post<any>(`${this.base}/${id}/unfeature`, {});
  }

  getById(id: number): Observable<CarListingDetail> {
    return this.http.get<CarListingDetail>(`${this.base}/${id}`);
  }

  create(req: CreateListingRequest): Observable<any> {
    return this.http.post<any>(`${this.base}/create`, req);
  }

  uploadMedia(listingId: number, images: File[], documents: File[], videos?: File[]): Observable<any> {
    const formData = new FormData();
    images.forEach((f) => formData.append('images', f));
    documents.forEach((f) => formData.append('documents', f));
    videos?.forEach((f) => formData.append('videos', f));
    return this.http.post<any>(`${this.base}/${listingId}/upload-media`, formData);
  }

  submitForApproval(id: number): Observable<any> {
    return this.http.post<any>(`${this.base}/${id}/submit-for-approval`, {});
  }

  approve(id: number): Observable<any> {
    return this.http.post<any>(`${this.base}/${id}/approve`, {});
  }

  reject(id: number, req: RejectListingRequest): Observable<any> {
    return this.http.post<any>(`${this.base}/${id}/reject`, req);
  }

  deactivate(id: number): Observable<any> {
    return this.http.post<any>(`${this.base}/${id}/deactivate`, {});
  }

  markAsSold(id: number): Observable<any> {
    return this.http.post<any>(`${this.base}/${id}/mark-as-sold`, {});
  }

  uploadSaleProof(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.base}/${id}/upload-sale-proof`, formData);
  }
}
