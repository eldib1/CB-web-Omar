import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatSession, ChatSessionDetail, SendMessageRequest, CreateAdminChatRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/chats`;

  getMyChats(): Observable<{ data: ChatSession[] }> {
    return this.http.get<{ data: ChatSession[] }>(`${this.base}/my-chats`);
  }

  getChatMessages(chatSessionId: number): Observable<ChatSessionDetail> {
    return this.http.get<ChatSessionDetail>(`${this.base}/${chatSessionId}/messages`);
  }

  getChatSession(chatSessionId: number): Observable<ChatSessionDetail> {
    return this.http.get<ChatSessionDetail>(`${this.base}/${chatSessionId}`);
  }

  sendMessage(req: SendMessageRequest): Observable<any> {
    return this.http.post<any>(`${this.base}/send-message`, req);
  }

  markMessageAsRead(messageId: number): Observable<any> {
    return this.http.put<any>(`${this.base}/message/${messageId}/read`, {});
  }

  createAdminChat(req: CreateAdminChatRequest): Observable<any> {
    return this.http.post<any>(`${this.base}/admin-chat`, req);
  }

  createOfferAcceptanceChat(buyerId: number, offerId: number): Observable<any> {
    return this.http.post<any>(`${this.base}/offer-acceptance-chat?buyerId=${buyerId}&offerId=${offerId}`, {});
  }

  createUserRejectionChat(userId: number, rejectionReason: string): Observable<any> {
    return this.http.post<any>(
      `${this.base}/user-rejection-chat?userId=${userId}&rejectionReason=${encodeURIComponent(rejectionReason)}`,
      {},
    );
  }

  createListingRejectionChat(userId: number, carListingId: number, rejectionReason: string): Observable<any> {
    return this.http.post<any>(
      `${this.base}/listing-rejection-chat?userId=${userId}&carListingId=${carListingId}&rejectionReason=${encodeURIComponent(rejectionReason)}`,
      {},
    );
  }
}
