import { inject, Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { AuthStateService } from './auth-state.service';
import { ChatMessage } from '../models';

@Injectable({ providedIn: 'root' })
export class ChatHubService {
  private readonly authState = inject(AuthStateService);
  private hubConnection: signalR.HubConnection | null = null;

  readonly newMessages = signal<(ChatMessage & { chatSessionId: number })[]>([]);
  readonly typingUsers = signal<{ chatSessionId: number; userName: string }[]>([]);

  startConnection(): void {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) return;

    const token = this.authState.getAccessToken();
    if (!token) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.hubBaseUrl}/chathub`, {
        accessTokenFactory: () => this.authState.getAccessToken() ?? '',
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessage', (message: ChatMessage & { chatSessionId: number }) => {
      this.newMessages.update((prev) => [...prev, message]);
    });

    this.hubConnection.on(
      'UserTyping',
      (data: { chatSessionId: number; userName: string }) => {
        this.typingUsers.update((prev) => {
          const filtered = prev.filter((t) => t.chatSessionId !== data.chatSessionId);
          return [...filtered, data];
        });
        setTimeout(() => {
          this.typingUsers.update((prev) =>
            prev.filter((t) => t.chatSessionId !== data.chatSessionId),
          );
        }, 2000);
      },
    );

    this.hubConnection.start().catch((err) => console.error('Chat hub error:', err));
  }

  stopConnection(): void {
    this.hubConnection?.stop();
  }

  joinChatSession(chatSessionId: number): void {
    this.hubConnection?.invoke('JoinChatSession', chatSessionId).catch(console.error);
  }

  leaveChatSession(chatSessionId: number): void {
    this.hubConnection?.invoke('LeaveChatSession', chatSessionId).catch(console.error);
  }

  sendTyping(chatSessionId: number): void {
    this.hubConnection?.invoke('Typing', chatSessionId).catch(console.error);
  }

  clearNewMessages(): void {
    this.newMessages.set([]);
  }
}
