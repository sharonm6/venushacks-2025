export interface Profile {
  name: string;
}

export interface Conversation {
  id: string;
  useridA: string;
  useridB: string;
  agreedA: boolean;
  agreedB: boolean;
}

export interface Chat {
  id: number;
  userId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}
