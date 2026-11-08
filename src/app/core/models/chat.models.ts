export interface ChatSession {
  id: number;
  otherUserId?: number;
  otherUserName?: string;
  otherUserAvatar?: string;
  adminId?: number;
  adminName?: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
  isAdmin: boolean;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  message: string;
  isRead: boolean;
  createdDate: string;
}

export interface ChatSessionDetail {
  id: number;
  participant1Id: number;
  participant1Name: string;
  participant1Avatar?: string;
  participant2Id: number;
  participant2Name: string;
  participant2Avatar?: string;
  createdDate: string;
  lastActivityDate: string;
  unreadCount: number;
  relatedOfferId?: number;
  messages: ChatMessage[];
}

export interface SendMessageRequest {
  chatSessionId: number;
  receiverId: number;
  message: string;
}

export interface CreateAdminChatRequest {
  userId: number;
  message: string;
}
