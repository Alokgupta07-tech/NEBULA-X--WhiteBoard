'use client';

import React, { useState, useRef } from 'react';
import { useCanvasStore } from '@/lib/store/canvas-store';
import { useBoardStore } from '@/lib/store/board-store';
import { CanvasShape } from '@/types/canvas';

interface ShapeDrawerProps {
  viewport: { x: number; y: number; scale: number };
}

export function ShapeDrawer({ viewport }: ShapeDrawerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tool } = useCanvasStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null);
  const [shapeType, setShapeType] = useState<'rectangle' | 'circle'>('rectangle');

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== 'shape') return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - viewport.x) / viewport.scale;
    const y = (e.clientY - rect.top - viewport.y) / viewport.scale;

    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentPos({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - viewport.x) / viewport.scale;
    const y = (e.clientY - rect.top - viewport.y) / viewport.scale;

    setCurrentPos({ x, y });

    // Draw preview
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(viewport.x, viewport.y);
    ctx.scale(viewport.scale, viewport.scale);

    const minX = Math.min(startPos.x, x);
    const minY = Math.min(startPos.y, y);
    const width = Math.abs(x - startPos.x);
    const height = Math.abs(y - startPos.y);

    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    if (shapeType === 'rectangle') {
      ctx.strokeRect(minX, minY, width, height);
    } else if (shapeType === 'circle') {
      const centerX = minX + width / 2;
      const centerY = minY + height / 2;
      const radius = Math.min(width, height) / 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos || !currentPos) {
      setIsDrawing(false);
      setStartPos(null);
      setCurrentPos(null);
      
      // Clear canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      return;
    }

    const minX = Math.min(startPos.x, currentPos.x);
    const minY = Math.min(startPos.y, currentPos.y);
    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);

    // Only create shape if it has meaningful size
    if (width < 5 || height < 5) {
      setIsDrawing(false);
      setStartPos(null);
      setCurrentPos(null);
      
      // Clear canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      return;
    }

    const shape: CanvasShape = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      shapeType: shapeType,
      x: minX,
      y: minY,
      width,
      height,
      rotation: 0,
      zIndex: Date.now(),
      locked: false,
      createdBy: 'current-user',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      fill: 'rgba(168, 85, 247, 0.1)',
      stroke: '#a855f7',
      strokeWidth: 2,
    };

    useCanvasStore.getState().addObject(shape);
    
    const currentBoard = useBoardStore.getState().currentBoard;
    if (currentBoard) {
      useBoardStore.getState().setCurrentBoard({
        ...currentBoard,
        objects: [...currentBoard.objects, shape],
      });
    }

    setIsDrawing(false);
    setStartPos(null);
    setCurrentPos(null);

    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  if (tool !== 'shape') {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ cursor: 'crosshair' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
}
