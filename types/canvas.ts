export type CanvasObject = CanvasShape | CanvasSticky | CanvasText | CanvasDrawing | CanvasConnector;

export interface BaseCanvasObject {
  id: string;
  type: 'shape' | 'sticky' | 'text' | 'drawing' | 'connector';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  locked: boolean;
  lockedBy?: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface CanvasShape extends BaseCanvasObject {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'diamond' | 'arrow';
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface CanvasSticky extends BaseCanvasObject {
  type: 'sticky';
  content: string;
  emoji: string;
  color: string;
}

export interface CanvasText extends BaseCanvasObject {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  align: 'left' | 'center' | 'right';
}

export interface CanvasDrawing extends BaseCanvasObject {
  type: 'drawing';
  points: number[];
  stroke: string;
  strokeWidth: number;
}

export interface CanvasConnector extends BaseCanvasObject {
  type: 'connector';
  fromObjectId: string;
  toObjectId: string;
  fromAnchor: AnchorPoint;
  toAnchor: AnchorPoint;
  points: number[];
  stroke: string;
  strokeWidth: number;
  animated: boolean;
}

export type AnchorPoint = 'top' | 'right' | 'bottom' | 'left';

export interface CanvasViewport {
  x: number;
  y: number;
  scale: number;
}

export interface CanvasBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
