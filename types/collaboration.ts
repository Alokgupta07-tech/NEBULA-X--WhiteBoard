export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
}

export interface CollaboratorCursor {
  userId: string;
  userName: string;
  color: string;
  x: number;
  y: number;
  lastUpdate: number;
}

export interface BoardMember {
  user: User;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: number;
  isActive: boolean;
  cursor?: CollaboratorCursor;
}

export interface SocketEvent {
  type: SocketEventType;
  payload: unknown;
  userId: string;
  timestamp: number;
}

export type SocketEventType =
  | 'object:create'
  | 'object:update'
  | 'object:delete'
  | 'object:lock'
  | 'object:unlock'
  | 'cursor:move'
  | 'user:join'
  | 'user:leave'
  | 'viewport:change';

export interface ObjectLock {
  objectId: string;
  userId: string;
  userName: string;
  lockedAt: number;
  expiresAt: number;
}
