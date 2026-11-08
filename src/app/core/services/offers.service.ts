import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateOfferRequest, PriceOfferDetail, RejectOfferRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class OffersService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/priceoffers`;

  create(req: CreateOfferRequest): Observable<any> {
    return this.http.post<any>(`${this.base}/create`, req);
  }

  getById(id: number): Observable<PriceOfferDetail> {
    return this.http.get<PriceOfferDetail>(`${this.base}/${id}`);
  }

  accept(id: number): Observable<any> {
    return this.http.post<any>(`${this.base}/${id}/accept`, {});
  }

  reject(id: number, req: RejectOfferRequest): Observable<any> {
    return this.http.post<any>(`${this.base}/${id}/reject`, req);
  }

  withdraw(id: number): Observable<any> {
    return this.http.post<any>(`${this.base}/${id}/withdraw`, {});
  }
}
