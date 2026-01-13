'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCanvasStore } from '@/lib/store/canvas-store';
import { useBoardStore } from '@/lib/store/board-store';
import { CanvasObject, CanvasDrawing, CanvasShape, CanvasText } from '@/types/canvas';

interface CanvasRendererProps {
  viewport: { x: number; y: number; scale: number };
}

export function CanvasRenderer({ viewport }: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { objects, selectedIds, tool, isDrawing } = useCanvasStore();
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Render all canvas objects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Only resize if needed
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    }

    // Use requestAnimationFrame for smooth rendering
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Apply viewport transform
      ctx.save();
      ctx.translate(viewport.x, viewport.y);
      ctx.scale(viewport.scale, viewport.scale);

      // Render all objects
      const objectsArray = Array.from(objects.values()).sort((a, b) => a.zIndex - b.zIndex);
      
      objectsArray.forEach((obj) => {
        renderObject(ctx, obj, selectedIds.has(obj.id));
      });

      // Render current drawing path
      if (isDrawing && currentPath.length > 0 && tool === 'draw') {
        ctx.beginPath();
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        for (let i = 0; i < currentPath.length; i += 2) {
          if (i === 0) {
            ctx.moveTo(currentPath[i], currentPath[i + 1]);
          } else {
            ctx.lineTo(currentPath[i], currentPath[i + 1]);
          }
        }
        ctx.stroke();
      }

      ctx.restore();
    };

    render();
  }, [objects, selectedIds, viewport, currentPath, isDrawing, tool]);

  const renderObject = (ctx: CanvasRenderingContext2D, obj: CanvasObject, isSelected: boolean) => {
    ctx.save();

    // Apply object transform
    ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
    ctx.rotate((obj.rotation * Math.PI) / 180);
    ctx.translate(-(obj.x + obj.width / 2), -(obj.y + obj.height / 2));

    switch (obj.type) {
      case 'drawing':
        renderDrawing(ctx, obj as CanvasDrawing, isSelected);
        break;
      case 'shape':
        renderShape(ctx, obj as CanvasShape, isSelected);
        break;
      case 'text':
        renderText(ctx, obj as CanvasText, isSelected);
        break;
      case 'sticky':
        renderSticky(ctx, obj, isSelected);
        break;
    }

    ctx.restore();
  };

  const renderDrawing = (ctx: CanvasRenderingContext2D, drawing: CanvasDrawing, isSelected: boolean) => {
    if (drawing.points.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = drawing.stroke;
    ctx.lineWidth = drawing.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i < drawing.points.length; i += 2) {
      if (i === 0) {
        ctx.moveTo(drawing.points[i], drawing.points[i + 1]);
      } else {
        ctx.lineTo(drawing.points[i], drawing.points[i + 1]);
      }
    }

    ctx.stroke();

    // Draw selection outline
    if (isSelected) {
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2 / viewport.scale;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(drawing.x, drawing.y, drawing.width, drawing.height);
      ctx.setLineDash([]);
    }
  };

  const renderShape = (ctx: CanvasRenderingContext2D, shape: CanvasShape, isSelected: boolean) => {
    ctx.fillStyle = shape.fill;
    ctx.strokeStyle = shape.stroke;
    ctx.lineWidth = shape.strokeWidth;

    if (shape.shapeType === 'rectangle') {
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.shapeType === 'circle') {
      const centerX = shape.x + shape.width / 2;
      const centerY = shape.y + shape.height / 2;
      const radius = Math.min(shape.width, shape.height) / 2;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    if (isSelected) {
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2 / viewport.scale;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      ctx.setLineDash([]);
    }
  };

  const renderText = (ctx: CanvasRenderingContext2D, text: CanvasText, isSelected: boolean) => {
    ctx.fillStyle = text.color;
    ctx.font = `${text.fontSize}px ${text.fontFamily}`;
    ctx.textAlign = text.align;
    ctx.textBaseline = 'top';
    
    const x = text.align === 'center' ? text.x + text.width / 2 : text.align === 'right' ? text.x + text.width : text.x;
    ctx.fillText(text.content, x, text.y);

    if (isSelected) {
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2 / viewport.scale;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(text.x, text.y, text.width, text.height);
      ctx.setLineDash([]);
    }
  };

  const renderSticky = (ctx: CanvasRenderingContext2D, sticky: any, isSelected: boolean) => {
    // Draw sticky note
    ctx.fillStyle = sticky.color || '#fef08a';
    ctx.fillRect(sticky.x, sticky.y, sticky.width, sticky.height);
    
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.strokeRect(sticky.x, sticky.y, sticky.width, sticky.height);

    // Draw content
    ctx.fillStyle = '#000';
    ctx.font = '14px system-ui';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    const lines = sticky.content.split('\n');
    lines.forEach((line: string, i: number) => {
      ctx.fillText(line, sticky.x + 10, sticky.y + 30 + i * 20);
    });

    // Draw emoji
    ctx.font = '24px system-ui';
    ctx.fillText(sticky.emoji || '📝', sticky.x + 10, sticky.y + 5);

    if (isSelected) {
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2 / viewport.scale;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(sticky.x, sticky.y, sticky.width, sticky.height);
      ctx.setLineDash([]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'draw') {
      // Drawing mode
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left - viewport.x) / viewport.scale;
      const y = (e.clientY - rect.top - viewport.y) / viewport.scale;

      setIsMouseDown(true);
      setCurrentPath([x, y]);
      useCanvasStore.getState().setIsDrawing(true);
    } else if (tool === 'select') {
      // Selection mode
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left - viewport.x) / viewport.scale;
      const y = (e.clientY - rect.top - viewport.y) / viewport.scale;

      // Check if clicked on any object (in reverse order for top-most first)
      const objectsArray = Array.from(objects.values()).sort((a, b) => b.zIndex - a.zIndex);
      let clickedObject = null;

      for (const obj of objectsArray) {
        if (x >= obj.x && x <= obj.x + obj.width && y >= obj.y && y <= obj.y + obj.height) {
          clickedObject = obj;
          break;
        }
      }

      if (clickedObject) {
        const isMultiSelect = e.shiftKey || e.ctrlKey || e.metaKey;
        useCanvasStore.getState().selectObject(clickedObject.id, isMultiSelect);
      } else {
        // Clicked on empty space - deselect all
        useCanvasStore.getState().deselectAll();
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseDown || tool !== 'draw') return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - viewport.x) / viewport.scale;
    const y = (e.clientY - rect.top - viewport.y) / viewport.scale;

    setCurrentPath((prev) => [...prev, x, y]);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'draw') {
      if (!isMouseDown || currentPath.length < 4) {
        setIsMouseDown(false);
        setCurrentPath([]);
        useCanvasStore.getState().setIsDrawing(false);
        return;
      }

      // Calculate bounding box
      const xs = currentPath.filter((_, i) => i % 2 === 0);
      const ys = currentPath.filter((_, i) => i % 2 === 1);
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      const maxX = Math.max(...xs);
      const maxY = Math.max(...ys);

      // Normalize points relative to bounding box
      const normalizedPoints = currentPath.map((val, i) => {
        return i % 2 === 0 ? val - minX : val - minY;
      });

      // Create drawing object
      const drawing: CanvasDrawing = {
        id: `drawing-${Date.now()}`,
        type: 'drawing',
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
        rotation: 0,
        zIndex: Date.now(),
        locked: false,
        createdBy: 'current-user',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        points: normalizedPoints,
        stroke: '#a855f7',
        strokeWidth: 3,
      };

      // Add to store and board
      useCanvasStore.getState().addObject(drawing);
      
      const currentBoard = useBoardStore.getState().currentBoard;
      if (currentBoard) {
        useBoardStore.getState().setCurrentBoard({
          ...currentBoard,
          objects: [...currentBoard.objects, drawing],
        });
      }

      setIsMouseDown(false);
      setCurrentPath([]);
      useCanvasStore.getState().setIsDrawing(false);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ cursor: tool === 'draw' ? 'crosshair' : tool === 'select' ? 'default' : 'default' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
}
