'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <main className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-sm font-medium text-slate-400">
              Welcome to NebulaBoard X
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text">
              Infinite Canvas
            </span>
            <br />
            <span className="text-slate-100">for Creative Collaboration</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Real-time collaborative whiteboard with infinite canvas, smart connectors,
            and stunning visual effects. Built for teams that think big.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard" prefetch={true}>
              <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 bg-slate-900/50 border-slate-700/30 hover:bg-slate-800"
            >
              Learn More
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            {[
              {
                icon: <Zap className="w-6 h-6 text-yellow-400" />,
                title: 'Real-Time Sync',
                description: 'See updates instantly as teammates collaborate',
              },
              {
                icon: <Sparkles className="w-6 h-6 text-purple-400" />,
                title: 'Smart Connectors',
                description: 'Auto-routing connectors with magnetic anchors',
              },
              {
                icon: <ArrowRight className="w-6 h-6 text-pink-400" />,
                title: 'Timeline Replay',
                description: 'Watch collaboration history unfold step by step',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="glass-panel p-6 group hover:border-purple-500/50 transition-all"
              >
                <div className="flex justify-center mb-4 p-3 rounded-lg bg-slate-900/50 group-hover:bg-gradient-to-r group-hover:from-purple-600/10 group-hover:to-pink-600/10 w-fit mx-auto transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-slate-400"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>
    </main>
  );
}
