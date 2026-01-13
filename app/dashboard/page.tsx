'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Search, MoreVertical, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBoardStore } from '@/lib/store/board-store';

const SAMPLE_BOARDS = [
  {
    id: '1',
    name: 'Product Roadmap Q1',
    description: 'Strategic planning for next quarter',
    thumbnail: null,
    collaborators: 5,
    lastModified: '2 hours ago',
  },
  {
    id: '2',
    name: 'Design System Brainstorm',
    description: 'Component architecture discussion',
    thumbnail: null,
    collaborators: 3,
    lastModified: 'Yesterday',
  },
  {
    id: '3',
    name: 'Team Retrospective',
    description: 'Sprint feedback and improvements',
    thumbnail: null,
    collaborators: 8,
    lastModified: '3 days ago',
  },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { boards } = useBoardStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <nav className="border-b border-slate-700/30 backdrop-blur-xl bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                <span className="text-2xl font-bold text-white">◆</span>
              </div>
              <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                NebulaBoard
              </h1>
            </div>

            <Link href="/">
              <Button
                variant="outline"
                className="bg-slate-800/50 border-slate-700/30 hover:bg-slate-800"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-100 mb-2">Your Boards</h2>
            <p className="text-slate-400">Create and manage your collaborative workspaces</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex gap-4 mb-8"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-slate-900/50 border-slate-700/30 focus:border-purple-500/50"
              />
            </div>

            <Link href={`/board/${Date.now()}`} prefetch={false}>
              <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Plus className="w-4 h-4" />
                New Board
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {SAMPLE_BOARDS.map((board) => (
              <motion.div
                key={board.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Link href={`/board/${board.id}`} prefetch={true}>
                  <div className="glass-panel p-6 cursor-pointer hover:border-purple-500/50 transition-all h-full flex flex-col justify-between">
                    <div>
                      <div className="h-32 mb-4 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 flex items-center justify-center group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all">
                        <span className="text-3xl opacity-50">◆</span>
                      </div>

                      <h3 className="text-lg font-semibold text-slate-100 mb-2 group-hover:text-purple-400 transition-colors">
                        {board.name}
                      </h3>
                      <p className="text-sm text-slate-400">{board.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/30 mt-4">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {board.lastModified}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {board.collaborators}
                        </div>
                      </div>

                      <button className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center py-12 border-t border-slate-700/30"
          >
            <p className="text-slate-400 mb-6">Ready to create something amazing?</p>
            <Link href={`/board/${Date.now()}`}>
              <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Plus className="w-4 h-4" />
                Start New Board
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
