export interface Contact {
  id: number;
  name: string;
  avatar?: string;
  isActive: boolean;
  lastActivity?: Date;
}

export type ThreadType = 'direct' | 'group';

export interface Thread {
  id: number;
  type: ThreadType;
  participants: Participant[];
  unreadCount: number;
}

export interface Participant {
  id: number;
  name: string;
  avatar?: string;
}

export type MessageType = 'text' | 'image';

export interface Message {
  id: number;
  threadId: string;
  type: MessageType;
  content: string;
  author: { id: number; name: string; avatar?: string };
  createdAt: Date;
}
