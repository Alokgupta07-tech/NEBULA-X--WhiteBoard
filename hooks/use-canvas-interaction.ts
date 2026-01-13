import { useEffect, useRef, useState, useCallback } from 'react';
import { useCanvasStore } from '@/lib/store/canvas-store';
import { CoordinateTransformer, Point } from '@/lib/canvas/coordinates';
import { throttle } from '@/lib/canvas/performance';
import { CANVAS_CONFIG } from '@/lib/config/constants';

interface CanvasInteractionOptions {
  containerRef: React.RefObject<HTMLElement>;
  onViewportChange?: (viewport: any) => void;
}

export function useCanvasInteraction(options: CanvasInteractionOptions) {
  const { viewport, setViewport } = useCanvasStore();
  const { containerRef, onViewportChange } = options;

  const isDragging = useRef(false);
  const dragStart = useRef<Point | null>(null);
  const velocityRef = useRef<Point>({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.button !== 2 && e.button !== 1) return;

      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      velocityRef.current = { x: 0, y: 0 };

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging.current || !dragStart.current) return;

      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;

      velocityRef.current = { x: deltaX * 0.1, y: deltaY * 0.1 };

      const newViewport = {
        ...viewport,
        x: viewport.x + deltaX,
        y: viewport.y + deltaY,
      };

      setViewport(newViewport);
      onViewportChange?.(newViewport);

      dragStart.current = { x: e.clientX, y: e.clientY };
    },
    [viewport, setViewport, onViewportChange]
  );

  const applyInertia = useCallback(() => {
    if (
      Math.abs(velocityRef.current.x) < 0.01 &&
      Math.abs(velocityRef.current.y) < 0.01
    ) {
      return;
    }

    velocityRef.current.x *= CANVAS_CONFIG.PAN_INERTIA;
    velocityRef.current.y *= CANVAS_CONFIG.PAN_INERTIA;

    const newViewport = {
      ...viewport,
      x: viewport.x + velocityRef.current.x,
      y: viewport.y + velocityRef.current.y,
    };

    setViewport(newViewport);
    onViewportChange?.(newViewport);

    animationRef.current = requestAnimationFrame(applyInertia);
  }, [viewport, setViewport, onViewportChange]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    dragStart.current = null;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(applyInertia);
  }, [applyInertia]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomDelta = e.deltaY > 0 ? -0.05 : 0.05;

      const transformer = new CoordinateTransformer(
        viewport,
        rect.width,
        rect.height
      );

      const newViewport = transformer.zoomToPoint(
        { x: mouseX, y: mouseY },
        zoomDelta
      );

      setViewport(newViewport);
      onViewportChange?.(newViewport);
    },
    [viewport, setViewport, containerRef, onViewportChange]
  );

  const zoomToFit = useCallback(
    (bounds: { x: number; y: number; width: number; height: number }) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const transformer = new CoordinateTransformer(
        viewport,
        rect.width,
        rect.height
      );

      const newViewport = transformer.fitToScreen(bounds, 50);
      setViewport(newViewport);
      onViewportChange?.(newViewport);
    },
    [viewport, setViewport, containerRef, onViewportChange]
  );

  const zoomToPoint = useCallback(
    (point: Point, delta: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const transformer = new CoordinateTransformer(
        viewport,
        rect.width,
        rect.height
      );

      const newViewport = transformer.zoomToPoint(point, delta);
      setViewport(newViewport);
      onViewportChange?.(newViewport);
    },
    [viewport, setViewport, containerRef, onViewportChange]
  );

  const panBy = useCallback(
    (deltaX: number, deltaY: number) => {
      const newViewport = {
        ...viewport,
        x: viewport.x + deltaX,
        y: viewport.y + deltaY,
      };

      setViewport(newViewport);
      onViewportChange?.(newViewport);
    },
    [viewport, setViewport, onViewportChange]
  );

  const getWorldPoint = useCallback(
    (screenX: number, screenY: number) => {
      if (!containerRef.current) return { x: 0, y: 0 };

      const rect = containerRef.current.getBoundingClientRect();
      const transformer = new CoordinateTransformer(
        viewport,
        rect.width,
        rect.height
      );

      return transformer.screenToWorld({ x: screenX, y: screenY });
    },
    [viewport, containerRef]
  );

  const getScreenPoint = useCallback(
    (worldX: number, worldY: number) => {
      if (!containerRef.current) return { x: 0, y: 0 };

      const rect = containerRef.current.getBoundingClientRect();
      const transformer = new CoordinateTransformer(
        viewport,
        rect.width,
        rect.height
      );

      return transformer.worldToScreen({ x: worldX, y: worldY });
    },
    [viewport, containerRef]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleWheel]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    zoomToFit,
    zoomToPoint,
    panBy,
    getWorldPoint,
    getScreenPoint,
  };
}
