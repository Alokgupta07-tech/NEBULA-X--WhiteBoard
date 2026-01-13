'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Layers, Users, Clock, Settings, Download, Save, FileImage, FileJson, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCanvasStore } from '@/lib/store/canvas-store';
import { useBoardStore } from '@/lib/store/board-store';
import { toast } from 'sonner';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('layers');
  const { objects, selectedIds, getSelectedObjects } = useCanvasStore();
  const { currentBoard } = useBoardStore();

  const objectCount = objects.size;
  const selectedCount = selectedIds.size;

  const SIDEBAR_ITEMS: SidebarItem[] = [
    { id: 'layers', label: 'Layers', icon: <Layers className="w-5 h-5" />, count: objectCount },
    { id: 'members', label: 'Members', icon: <Users className="w-5 h-5" />, count: 1 },
    { id: 'history', label: 'History', icon: <Clock className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const exportAsImage = async () => {
    try {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) {
        toast.error('No canvas found to export');
        return;
      }

      // Create a temporary canvas to export
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) return;

      tempCanvas.width = 2000;
      tempCanvas.height = 2000;

      // Fill background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw the current canvas content
      ctx.drawImage(canvas, 0, 0);

      // Convert to blob and download
      tempCanvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentBoard?.name || 'board'}-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Board exported as image!');
      });
    } catch (error) {
      toast.error('Failed to export board');
      console.error(error);
    }
  };

  const exportAsJSON = () => {
    try {
      const data = {
        board: currentBoard,
        objects: Array.from(objects.values()),
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentBoard?.name || 'board'}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Board exported as JSON!');
    } catch (error) {
      toast.error('Failed to export board');
      console.error(error);
    }
  };

  const saveAsTemplate = () => {
    try {
      const template = {
        name: `${currentBoard?.name || 'Template'} - Template`,
        objects: Array.from(objects.values()),
        createdAt: new Date().toISOString(),
      };

      const templates = JSON.parse(localStorage.getItem('board-templates') || '[]');
      templates.push(template);
      localStorage.setItem('board-templates', JSON.stringify(templates));
      toast.success('Template saved successfully!');
    } catch (error) {
      toast.error('Failed to save template');
      console.error(error);
    }
  };

  const clearBoard = () => {
    if (confirm('Are you sure you want to clear the entire board?')) {
      const objectIds = Array.from(objects.keys());
      useCanvasStore.getState().deleteObjects(objectIds);
      toast.success('Board cleared!');
    }
  };

  const deleteSelected = () => {
    const selected = getSelectedObjects();
    if (selected.length === 0) {
      toast.error('No objects selected');
      return;
    }

    if (confirm(`Delete ${selected.length} selected object(s)?`)) {
      useCanvasStore.getState().deleteObjects(Array.from(selectedIds));
      toast.success(`Deleted ${selected.length} object(s)`);
    }
  };

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 20, stiffness: 300 },
    },
    exit: {
      x: -300,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        type: 'spring',
        damping: 20,
      },
    }),
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-slate-700/30 hover:border-slate-600/50 text-slate-300 hover:text-slate-100 transition-colors shadow-2xl"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sidebarVariants}
              className="fixed top-0 left-0 h-full w-72 z-40 bg-gradient-to-br from-slate-900 to-slate-950 border-r border-slate-700/30 shadow-2xl"
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-8 pt-4">
                  <h2 className="text-lg font-semibold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                    Board
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-slate-800/50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <nav className="flex-1 space-y-2">
                  {SIDEBAR_ITEMS.map((item, idx) => (
                    <motion.button
                      key={item.id}
                      custom={idx}
                      variants={itemVariants}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveItem(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        activeItem === item.id
                          ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-slate-100 border border-purple-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-semibold text-white">
                          {item.count}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </nav>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="pt-6 border-t border-slate-700/30 space-y-3"
                >
                  <div className="text-xs text-slate-400 font-medium mb-2">
                    {selectedCount > 0 ? `${selectedCount} selected` : `${objectCount} objects`}
                  </div>

                  <Button 
                    onClick={saveAsTemplate}
                    className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Save className="w-4 h-4" />
                    Save as Template
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={exportAsImage}
                      variant="outline" 
                      className="gap-2 bg-slate-800/50 border-slate-700/30 hover:bg-slate-800"
                    >
                      <FileImage className="w-4 h-4" />
                      PNG
                    </Button>
                    <Button 
                      onClick={exportAsJSON}
                      variant="outline" 
                      className="gap-2 bg-slate-800/50 border-slate-700/30 hover:bg-slate-800"
                    >
                      <FileJson className="w-4 h-4" />
                      JSON
                    </Button>
                  </div>

                  <Button 
                    onClick={deleteSelected}
                    disabled={selectedCount === 0}
                    variant="outline" 
                    className="w-full gap-2 bg-slate-800/50 border-slate-700/30 hover:bg-red-900/30 hover:border-red-700/50 hover:text-red-400 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected
                  </Button>

                  <Button 
                    onClick={clearBoard}
                    variant="outline" 
                    className="w-full gap-2 bg-slate-800/50 border-slate-700/30 hover:bg-red-900/30 hover:border-red-700/50 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Board
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
