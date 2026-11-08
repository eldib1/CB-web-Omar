import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Notification } from '../../core/models/notification.models';
import { NotificationType } from '../../core/models/enums';

@Component({
  selector: 'cb-notification-item',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="dropdown-item d-flex gap-2 py-2 px-3 border-bottom notification-item" [class.unread]="!notification().isRead">
      <div class="notification-icon rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" [class]="iconClass()">
        <i [class]="'bi ' + iconName()"></i>
      </div>
      <div class="flex-grow-1 overflow-hidden">
        <div class="small fw-semibold text-truncate">{{ notification().title }}</div>
        <div class="small text-muted text-truncate">{{ notification().message }}</div>
        <div class="x-small text-muted">{{ notification().createdDate | date:'short' }}</div>
      </div>
    </div>
  `,
  styles: [`
    .notification-item.unread {
      background-color: rgba(255, 193, 7, 0.07);
    }
    .notification-icon {
      width: 32px;
      height: 32px;
      font-size: 0.8rem;
    }
    .x-small { font-size: 0.7rem; }
  `],
})
export class NotificationItemComponent {
  readonly notification = input.required<Notification>();

  iconName(): string {
    const map: Record<NotificationType, string> = {
      [NotificationType.UserApproved]: 'bi-person-check',
      [NotificationType.UserRejected]: 'bi-person-x',
      [NotificationType.ListingApproved]: 'bi-check-circle',
      [NotificationType.ListingRejected]: 'bi-x-circle',
      [NotificationType.NewPriceOffer]: 'bi-tag',
      [NotificationType.OfferAccepted]: 'bi-hand-thumbs-up',
      [NotificationType.OfferRejected]: 'bi-hand-thumbs-down',
      [NotificationType.NewChatMessage]: 'bi-chat',
      [NotificationType.ListingSold]: 'bi-currency-dollar',
      [NotificationType.ListingInactive]: 'bi-pause-circle',
    };
    return map[this.notification().type] ?? 'bi-bell';
  }

  iconClass(): string {
    const map: Record<NotificationType, string> = {
      [NotificationType.UserApproved]: 'bg-success bg-opacity-10 text-success',
      [NotificationType.UserRejected]: 'bg-danger bg-opacity-10 text-danger',
      [NotificationType.ListingApproved]: 'bg-success bg-opacity-10 text-success',
      [NotificationType.ListingRejected]: 'bg-danger bg-opacity-10 text-danger',
      [NotificationType.NewPriceOffer]: 'bg-warning bg-opacity-10 text-warning',
      [NotificationType.OfferAccepted]: 'bg-success bg-opacity-10 text-success',
      [NotificationType.OfferRejected]: 'bg-danger bg-opacity-10 text-danger',
      [NotificationType.NewChatMessage]: 'bg-info bg-opacity-10 text-info',
      [NotificationType.ListingSold]: 'bg-primary bg-opacity-10 text-primary',
      [NotificationType.ListingInactive]: 'bg-secondary bg-opacity-10 text-secondary',
    };
    return map[this.notification().type] ?? 'bg-secondary bg-opacity-10 text-secondary';
  }
}
