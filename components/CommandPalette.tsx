'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Mail, Globe, Github, Terminal, ArrowRight, X } from 'lucide-react';
import projectsData from '@/content/projects.json';
import { Project } from '@/types/project';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const projects = projectsData as Project[];

  const toggle = useCallback(() => setOpen((o) => !open), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  const copyEmail = () => {
    navigator.clipboard.writeText('matheodelaunay04@gmail.com');
    alert('Email copied to clipboard');
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center px-4 border-b border-zinc-800">
                <Search className="w-5 h-5 text-zinc-500" />
                <input
                  autoFocus
                  placeholder="Search projects or commands..."
                  className="w-full bg-transparent border-none outline-none py-4 px-4 text-zinc-100 placeholder:text-zinc-600 font-mono text-sm"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800 rounded border border-zinc-700 text-[10px] font-mono text-zinc-400">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
                {/* Quick Actions */}
                <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Actions</div>
                <button
                  onClick={copyEmail}
                  className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/5 rounded-xl transition-colors text-zinc-400 hover:text-zinc-100 group text-left"
                >
                  <Mail className="w-4 h-4" />
                  <span className="flex-1 text-sm font-mono uppercase tracking-wider">Copy Email</span>
                  <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 tracking-widest">Enter</span>
                </button>

                <div className="px-3 py-2 mt-4 text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Projects</div>
                {filteredProjects.map((project) => (
                  <a
                    key={project.id}
                    href={project.link}
                    target="_blank"
                    className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/5 rounded-xl transition-colors text-zinc-400 hover:text-zinc-100 group text-left"
                  >
                    <Terminal className="w-4 h-4" />
                    <span className="flex-1 text-sm font-mono uppercase tracking-wider">{project.title}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </a>
                ))}
              </div>

              <div className="px-4 py-3 bg-zinc-950/50 border-t border-zinc-800 flex justify-between items-center text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                <span>Navigate with ↑↓</span>
                <span>ESC to close</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
