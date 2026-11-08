export enum UserRole {
  User = 'User',
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
}

export enum UserStatus {
  PendingEmailVerification = 'PendingEmailVerification',
  PendingVerification = 'PendingVerification',
  Verified = 'Verified',
  Rejected = 'Rejected',
  Suspended = 'Suspended',
  Banned = 'Banned',
}

export enum ListingStatus {
  Draft = 'Draft',
  PendingApproval = 'PendingApproval',
  Active = 'Active',
  Rejected = 'Rejected',
  Sold = 'Sold',
  Inactive = 'Inactive',
}

export enum OfferStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Withdrawn = 'Withdrawn',
}

export enum NotificationType {
  UserApproved = 0,
  UserRejected = 1,
  ListingApproved = 2,
  ListingRejected = 3,
  NewPriceOffer = 4,
  OfferAccepted = 5,
  OfferRejected = 6,
  NewChatMessage = 7,
  ListingSold = 8,
  ListingInactive = 9,
}

export enum ReportAction {
  Warning = 0,
  Suspension = 1,
  Ban = 2,
  NoAction = 3,
}

export enum ReportStatus {
  Pending = 0,
  UnderReview = 1,
  Resolved = 2,
  Dismissed = 3,
}

export enum ListingCodeStatus {
  Unused = 'Unused',
  Used = 'Used',
}
