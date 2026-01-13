import { io, Socket } from 'socket.io-client';
import { SocketEvent, SocketEventType } from '@/types/collaboration';
import { CanvasObject } from '@/types/canvas';

interface SocketClientConfig {
  boardId: string;
  userId: string;
  userName: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onEvent?: (event: SocketEvent) => void;
}

export class SocketClient {
  private socket: Socket | null = null;
  private config: SocketClientConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(config: SocketClientConfig) {
    this.config = config;
  }

  connect() {
    if (this.socket?.connected) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || '';

    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts,
      auth: {
        boardId: this.config.boardId,
        userId: this.config.userId,
        userName: this.config.userName,
      },
    });

    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[Socket] Connected');
      this.reconnectAttempts = 0;
      this.config.onConnect?.();
    });

    this.socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
      this.config.onDisconnect?.();
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error);
      this.reconnectAttempts++;
    });

    this.socket.on('event', (event: SocketEvent) => {
      this.config.onEvent?.(event);
    });
  }

  emitObjectCreate(object: CanvasObject) {
    this.emit('object:create', { object });
  }

  emitObjectUpdate(objectId: string, updates: Partial<CanvasObject>) {
    this.emit('object:update', { objectId, updates });
  }

  emitObjectDelete(objectId: string) {
    this.emit('object:delete', { objectId });
  }

  emitCursorMove(x: number, y: number) {
    this.emit('cursor:move', { x, y }, true);
  }

  emitObjectLock(objectId: string) {
    this.emit('object:lock', { objectId });
  }

  emitObjectUnlock(objectId: string) {
    this.emit('object:unlock', { objectId });
  }

  private emit(
    eventType: SocketEventType,
    payload: unknown,
    throttled = false
  ) {
    if (!this.socket?.connected) {
      console.warn('[Socket] Not connected, cannot emit:', eventType);
      return;
    }

    const event: SocketEvent = {
      type: eventType,
      payload,
      userId: this.config.userId,
      timestamp: Date.now(),
    };

    this.socket.emit('event', event);
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

let socketClient: SocketClient | null = null;

export function getSocketClient(): SocketClient | null {
  return socketClient;
}

export function initializeSocketClient(
  config: SocketClientConfig
): SocketClient {
  if (socketClient) {
    socketClient.disconnect();
  }

  socketClient = new SocketClient(config);
  socketClient.connect();

  return socketClient;
}

export function disconnectSocketClient() {
  if (socketClient) {
    socketClient.disconnect();
    socketClient = null;
  }
}
