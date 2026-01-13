import { CanvasObject } from '@/types/canvas';
import { CanvasBounds } from '@/types/canvas';

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(
        () => {
          lastCall = Date.now();
          func(...args);
        },
        delay - (now - lastCall)
      );
    }
  };
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function isObjectInViewport(
  object: CanvasObject,
  viewport: CanvasBounds
): boolean {
  const buffer = 100;

  return !(
    object.x + object.width < viewport.minX - buffer ||
    object.x > viewport.maxX + buffer ||
    object.y + object.height < viewport.minY - buffer ||
    object.y > viewport.maxY + buffer
  );
}

export function filterVisibleObjects(
  objects: CanvasObject[],
  viewport: CanvasBounds
): CanvasObject[] {
  return objects.filter((obj) => isObjectInViewport(obj, viewport));
}

export function calculateObjectBounds(object: CanvasObject) {
  const cos = Math.cos(object.rotation);
  const sin = Math.sin(object.rotation);

  const hw = object.width / 2;
  const hh = object.height / 2;

  const corners = [
    { x: -hw, y: -hh },
    { x: hw, y: -hh },
    { x: hw, y: hh },
    { x: -hw, y: hh },
  ];

  const rotatedCorners = corners.map((corner) => ({
    x: object.x + object.width / 2 + corner.x * cos - corner.y * sin,
    y: object.y + object.height / 2 + corner.x * sin + corner.y * cos,
  }));

  const xs = rotatedCorners.map((c) => c.x);
  const ys = rotatedCorners.map((c) => c.y);

  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  };
}

export function calculateSelectionBounds(
  objects: CanvasObject[]
): CanvasBounds | null {
  if (objects.length === 0) return null;

  const allBounds = objects.map(calculateObjectBounds);

  return {
    minX: Math.min(...allBounds.map((b) => b.minX)),
    minY: Math.min(...allBounds.map((b) => b.minY)),
    maxX: Math.max(...allBounds.map((b) => b.maxX)),
    maxY: Math.max(...allBounds.map((b) => b.maxY)),
  };
}

export class PerformanceMonitor {
  private fps = 0;
  private lastTime = performance.now();
  private frameCount = 0;
  private fpsHistory: number[] = [];

  update() {
    this.frameCount++;
    const currentTime = performance.now();
    const delta = currentTime - this.lastTime;

    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta);
      this.fpsHistory.push(this.fps);

      if (this.fpsHistory.length > 60) {
        this.fpsHistory.shift();
      }

      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }

  getFPS(): number {
    return this.fps;
  }

  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 0;
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.fpsHistory.length);
  }

  reset() {
    this.fps = 0;
    this.frameCount = 0;
    this.fpsHistory = [];
    this.lastTime = performance.now();
  }
}
