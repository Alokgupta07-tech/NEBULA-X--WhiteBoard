import { create } from 'zustand';

interface UIState {
  showGrid: boolean;
  showMinimap: boolean;
  showCommandPalette: boolean;
  showLayersPanel: boolean;
  showPropertiesPanel: boolean;

  toggleGrid: () => void;
  toggleMinimap: () => void;
  toggleCommandPalette: () => void;
  toggleLayersPanel: () => void;
  togglePropertiesPanel: () => void;

  setGrid: (show: boolean) => void;
  setMinimap: (show: boolean) => void;
  setCommandPalette: (show: boolean) => void;
  setLayersPanel: (show: boolean) => void;
  setPropertiesPanel: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  showGrid: true,
  showMinimap: false,
  showCommandPalette: false,
  showLayersPanel: true,
  showPropertiesPanel: true,

  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleMinimap: () => set((state) => ({ showMinimap: !state.showMinimap })),
  toggleCommandPalette: () =>
    set((state) => ({ showCommandPalette: !state.showCommandPalette })),
  toggleLayersPanel: () =>
    set((state) => ({ showLayersPanel: !state.showLayersPanel })),
  togglePropertiesPanel: () =>
    set((state) => ({ showPropertiesPanel: !state.showPropertiesPanel })),

  setGrid: (show) => set({ showGrid: show }),
  setMinimap: (show) => set({ showMinimap: show }),
  setCommandPalette: (show) => set({ showCommandPalette: show }),
  setLayersPanel: (show) => set({ showLayersPanel: show }),
  setPropertiesPanel: (show) => set({ showPropertiesPanel: show }),
}));
