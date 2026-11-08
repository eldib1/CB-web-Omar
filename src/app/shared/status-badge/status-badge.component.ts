import { Component, input } from '@angular/core';
import { ListingStatus, UserStatus, OfferStatus } from '../../core/models/enums';

type BadgeType = ListingStatus | UserStatus | OfferStatus | string;

@Component({
  selector: 'cb-status-badge',
  standalone: true,
  template: `<span class="badge" [class]="badgeClass()">{{ status() }}</span>`,
})
export class StatusBadgeComponent {
  readonly status = input.required<BadgeType>();

  badgeClass(): string {
    const map: Record<string, string> = {
      // Listing statuses
      Active: 'bg-success',
      Draft: 'bg-secondary',
      PendingApproval: 'bg-warning text-dark',
      Rejected: 'bg-danger',
      Sold: 'bg-primary',
      Inactive: 'bg-secondary',
      // User statuses
      Verified: 'bg-success',
      PendingEmailVerification: 'bg-info text-dark',
      PendingVerification: 'bg-warning text-dark',
      Suspended: 'bg-danger',
      Banned: 'bg-dark',
      // Offer statuses
      Pending: 'bg-warning text-dark',
      Accepted: 'bg-success',
      Withdrawn: 'bg-secondary',
      // Report
      UnderReview: 'bg-info text-dark',
      Resolved: 'bg-success',
      Dismissed: 'bg-secondary',
      Unused: 'bg-success',
      Used: 'bg-secondary',
    };
    return map[this.status() as string] ?? 'bg-secondary';
  }
}
