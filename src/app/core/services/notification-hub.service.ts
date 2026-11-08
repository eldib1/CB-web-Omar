import { inject, Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { AuthStateService } from './auth-state.service';
import { Notification, NotificationType } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationHubService {
  private readonly authState = inject(AuthStateService);
  private hubConnection: signalR.HubConnection | null = null;

  readonly notifications = signal<Notification[]>([]);
  readonly unreadCount = signal<number>(0);

  startConnection(): void {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) return;

    const token = this.authState.getAccessToken();
    if (!token) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.hubBaseUrl}/notificationhub`, {
        accessTokenFactory: () => this.authState.getAccessToken() ?? '',
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      this.notifications.update((prev) => [notification, ...prev]);
      this.unreadCount.update((c) => c + 1);
    });

    this.hubConnection.start().catch((err) => console.error('Notification hub error:', err));
  }

  stopConnection(): void {
    this.hubConnection?.stop();
  }

  markAllRead(): void {
    this.notifications.update((ns) => ns.map((n) => ({ ...n, isRead: true })));
    this.unreadCount.set(0);
  }

  markRead(id: number): void {
    this.notifications.update((ns) =>
      ns.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    this.unreadCount.update((c) => Math.max(0, c - 1));
  }
}
