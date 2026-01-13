'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme/theme-provider';
import { Moon, Sun, Palette } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ThemeType } from '@/types/board';

const THEMES: { value: ThemeType; label: string; description: string }[] = [
  { value: 'cosmic-glass', label: 'Cosmic Glass', description: 'Dark nebula with glassmorphism' },
  { value: 'minimal-pro', label: 'Minimal Pro', description: 'Clean and professional' },
  { value: 'cyber-motion', label: 'Cyber Motion', description: 'Futuristic neon vibes' },
];

export function ThemeSelector() {
  const { theme, setTheme, isDark, setIsDark } = useTheme();

  return (
    <DropdownMenu>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-slate-800/50 border-slate-700/30 hover:bg-slate-800 hover:border-slate-600/50"
          >
            <Palette className="w-4 h-4" />
            Theme
          </Button>
        </DropdownMenuTrigger>
      </motion.div>

      <DropdownMenuContent align="end" className="w-56 bg-slate-900/95 border-slate-700/30 backdrop-blur-xl">
        <DropdownMenuGroup>
          <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase">Themes</div>
          {THEMES.map((t) => (
            <DropdownMenuCheckboxItem
              key={t.value}
              checked={theme === t.value}
              onCheckedChange={() => setTheme(t.value)}
              className="cursor-pointer"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{t.label}</span>
                <span className="text-xs text-slate-400">{t.description}</span>
              </div>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-slate-700/20" />

        <DropdownMenuGroup>
          <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase">Appearance</div>
          <DropdownMenuCheckboxItem
            checked={isDark}
            onCheckedChange={(checked) => setIsDark(checked)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
