'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBoardStore } from '@/lib/store/board-store';
import { useCanvasStore } from '@/lib/store/canvas-store';
import { Toolbar } from '@/components/layout/Toolbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ThemeSelector } from '@/components/layout/ThemeSelector';
import { QuickGuide } from '@/components/layout/QuickGuide';
import { InfiniteCanvas } from '@/components/canvas/InfiniteCanvas';
import { Board } from '@/types/board';
import { CanvasObject } from '@/types/canvas';

interface BoardPageProps {
  params: {
    id: string;
  };
}

export default function BoardPage({ params }: BoardPageProps) {
  const { currentBoard, setCurrentBoard } = useBoardStore();
  const { objects } = useCanvasStore();

  useEffect(() => {
    // Initialize board immediately without delay
    if (!currentBoard || currentBoard.id !== params.id) {
      const newBoard: Board = {
        id: params.id,
        name: 'Untitled Board',
        ownerId: 'current-user',
        objects: [] as CanvasObject[],
        theme: 'cosmic-glass' as const,
        isPublic: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastAccessedAt: Date.now(),
      };
      setCurrentBoard(newBoard);
      
      // Load objects in the same tick
      const canvasStore = useCanvasStore.getState();
      newBoard.objects.forEach((obj) => {
        if (!canvasStore.objects.has(obj.id)) {
          canvasStore.addObject(obj);
        }
      });
    }
  }, [params.id]);

  // Sync board objects to canvas - only if needed
  useEffect(() => {
    if (currentBoard && currentBoard.id === params.id && currentBoard.objects.length > 0) {
      const canvasStore = useCanvasStore.getState();
      let needsUpdate = false;
      
      currentBoard.objects.forEach((obj) => {
        if (!canvasStore.objects.has(obj.id)) {
          needsUpdate = true;
        }
      });
      
      if (needsUpdate) {
        currentBoard.objects.forEach((obj) => {
          if (!canvasStore.objects.has(obj.id)) {
            canvasStore.addObject(obj);
          }
        });
      }
    }
  }, [currentBoard, params.id]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">
      <InfiniteCanvas />

      <Toolbar />
      <Sidebar />
      <QuickGuide />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute top-6 right-6 z-40"
      >
        <ThemeSelector />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute top-20 left-8 z-30"
      >
        <div className="glass-panel px-6 py-3">
          <h1 className="text-lg font-semibold text-slate-100">
            {currentBoard?.name || 'Loading...'}
          </h1>
          <p className="text-sm text-slate-400">Ready to collaborate</p>
        </div>
      </motion.div>
    </div>
  );
}
