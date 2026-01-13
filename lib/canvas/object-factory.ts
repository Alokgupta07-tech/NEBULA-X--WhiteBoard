import {
  CanvasObject,
  CanvasShape,
  CanvasSticky,
  CanvasText,
  CanvasDrawing,
  CanvasConnector,
} from '@/types/canvas';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createShape(
  x: number,
  y: number,
  shapeType: CanvasShape['shapeType'],
  userId: string
): CanvasShape {
  return {
    id: generateId(),
    type: 'shape',
    shapeType,
    x,
    y,
    width: 150,
    height: 100,
    rotation: 0,
    zIndex: 0,
    locked: false,
    fill: '#8b5cf6',
    stroke: '#6d28d9',
    strokeWidth: 2,
    createdBy: userId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function createSticky(
  x: number,
  y: number,
  userId: string
): CanvasSticky {
  const colors = ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#e0e7ff'];
  const emojis = ['📝', '💡', '⭐', '🎯', '🚀', '💭', '✨'];

  return {
    id: generateId(),
    type: 'sticky',
    x,
    y,
    width: 200,
    height: 200,
    rotation: 0,
    zIndex: 0,
    locked: false,
    content: 'Type here...',
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    createdBy: userId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function createText(
  x: number,
  y: number,
  userId: string
): CanvasText {
  return {
    id: generateId(),
    type: 'text',
    x,
    y,
    width: 300,
    height: 50,
    rotation: 0,
    zIndex: 0,
    locked: false,
    content: 'Double-click to edit',
    fontSize: 24,
    fontFamily: 'Inter, sans-serif',
    color: '#e0e0ff',
    align: 'left',
    createdBy: userId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function createDrawing(
  points: number[],
  userId: string
): CanvasDrawing {
  const minX = Math.min(...points.filter((_, i) => i % 2 === 0));
  const minY = Math.min(...points.filter((_, i) => i % 2 === 1));
  const maxX = Math.max(...points.filter((_, i) => i % 2 === 0));
  const maxY = Math.max(...points.filter((_, i) => i % 2 === 1));

  return {
    id: generateId(),
    type: 'drawing',
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    rotation: 0,
    zIndex: 0,
    locked: false,
    points,
    stroke: '#8b5cf6',
    strokeWidth: 3,
    createdBy: userId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function createConnector(
  fromObjectId: string,
  toObjectId: string,
  userId: string
): CanvasConnector {
  return {
    id: generateId(),
    type: 'connector',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rotation: 0,
    zIndex: -1,
    locked: false,
    fromObjectId,
    toObjectId,
    fromAnchor: 'right',
    toAnchor: 'left',
    points: [],
    stroke: '#8b5cf6',
    strokeWidth: 2,
    animated: false,
    createdBy: userId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function cloneObject(
  object: CanvasObject,
  offsetX = 20,
  offsetY = 20
): CanvasObject {
  return {
    ...object,
    id: generateId(),
    x: object.x + offsetX,
    y: object.y + offsetY,
    locked: false,
    lockedBy: undefined,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
