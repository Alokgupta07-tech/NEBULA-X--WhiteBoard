export const CANVAS_CONFIG = {
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 10,
  DEFAULT_ZOOM: 1,
  ZOOM_SENSITIVITY: 0.001,
  PAN_INERTIA: 0.95,
  GRID_SIZE: 20,
  GRID_SPACING_LARGE: 100,
  VIEWPORT_MARGIN: 200,
} as const;

export const OBJECT_CONFIG = {
  DEFAULT_SHAPE_WIDTH: 150,
  DEFAULT_SHAPE_HEIGHT: 100,
  DEFAULT_STICKY_SIZE: 200,
  DEFAULT_TEXT_SIZE: 300,
  DEFAULT_STROKE_WIDTH: 2,
  MIN_OBJECT_SIZE: 20,
  MAX_OBJECT_SIZE: 5000,
  SNAP_GRID_SIZE: 20,
  ALIGNMENT_THRESHOLD: 5,
} as const;

export const COLLABORATION_CONFIG = {
  CURSOR_UPDATE_THROTTLE: 16,
  OBJECT_LOCK_TIMEOUT: 30000,
  PRESENCE_TIMEOUT: 60000,
  MAX_USERS_PER_BOARD: 50,
  RECONNECT_DELAY: 1000,
  MAX_RECONNECT_ATTEMPTS: 5,
} as const;

export const PERFORMANCE_CONFIG = {
  TARGET_FPS: 60,
  MAX_OBJECTS_PER_BOARD: 10000,
  RENDER_BUFFER: 100,
  AUTOSAVE_INTERVAL: 30000,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 16,
} as const;

export const HISTORY_CONFIG = {
  MAX_UNDO_STACK_SIZE: 50,
  SNAPSHOT_INTERVAL: 5000,
  MAX_TIMELINE_EVENTS: 1000,
} as const;

export const ANIMATION_CONFIG = {
  SPRING_STIFFNESS: 300,
  SPRING_DAMPING: 30,
  TRANSITION_DURATION: 0.2,
  CURSOR_TRAIL_LENGTH: 10,
  GLOW_PULSE_DURATION: 2,
} as const;

export const UI_CONFIG = {
  TOOLBAR_HEIGHT: 60,
  SIDEBAR_WIDTH: 280,
  MINIMAP_SIZE: 200,
  COMMAND_PALETTE_WIDTH: 600,
  TOAST_DURATION: 3000,
} as const;

export const COLORS = {
  STICKY_COLORS: [
    '#fef3c7',
    '#dbeafe',
    '#fce7f3',
    '#d1fae5',
    '#e0e7ff',
    '#fce7f3',
  ],
  SHAPE_FILLS: [
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#ef4444',
  ],
  USER_COLORS: [
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#f9ca24',
    '#6c5ce7',
    '#fd79a8',
    '#00b894',
    '#fdcb6e',
    '#e17055',
    '#74b9ff',
  ],
} as const;

export const EMOJIS = {
  STICKY_EMOJIS: ['📝', '💡', '⭐', '🎯', '🚀', '💭', '✨', '🔥', '💎', '🌟'],
} as const;

export const KEYBOARD_SHORTCUTS = {
  SELECT: 'v',
  PAN: 'h',
  DRAW: 'd',
  SHAPE: 'r',
  STICKY: 's',
  TEXT: 't',
  CONNECTOR: 'c',
  UNDO: 'mod+z',
  REDO: 'mod+shift+z',
  COPY: 'mod+c',
  PASTE: 'mod+v',
  DELETE: ['backspace', 'delete'],
  SELECT_ALL: 'mod+a',
  ZOOM_IN: 'mod+=',
  ZOOM_OUT: 'mod+-',
  ZOOM_RESET: 'mod+0',
  COMMAND_PALETTE: 'mod+k',
} as const;

export const API_ENDPOINTS = {
  BOARDS: '/api/boards',
  BOARD: (id: string) => `/api/boards/${id}`,
  BOARD_OBJECTS: (boardId: string) => `/api/boards/${boardId}/objects`,
  BOARD_MEMBERS: (boardId: string) => `/api/boards/${boardId}/members`,
  EXPORT_PNG: (boardId: string) => `/api/boards/${boardId}/export/png`,
  EXPORT_PDF: (boardId: string) => `/api/boards/${boardId}/export/pdf`,
} as const;

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  EVENT: 'event',
  ERROR: 'error',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  BOARD_NOT_FOUND: 'Board not found.',
  PERMISSION_DENIED: 'You do not have permission to access this board.',
  OBJECT_LOCKED: 'This object is currently being edited by another user.',
  MAX_OBJECTS_REACHED: 'Maximum number of objects reached.',
  INVALID_OPERATION: 'Invalid operation.',
} as const;
