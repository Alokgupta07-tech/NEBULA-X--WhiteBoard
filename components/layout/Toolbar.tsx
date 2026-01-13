'use client';

import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCanvasStore } from '@/lib/store/canvas-store';
import {
  MousePointer2,
  Square,
  Circle,
  Zap,
  Type,
  Pencil,
  Trash2,
  Copy,
  Undo2,
  Redo2,
  Home,
  MoreVertical,
  StickyNote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

const TOOLS = [
  { id: 'select', label: 'Select', icon: MousePointer2, shortcut: 'V' },
  { id: 'draw', label: 'Draw', icon: Pencil, shortcut: 'D' },
  { id: 'shape', label: 'Rectangle', icon: Square, shortcut: 'R' },
  { id: 'circle', label: 'Circle', icon: Circle, shortcut: 'O' },
  { id: 'text', label: 'Text', icon: Type, shortcut: 'T' },
  { id: 'sticky', label: 'Sticky Note', icon: StickyNote, shortcut: 'S' },
];

const ACTIONS = [
  { id: 'delete', label: 'Delete', icon: Trash2, shortcut: 'Del', action: 'delete' },
  { id: 'copy', label: 'Duplicate', icon: Copy, shortcut: 'Ctrl+D', action: 'duplicate' },
];

export function Toolbar() {
  const { tool, setTool, selectedIds, getSelectedObjects } = useCanvasStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete key
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selected = getSelectedObjects();
        if (selected.length > 0) {
          e.preventDefault();
          useCanvasStore.getState().deleteObjects(Array.from(selectedIds));
          toast.success(`Deleted ${selected.length} object(s)`);
        }
      }

      // Duplicate key (Ctrl+D)
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        const selected = getSelectedObjects();
        if (selected.length > 0) {
          selected.forEach((obj) => {
            const newObj = {
              ...obj,
              id: `${obj.type}-${Date.now()}-${Math.random()}`,
              x: obj.x + 20,
              y: obj.y + 20,
              zIndex: Date.now(),
            };
            useCanvasStore.getState().addObject(newObj);
          });
          toast.success(`Duplicated ${selected.length} object(s)`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, getSelectedObjects]);

  const handleActionClick = (actionId: string) => {
    const selected = getSelectedObjects();
    
    if (actionId === 'delete') {
      if (selected.length > 0) {
        useCanvasStore.getState().deleteObjects(Array.from(selectedIds));
        toast.success(`Deleted ${selected.length} object(s)`);
      } else {
        toast.error('No objects selected');
      }
    } else if (actionId === 'duplicate') {
      if (selected.length > 0) {
        selected.forEach((obj) => {
          const newObj = {
            ...obj,
            id: `${obj.type}-${Date.now()}-${Math.random()}`,
            x: obj.x + 20,
            y: obj.y + 20,
            zIndex: Date.now(),
          };
          useCanvasStore.getState().addObject(newObj);
        });
        toast.success(`Duplicated ${selected.length} object(s)`);
      } else {
        toast.error('No objects selected');
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.01,
        delayChildren: 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.15 } },
  };

  return (
    <TooltipProvider>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-center gap-1 px-4 py-3 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-slate-700/30 shadow-2xl">
          <motion.div variants={itemVariants} className="flex items-center gap-1 pr-3 border-r border-slate-700/30">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-slate-700/50 text-slate-300 hover:text-slate-100"
                >
                  <Home className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Home
              </TooltipContent>
            </Tooltip>
          </motion.div>

          <div className="flex items-center gap-1">
            {TOOLS.map((t, idx) => (
              <motion.div key={t.id} variants={itemVariants}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={tool === t.id ? 'default' : 'ghost'}
                      onClick={() => setTool(t.id as any)}
                      className={`h-8 w-8 transition-all ${
                        tool === t.id
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'hover:bg-slate-700/50 text-slate-300 hover:text-slate-100'
                      }`}
                    >
                      <t.icon className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <div>{t.label}</div>
                    <div className="text-slate-400">{t.shortcut}</div>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="flex items-center gap-1 pl-3 border-l border-slate-700/30">
            {ACTIONS.map((action) => (
              <Tooltip key={action.id}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleActionClick(action.id)}
                    className="h-8 w-8 hover:bg-slate-700/50 text-slate-400 hover:text-slate-200"
                  >
                    <action.icon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  <div>{action.label}</div>
                  <div className="text-slate-400">{action.shortcut}</div>
                </TooltipContent>
              </Tooltip>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-1 pl-3 border-l border-slate-700/30">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-slate-700/50 text-slate-300 hover:text-slate-100"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                More options
              </TooltipContent>
            </Tooltip>
          </motion.div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
