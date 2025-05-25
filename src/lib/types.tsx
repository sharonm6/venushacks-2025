export interface Profile {
  id: string;
  picture: string;
  name: string;
  pronouns: string;
  year: string;
  major: string;
  bio: string;
  isHidden: boolean;
  // joinedClubs: string;
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
  conversationid: string;
  userId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
}

export interface Message {
  id: string;
  conversationid: string;
  senderid: string;
  content: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: string;
  isCurrentUser: boolean;
}
