'use client';

import React, { useState } from 'react';
import { useCanvasStore } from '@/lib/store/canvas-store';
import { useBoardStore } from '@/lib/store/board-store';
import { CanvasSticky, CanvasText } from '@/types/canvas';

interface TextAndStickyCreatorProps {
  viewport: { x: number; y: number; scale: number };
}

export function TextAndStickyCreator({ viewport }: TextAndStickyCreatorProps) {
  const { tool } = useCanvasStore();
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tool !== 'text' && tool !== 'sticky') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - viewport.x) / viewport.scale;
    const y = (e.clientY - rect.top - viewport.y) / viewport.scale;

    if (tool === 'sticky') {
      createSticky(x, y);
    } else if (tool === 'text') {
      createText(x, y);
    }
  };

  const createSticky = (x: number, y: number) => {
    const sticky: CanvasSticky = {
      id: `sticky-${Date.now()}`,
      type: 'sticky',
      x,
      y,
      width: 200,
      height: 200,
      rotation: 0,
      zIndex: Date.now(),
      locked: false,
      createdBy: 'current-user',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      content: 'Double-click to edit...',
      emoji: '📝',
      color: '#fef08a',
    };

    useCanvasStore.getState().addObject(sticky);

    const currentBoard = useBoardStore.getState().currentBoard;
    if (currentBoard) {
      useBoardStore.getState().setCurrentBoard({
        ...currentBoard,
        objects: [...currentBoard.objects, sticky],
      });
    }
  };

  const createText = (x: number, y: number) => {
    const text: CanvasText = {
      id: `text-${Date.now()}`,
      type: 'text',
      x,
      y,
      width: 300,
      height: 50,
      rotation: 0,
      zIndex: Date.now(),
      locked: false,
      createdBy: 'current-user',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      content: 'Click to edit text...',
      fontSize: 24,
      fontFamily: 'system-ui',
      color: '#e2e8f0',
      align: 'left',
    };

    useCanvasStore.getState().addObject(text);

    const currentBoard = useBoardStore.getState().currentBoard;
    if (currentBoard) {
      useBoardStore.getState().setCurrentBoard({
        ...currentBoard,
        objects: [...currentBoard.objects, text],
      });
    }
  };

  if (tool !== 'text' && tool !== 'sticky') {
    return null;
  }

  return (
    <div
      className="absolute inset-0 pointer-events-auto"
      style={{ cursor: 'crosshair' }}
      onClick={handleCanvasClick}
    />
  );
}
