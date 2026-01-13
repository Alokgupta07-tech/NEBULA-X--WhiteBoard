'use client';

import React from 'react';
import { useCanvasStore } from '@/lib/store/canvas-store';
import { CANVAS_CONFIG } from '@/lib/config/constants';

export function Grid() {
  const { viewport } = useCanvasStore();

  const gridSize = CANVAS_CONFIG.GRID_SIZE;
  const gridLargeSize = CANVAS_CONFIG.GRID_SPACING_LARGE;

  const gridOpacity = Math.max(0.05, Math.min(0.2, (viewport.scale - 0.5) * 0.3));
  const largeGridOpacity = Math.max(0.1, Math.min(0.25, (viewport.scale - 0.3) * 0.4));

  const offsetX = ((viewport.x % gridSize) + gridSize) % gridSize;
  const offsetY = ((viewport.y % gridSize) + gridSize) % gridSize;

  const offsetLargeX = ((viewport.x % gridLargeSize) + gridLargeSize) % gridLargeSize;
  const offsetLargeY = ((viewport.y % gridLargeSize) + gridLargeSize) % gridLargeSize;

  const scaledGridSize = gridSize * viewport.scale;
  const scaledLargeGridSize = gridLargeSize * viewport.scale;

  if (viewport.scale < 0.2) {
    return null;
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: gridOpacity }}>
      <defs>
        <pattern
          id="smallGrid"
          width={scaledGridSize}
          height={scaledGridSize}
          x={offsetX}
          y={offsetY}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${scaledGridSize} 0 L 0 0 0 ${scaledGridSize}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity={gridOpacity}
          />
        </pattern>

        <pattern
          id="largeGrid"
          width={scaledLargeGridSize}
          height={scaledLargeGridSize}
          x={offsetLargeX}
          y={offsetLargeY}
          patternUnits="userSpaceOnUse"
        >
          <rect
            width={scaledLargeGridSize}
            height={scaledLargeGridSize}
            fill="url(#smallGrid)"
          />
          <path
            d={`M ${scaledLargeGridSize} 0 L 0 0 0 ${scaledLargeGridSize}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity={largeGridOpacity}
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#largeGrid)" />
    </svg>
  );
}
