'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useCanvasStore } from '@/lib/store/canvas-store';

interface SelectionBoxProps {
  containerRef: React.RefObject<HTMLElement>;
  viewport: { x: number; y: number; scale: number };
}

export function SelectionBox({ containerRef, viewport }: SelectionBoxProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [selectionCurrent, setSelectionCurrent] = useState<{ x: number; y: number } | null>(null);
  const { objects, selectObject, deselectAll } = useCanvasStore();

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('[data-canvas-object]')) return;

    setIsSelecting(true);
    setSelectionStart({
      x: (e.clientX - viewport.x) / viewport.scale,
      y: (e.clientY - viewport.y) / viewport.scale,
    });
    setSelectionCurrent({
      x: (e.clientX - viewport.x) / viewport.scale,
      y: (e.clientY - viewport.y) / viewport.scale,
    });

    deselectAll();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !selectionStart) return;

    setSelectionCurrent({
      x: (e.clientX - viewport.x) / viewport.scale,
      y: (e.clientY - viewport.y) / viewport.scale,
    });
  };

  const handleMouseUp = () => {
    if (!isSelecting || !selectionStart || !selectionCurrent) return;

    const minX = Math.min(selectionStart.x, selectionCurrent.x);
    const maxX = Math.max(selectionStart.x, selectionCurrent.x);
    const minY = Math.min(selectionStart.y, selectionCurrent.y);
    const maxY = Math.max(selectionStart.y, selectionCurrent.y);

    const selectedIds = Array.from(objects.values())
      .filter((obj) => {
        const objMaxX = obj.x + obj.width;
        const objMaxY = obj.y + obj.height;

        return !(
          objMaxX < minX ||
          obj.x > maxX ||
          objMaxY < minY ||
          obj.y > maxY
        );
      })
      .map((obj) => obj.id);

    selectedIds.forEach((id) => selectObject(id, true));

    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionCurrent(null);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove as any);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSelecting, selectionStart, selectionCurrent]);

  if (!isSelecting || !selectionStart || !selectionCurrent) return null;

  const x = Math.min(selectionStart.x, selectionCurrent.x);
  const y = Math.min(selectionStart.y, selectionCurrent.y);
  const width = Math.abs(selectionCurrent.x - selectionStart.x);
  const height = Math.abs(selectionCurrent.y - selectionStart.y);

  const screenX = x * viewport.scale + viewport.x;
  const screenY = y * viewport.scale + viewport.y;
  const screenWidth = width * viewport.scale;
  const screenHeight = height * viewport.scale;

  return (
    <div
      className="fixed pointer-events-none border-2 border-purple-500/50 bg-purple-500/10 rounded"
      style={{
        left: `${screenX}px`,
        top: `${screenY}px`,
        width: `${screenWidth}px`,
        height: `${screenHeight}px`,
      }}
    />
  );
}
