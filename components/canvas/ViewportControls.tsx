'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ViewportControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitToScreen: () => void;
}

export function ViewportControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitToScreen,
}: ViewportControlsProps) {
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  const zoomPercentage = Math.round(zoom * 100);

  return (
    <TooltipProvider>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="fixed bottom-6 right-6 z-40"
      >
        <div className="flex flex-col gap-2 p-3 rounded-lg bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-slate-700/30 shadow-2xl">
          <motion.div variants={itemVariants}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onZoomIn}
                  className="h-8 w-8 hover:bg-slate-700/50 text-slate-300 hover:text-slate-100"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Zoom In</TooltipContent>
            </Tooltip>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="px-2 py-1 text-xs font-semibold text-slate-400 text-center min-w-[3rem]"
          >
            {zoomPercentage}%
          </motion.div>

          <motion.div variants={itemVariants}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onZoomOut}
                  className="h-8 w-8 hover:bg-slate-700/50 text-slate-300 hover:text-slate-100"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Zoom Out</TooltipContent>
            </Tooltip>
          </motion.div>

          <div className="w-8 h-px bg-slate-700/30" />

          <motion.div variants={itemVariants}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onResetZoom}
                  className="h-8 w-8 hover:bg-slate-700/50 text-slate-300 hover:text-slate-100"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Reset View</TooltipContent>
            </Tooltip>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onFitToScreen}
                  className="h-8 w-8 hover:bg-slate-700/50 text-slate-300 hover:text-slate-100"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Fit to Screen</TooltipContent>
            </Tooltip>
          </motion.div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
