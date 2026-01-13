import { create } from 'zustand';
import { CanvasObject, CanvasViewport } from '@/types/canvas';

interface CanvasState {
  objects: Map<string, CanvasObject>;
  selectedIds: Set<string>;
  viewport: CanvasViewport;
  tool: CanvasTool;
  isDrawing: boolean;

  addObject: (object: CanvasObject) => void;
  updateObject: (id: string, updates: Partial<CanvasObject>) => void;
  deleteObject: (id: string) => void;
  deleteObjects: (ids: string[]) => void;

  selectObject: (id: string, multi?: boolean) => void;
  deselectAll: () => void;

  setViewport: (viewport: Partial<CanvasViewport>) => void;
  setTool: (tool: CanvasTool) => void;
  setIsDrawing: (isDrawing: boolean) => void;

  getObject: (id: string) => CanvasObject | undefined;
  getSelectedObjects: () => CanvasObject[];
}

export type CanvasTool =
  | 'select'
  | 'pan'
  | 'draw'
  | 'shape'
  | 'sticky'
  | 'text'
  | 'connector'
  | 'eraser';

export const useCanvasStore = create<CanvasState>((set, get) => ({
  objects: new Map(),
  selectedIds: new Set(),
  viewport: { x: 0, y: 0, scale: 1 },
  tool: 'select',
  isDrawing: false,

  addObject: (object) => {
    set((state) => {
      const newObjects = new Map(state.objects);
      newObjects.set(object.id, object);
      return { objects: newObjects };
    });
  },

  updateObject: (id, updates) => {
    set((state) => {
      const object = state.objects.get(id);
      if (!object) return state;

      const newObjects = new Map(state.objects);
      newObjects.set(id, { ...object, ...updates, updatedAt: Date.now() } as CanvasObject);
      return { objects: newObjects };
    });
  },

  deleteObject: (id) => {
    set((state) => {
      const newObjects = new Map(state.objects);
      newObjects.delete(id);

      const newSelectedIds = new Set(state.selectedIds);
      newSelectedIds.delete(id);

      return { objects: newObjects, selectedIds: newSelectedIds };
    });
  },

  deleteObjects: (ids) => {
    set((state) => {
      const newObjects = new Map(state.objects);
      const newSelectedIds = new Set(state.selectedIds);

      ids.forEach((id) => {
        newObjects.delete(id);
        newSelectedIds.delete(id);
      });

      return { objects: newObjects, selectedIds: newSelectedIds };
    });
  },

  selectObject: (id, multi = false) => {
    set((state) => {
      const newSelectedIds = multi ? new Set(state.selectedIds) : new Set<string>();

      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id);
      } else {
        newSelectedIds.add(id);
      }

      return { selectedIds: newSelectedIds };
    });
  },

  deselectAll: () => {
    set({ selectedIds: new Set() });
  },

  setViewport: (viewport) => {
    set((state) => ({
      viewport: { ...state.viewport, ...viewport },
    }));
  },

  setTool: (tool) => {
    set({ tool });
  },

  setIsDrawing: (isDrawing) => {
    set({ isDrawing });
  },

  getObject: (id) => {
    return get().objects.get(id);
  },

  getSelectedObjects: () => {
    const { objects, selectedIds } = get();
    return Array.from(selectedIds)
      .map((id) => objects.get(id))
      .filter((obj): obj is CanvasObject => obj !== undefined);
  },
}));
