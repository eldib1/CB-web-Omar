import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  PaginatedResponse,
  CarListingSummary,
  CarListingDetail,
  CreateListingRequest,
  ListingSearchParams,
  RejectListingRequest,
} from '../models';

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
    return this.http.get<ApiResponse<PaginatedResponse<CarListingSummary>>>(`${this.base}/search`, {
      params: httpParams,
    });
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
