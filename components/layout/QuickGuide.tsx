'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, Mouse, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QuickGuide() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenQuickGuide');
    if (!hasSeenGuide) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenQuickGuide', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl"
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2">
                    Quick Start Guide
                  </h2>
                  <p className="text-slate-400">Get started with your infinite canvas</p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="glass-panel p-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
                    <Mouse className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2">Drawing Tools</h3>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Click toolbar icons to select tools</li>
                    <li>• Draw freehand with pencil</li>
                    <li>• Create shapes by dragging</li>
                    <li>• Click to add text/sticky notes</li>
                  </ul>
                </div>

                <div className="glass-panel p-4">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center mb-3">
                    <Keyboard className="w-5 h-5 text-pink-400" />
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2">Keyboard Shortcuts</h3>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• <kbd className="text-xs bg-slate-800 px-1 rounded">V</kbd> Select</li>
                    <li>• <kbd className="text-xs bg-slate-800 px-1 rounded">D</kbd> Draw</li>
                    <li>• <kbd className="text-xs bg-slate-800 px-1 rounded">R</kbd> Rectangle</li>
                    <li>• <kbd className="text-xs bg-slate-800 px-1 rounded">S</kbd> Sticky Note</li>
                    <li>• <kbd className="text-xs bg-slate-800 px-1 rounded">Del</kbd> Delete</li>
                  </ul>
                </div>

                <div className="glass-panel p-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2">Navigation</h3>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Middle-click + drag to pan</li>
                    <li>• Scroll to zoom</li>
                    <li>• Shift+Click for multi-select</li>
                    <li>• Ctrl+D to duplicate</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleClose}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Got it, let's start!
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
