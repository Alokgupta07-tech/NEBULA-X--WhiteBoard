import { create } from 'zustand';
import { Board, ThemeType, BoardSnapshot } from '@/types/board';

interface BoardState {
  currentBoard: Board | null;
  boards: Board[];
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: number | null;

  history: BoardSnapshot[];
  historyIndex: number;
  maxHistorySize: number;

  setCurrentBoard: (board: Board) => void;
  updateBoard: (updates: Partial<Board>) => void;
  setTheme: (theme: ThemeType) => void;

  addBoard: (board: Board) => void;
  removeBoard: (boardId: string) => void;

  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setLastSaved: (timestamp: number) => void;

  addSnapshot: (snapshot: BoardSnapshot) => void;
  undo: () => BoardSnapshot | null;
  redo: () => BoardSnapshot | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  currentBoard: null,
  boards: [],
  isLoading: false,
  isSaving: false,
  lastSaved: null,

  history: [],
  historyIndex: -1,
  maxHistorySize: 50,

  setCurrentBoard: (board) => {
    set({ currentBoard: board });
  },

  updateBoard: (updates) => {
    set((state) => {
      if (!state.currentBoard) return state;

      const updatedBoard = {
        ...state.currentBoard,
        ...updates,
        updatedAt: Date.now(),
      };

      return { currentBoard: updatedBoard };
    });
  },

  setTheme: (theme) => {
    get().updateBoard({ theme });
  },

  addBoard: (board) => {
    set((state) => ({
      boards: [...state.boards, board],
    }));
  },

  removeBoard: (boardId) => {
    set((state) => ({
      boards: state.boards.filter((b) => b.id !== boardId),
      currentBoard:
        state.currentBoard?.id === boardId ? null : state.currentBoard,
    }));
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setSaving: (saving) => {
    set({ isSaving: saving });
  },

  setLastSaved: (timestamp) => {
    set({ lastSaved: timestamp });
  },

  addSnapshot: (snapshot) => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(snapshot);

      if (newHistory.length > state.maxHistorySize) {
        newHistory.shift();
      }

      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      set({ historyIndex: historyIndex - 1 });
      return history[historyIndex - 1];
    }
    return null;
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      set({ historyIndex: historyIndex + 1 });
      return history[historyIndex + 1];
    }
    return null;
  },

  canUndo: () => {
    return get().historyIndex > 0;
  },

  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },
}));
