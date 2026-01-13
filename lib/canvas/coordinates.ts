import { CanvasViewport } from '@/types/canvas';

export interface Point {
  x: number;
  y: number;
}

export class CoordinateTransformer {
  private viewport: CanvasViewport;
  private containerWidth: number;
  private containerHeight: number;

  constructor(
    viewport: CanvasViewport,
    containerWidth: number,
    containerHeight: number
  ) {
    this.viewport = viewport;
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
  }

  screenToWorld(screenPoint: Point): Point {
    return {
      x: (screenPoint.x - this.viewport.x) / this.viewport.scale,
      y: (screenPoint.y - this.viewport.y) / this.viewport.scale,
    };
  }

  worldToScreen(worldPoint: Point): Point {
    return {
      x: worldPoint.x * this.viewport.scale + this.viewport.x,
      y: worldPoint.y * this.viewport.scale + this.viewport.y,
    };
  }

  getVisibleWorldBounds() {
    const topLeft = this.screenToWorld({ x: 0, y: 0 });
    const bottomRight = this.screenToWorld({
      x: this.containerWidth,
      y: this.containerHeight,
    });

    return {
      minX: topLeft.x,
      minY: topLeft.y,
      maxX: bottomRight.x,
      maxY: bottomRight.y,
    };
  }

  isPointInViewport(worldPoint: Point, margin = 100): boolean {
    const bounds = this.getVisibleWorldBounds();
    return (
      worldPoint.x >= bounds.minX - margin &&
      worldPoint.x <= bounds.maxX + margin &&
      worldPoint.y >= bounds.minY - margin &&
      worldPoint.y <= bounds.maxY + margin
    );
  }

  zoomToPoint(point: Point, zoomDelta: number): CanvasViewport {
    const oldScale = this.viewport.scale;
    const newScale = Math.max(
      0.1,
      Math.min(10, oldScale * (1 + zoomDelta))
    );

    const worldPoint = this.screenToWorld(point);

    const newX = point.x - worldPoint.x * newScale;
    const newY = point.y - worldPoint.y * newScale;

    return {
      x: newX,
      y: newY,
      scale: newScale,
    };
  }

  panBy(deltaX: number, deltaY: number): CanvasViewport {
    return {
      ...this.viewport,
      x: this.viewport.x + deltaX,
      y: this.viewport.y + deltaY,
    };
  }

  fitToScreen(
    objectBounds: { x: number; y: number; width: number; height: number },
    padding = 50
  ): CanvasViewport {
    const scaleX =
      (this.containerWidth - padding * 2) / objectBounds.width;
    const scaleY =
      (this.containerHeight - padding * 2) / objectBounds.height;
    const scale = Math.min(scaleX, scaleY, 1);

    const centerX = objectBounds.x + objectBounds.width / 2;
    const centerY = objectBounds.y + objectBounds.height / 2;

    const x = this.containerWidth / 2 - centerX * scale;
    const y = this.containerHeight / 2 - centerY * scale;

    return { x, y, scale };
  }
}

export function getDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function getAngle(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

export function rotatePoint(point: Point, center: Point, angle: number): Point {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = point.x - center.x;
  const dy = point.y - center.y;

  return {
    x: cos * dx - sin * dy + center.x,
    y: sin * dx + cos * dy + center.y,
  };
}

export function snapToGrid(point: Point, gridSize: number): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize,
  };
}
