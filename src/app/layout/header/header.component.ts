import { Component, inject, OnInit, OnDestroy, computed, effect } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationHubService } from '../../core/services/notification-hub.service';
import { ChatHubService } from '../../core/services/chat-hub.service';
import { UserRole, NotificationType } from '../../core/models/enums';
import { NotificationItemComponent } from '../notification-item/notification-item.component';
import { UpperCasePipe, DatePipe } from '@angular/common';

@Component({
  selector: 'cb-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NotificationItemComponent, UpperCasePipe, DatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly authState = inject(AuthStateService);
  private readonly authService = inject(AuthService);
  readonly notifHub = inject(NotificationHubService);
  private readonly chatHub = inject(ChatHubService);

  readonly UserRole = UserRole;
  readonly isAuthenticated = this.authState.isAuthenticated;
  readonly isAdmin = this.authState.isAdmin;
  readonly isSuperAdmin = this.authState.isSuperAdmin;
  readonly currentUser = this.authState.currentUser;
  readonly notifications = this.notifHub.notifications;
  readonly unreadCount = this.notifHub.unreadCount;

  ngOnInit(): void {
    if (this.authState.isAuthenticated()) {
      this.notifHub.startConnection();
      this.chatHub.startConnection();
    }
  }

  ngOnDestroy(): void {
    this.notifHub.stopConnection();
    this.chatHub.stopConnection();
  }

  logout(): void {
    this.notifHub.stopConnection();
    this.chatHub.stopConnection();
    this.authService.logout();
  }

  markAllNotificationsRead(): void {
    this.notifHub.markAllRead();
  }
}
