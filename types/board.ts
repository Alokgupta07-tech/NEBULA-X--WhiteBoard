import { CanvasObject } from './canvas';
import { User } from './collaboration';

export interface Board {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  objects: CanvasObject[];
  theme: ThemeType;
  thumbnail?: string;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
  lastAccessedAt: number;
}

export type ThemeType = 'cosmic-glass' | 'minimal-pro' | 'cyber-motion';

export interface BoardMetadata {
  objectCount: number;
  collaboratorCount: number;
  lastModifiedBy?: User;
  version: number;
}

export interface BoardPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  canExport: boolean;
}

export interface BoardSnapshot {
  boardId: string;
  timestamp: number;
  objects: CanvasObject[];
  viewport: { x: number; y: number; scale: number };
  createdBy: string;
  label?: string;
}
