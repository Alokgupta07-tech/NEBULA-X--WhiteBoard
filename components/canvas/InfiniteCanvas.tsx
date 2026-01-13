'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useCanvasStore } from '@/lib/store/canvas-store';
import { useCanvasInteraction } from '@/hooks/use-canvas-interaction';
import { Grid } from './Grid';
import { SelectionBox } from './SelectionBox';
import { ViewportControls } from './ViewportControls';
import { CanvasRenderer } from './CanvasRenderer';
import { ShapeDrawer } from './ShapeDrawer';
import { TextAndStickyCreator } from './TextAndStickyCreator';
import { CANVAS_CONFIG } from '@/lib/config/constants';

export function InfiniteCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { viewport, setViewport, tool } = useCanvasStore();

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    zoomToFit,
    zoomToPoint,
    panBy,
  } = useCanvasInteraction({
    containerRef,
    onViewportChange: (newViewport) => setViewport(newViewport),
  });

  const handleZoomIn = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    zoomToPoint({ x: centerX, y: centerY }, 0.2);
  }, [zoomToPoint]);

  const handleZoomOut = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    zoomToPoint({ x: centerX, y: centerY }, -0.2);
  }, [zoomToPoint]);

  const handleResetZoom = useCallback(() => {
    setViewport({ x: 0, y: 0, scale: 1 });
  }, [setViewport]);

  const handleFitToScreen = useCallback(() => {
    zoomToFit({ x: -2000, y: -2000, width: 4000, height: 4000 });
  }, [zoomToFit]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.ctrlKey || e.metaKey;

      // Tool shortcuts
      if (!isMeta) {
        switch (e.key.toLowerCase()) {
          case 'v':
            useCanvasStore.getState().setTool('select');
            return;
          case 'd':
            useCanvasStore.getState().setTool('draw');
            return;
          case 'r':
            useCanvasStore.getState().setTool('shape');
            return;
          case 't':
            useCanvasStore.getState().setTool('text');
            return;
          case 's':
            useCanvasStore.getState().setTool('sticky');
            return;
          case 'h':
            useCanvasStore.getState().setTool('pan');
            return;
        }
      }

      switch (e.key) {
        case '+':
        case '=':
          if (isMeta) {
            e.preventDefault();
            handleZoomIn();
          }
          break;
        case '-':
          if (isMeta) {
            e.preventDefault();
            handleZoomOut();
          }
          break;
        case '0':
          if (isMeta) {
            e.preventDefault();
            handleResetZoom();
          }
          break;
        case 'ArrowUp':
          panBy(0, 50);
          break;
        case 'ArrowDown':
          panBy(0, -50);
          break;
        case 'ArrowLeft':
          panBy(50, 0);
          break;
        case 'ArrowRight':
          panBy(-50, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoomIn, handleZoomOut, handleResetZoom, panBy]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ 
          cursor: tool === 'draw' ? 'crosshair' : tool === 'pan' ? 'grab' : 'default'
        }}
      >
        <div
          className="absolute inset-0 transition-transform pointer-events-none"
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
          }}
        >
          <Grid />
        </div>

        {/* Background layer for pan and select tools */}
        {(tool === 'pan' || tool === 'select') && (
          <div
            className="absolute inset-0 pointer-events-auto"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        )}

        <CanvasRenderer viewport={viewport} />
        <ShapeDrawer viewport={viewport} />
        <TextAndStickyCreator viewport={viewport} />

        <SelectionBox containerRef={containerRef} viewport={viewport} />
      </div>

      <ViewportControls
        zoom={viewport.scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onFitToScreen={handleFitToScreen}
      />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent pointer-events-none" />
    </div>
  );
}
