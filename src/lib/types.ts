export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  status: UserStatus;
  statusText?: string;
  joinedAt: string;
  roles?: Role[];
}

export interface Role {
  id: string;
  name: string;
  color: string;
  permissions: string[];
}

export interface Server {
  id: string;
  name: string;
  icon?: string;
  ownerId: string;
  memberCount: number;
  categories: Category[];
  members: User[];
  roles: Role[];
}

export interface Category {
  id: string;
  name: string;
  channels: Channel[];
  collapsed?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  description?: string;
  topic?: string;
  lastMessageId?: string;
  unreadCount?: number;
  position: number;
}

export interface Message {
  id: string;
  content: string;
  authorId: string;
  channelId: string;
  timestamp: string;
  edited?: string;
  attachments?: Attachment[];
  reactions?: Reaction[];
  replyTo?: string;
  pinned?: boolean;
  type: 'default' | 'reply' | 'system';
  thread?: Thread;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  contentType: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Thread {
  id: string;
  name?: string;
  messageCount: number;
  memberCount: number;
  archived: boolean;
}

export interface DirectMessage {
  id: string;
  participants: string[];
  lastMessageId?: string;
  unreadCount?: number;
}

export interface VoiceState {
  userId: string;
  channelId?: string;
  muted: boolean;
  deafened: boolean;
  speaking: boolean;
}

export interface AppState {
  currentUser: User | null;
  servers: Server[];
  currentServerId?: string;
  currentChannelId?: string;
  directMessages: DirectMessage[];
  currentDMId?: string;
  messages: Record<string, Message[]>;
  voiceStates: VoiceState[];
  theme: 'dark' | 'light';
  language: string;
  friends: User[];
  friendRequests: User[];
  blockedUsers: User[];
  typingUsers: Record<string, string[]>;
  searchQuery: string;
  showMembers: boolean;
  showThread: boolean;
  activeThread?: string;
}