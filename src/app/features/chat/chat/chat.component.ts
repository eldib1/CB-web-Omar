import { Component, inject, OnInit, OnDestroy, signal, effect, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChatService } from '../../../core/services/chat.service';
import { ChatHubService } from '../../../core/services/chat-hub.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ToastService } from '../../../core/services/toast.service';
import { ChatSession, ChatMessage, ChatSessionDetail } from '../../../core/models/chat.models';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'cb-chat',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, LoadingSpinnerComponent, TimeAgoPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  readonly authState = inject(AuthStateService);
  private readonly chatService = inject(ChatService);
  private readonly chatHub = inject(ChatHubService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  @ViewChild('messagesContainer') messagesContainerRef!: ElementRef<HTMLDivElement>;

  readonly sessions = signal<ChatSession[]>([]);
  readonly activeSessId = signal<number | null>(null);
  readonly activeSession = signal<ChatSessionDetail | null>(null);
  readonly messages = signal<ChatMessage[]>([]);
  readonly loadingSessions = signal(true);
  readonly loadingMessages = signal(false);
  readonly messageText = signal('');
  readonly sending = signal(false);
  readonly isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  private messageEffectRef: any;

  ngOnInit(): void {
    this.loadSessions();
    this.chatHub.startConnection();

    // React to incoming messages via SignalR
    this.messageEffectRef = effect(() => {
      const incoming = this.chatHub.newMessages();
      if (incoming.length > 0) {
        const lastMsg = incoming[incoming.length - 1];
        if (lastMsg.chatSessionId === this.activeSessId()) {
          this.messages.update((msgs) => [...msgs, lastMsg as ChatMessage]);
          this.scrollToBottom();
        }
        this.refreshSessionList();
      }
    });

    // Open specific chat from query param
    const chatId = this.route.snapshot.queryParamMap.get('sessionId');
    if (chatId) this.openSession(Number(chatId));
  }

  ngOnDestroy(): void {
    const id = this.activeSessId();
    if (id) this.chatHub.leaveChatSession(id);
  }

  loadSessions(): void {
    this.chatService.getMyChats().subscribe({
      next: (res) => { this.sessions.set(res.data ?? []); this.loadingSessions.set(false); },
      error: () => this.loadingSessions.set(false),
    });
  }

  openSession(id: number): void {
    const prev = this.activeSessId();
    if (prev) this.chatHub.leaveChatSession(prev);
    this.activeSessId.set(id);
    this.loadingMessages.set(true);
    this.chatHub.joinChatSession(id);
    this.chatService.getChatMessages(id).subscribe({
      next: (res) => {
        this.activeSession.set(res);
        this.messages.set(res.messages ?? []);
        this.loadingMessages.set(false);
        setTimeout(() => this.scrollToBottom(), 100);
        // Mark messages as read
        res.messages?.filter((m) => !m.isRead && m.senderId !== this.authState.currentUser()?.id)
          .forEach((m) => this.chatService.markMessageAsRead(m.id).subscribe());
      },
      error: () => this.loadingMessages.set(false),
    });
  }

  sendMessage(): void {
    const text = this.messageText().trim();
    if (!text || !this.activeSessId()) return;

    const session = this.activeSession();
    const currentUserId = this.authState.currentUser()?.id!;
    const receiverId = session?.participant1Id === currentUserId ? session?.participant2Id : session?.participant1Id;

    if (!receiverId) return;

    this.sending.set(true);
    this.chatService.sendMessage({ chatSessionId: this.activeSessId()!, receiverId, message: text }).subscribe({
      next: (msg) => {
        this.messages.update((msgs) => [...msgs, msg]);
        this.messageText.set('');
        this.sending.set(false);
        this.scrollToBottom();
        this.refreshSessionList();
      },
      error: (err) => { this.toast.error(err?.error?.message ?? 'Failed to send.'); this.sending.set(false); },
    });
  }

  onTyping(): void {
    if (this.activeSessId()) this.chatHub.sendTyping(this.activeSessId()!);
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendMessage(); }
  }

  isMyMessage(msg: ChatMessage): boolean {
    return msg.senderId === this.authState.currentUser()?.id;
  }

  getOtherParticipantName(session: ChatSession): string {
    return session.isAdmin ? (session.adminName ?? 'Admin Support') : (session.otherUserName ?? 'User');
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.messagesContainerRef?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }

  private refreshSessionList(): void {
    this.chatService.getMyChats().subscribe({ next: (r) => this.sessions.set(r.data ?? []) });
  }
}
