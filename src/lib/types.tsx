export interface Profile {
  id: string;
  picture: string;
  name: string;
  pronouns: string;
  year: string;
  major: string;
  bio: string;
  isHidden: boolean;
  clubs: string;
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

export interface JoinedClub {
  id: string;
  name: string;
  category: string;
  avatar: string;
  joinDate: string;
}

export interface Post {
  id: string;
  clubid: string;
  posterid: string;
  title: string;
  content: string;
  locations: string;
  timestamp: string;
  likes: string;
  comments: string;
}

export interface FeedItem {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  likedUsers: string;
  comments: number;
  commentsString: string;
}

export interface Account {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface Match {
  id: string;
  userid: string;
  matches: string;
}
