import { create } from 'zustand';
import { BoardMember, CollaboratorCursor, ObjectLock } from '@/types/collaboration';

interface CollaborationState {
  currentUserId: string | null;
  members: Map<string, BoardMember>;
  cursors: Map<string, CollaboratorCursor>;
  locks: Map<string, ObjectLock>;
  isConnected: boolean;

  setCurrentUser: (userId: string) => void;

  addMember: (member: BoardMember) => void;
  removeMember: (userId: string) => void;
  updateMemberCursor: (userId: string, cursor: CollaboratorCursor) => void;

  addLock: (lock: ObjectLock) => void;
  removeLock: (objectId: string) => void;
  isObjectLocked: (objectId: string) => boolean;
  canEditObject: (objectId: string) => boolean;

  setConnected: (connected: boolean) => void;

  getActiveMembersCount: () => number;
  getObjectLock: (objectId: string) => ObjectLock | undefined;
}

export const useCollaborationStore = create<CollaborationState>((set, get) => ({
  currentUserId: null,
  members: new Map(),
  cursors: new Map(),
  locks: new Map(),
  isConnected: false,

  setCurrentUser: (userId) => {
    set({ currentUserId: userId });
  },

  addMember: (member) => {
    set((state) => {
      const newMembers = new Map(state.members);
      newMembers.set(member.user.id, member);
      return { members: newMembers };
    });
  },

  removeMember: (userId) => {
    set((state) => {
      const newMembers = new Map(state.members);
      const newCursors = new Map(state.cursors);
      newMembers.delete(userId);
      newCursors.delete(userId);
      return { members: newMembers, cursors: newCursors };
    });
  },

  updateMemberCursor: (userId, cursor) => {
    set((state) => {
      const newCursors = new Map(state.cursors);
      newCursors.set(userId, cursor);
      return { cursors: newCursors };
    });
  },

  addLock: (lock) => {
    set((state) => {
      const newLocks = new Map(state.locks);
      newLocks.set(lock.objectId, lock);
      return { locks: newLocks };
    });
  },

  removeLock: (objectId) => {
    set((state) => {
      const newLocks = new Map(state.locks);
      newLocks.delete(objectId);
      return { locks: newLocks };
    });
  },

  isObjectLocked: (objectId) => {
    return get().locks.has(objectId);
  },

  canEditObject: (objectId) => {
    const { locks, currentUserId } = get();
    const lock = locks.get(objectId);

    if (!lock) return true;

    if (Date.now() > lock.expiresAt) {
      get().removeLock(objectId);
      return true;
    }

    return lock.userId === currentUserId;
  },

  setConnected: (connected) => {
    set({ isConnected: connected });
  },

  getActiveMembersCount: () => {
    return Array.from(get().members.values()).filter((m) => m.isActive).length;
  },

  getObjectLock: (objectId) => {
    return get().locks.get(objectId);
  },
}));
