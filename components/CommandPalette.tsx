'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import projectsData from '@/content/projects.json';
import { Project } from '@/types/project';

const { Search, Command, Mail, Globe, Terminal, ArrowRight, X } = Icons;
const Github = (Icons as any).Github || (Icons as any).GithubIcon || (Icons as any).Code;
const Linkedin = (Icons as any).Linkedin || (Icons as any).LinkedinIcon || (Icons as any).Share2;
const SunMoon = (Icons as any).SunMoon || (Icons as any).Sun || (Icons as any).Moon;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const projects = projectsData as Project[];

  // Scroll Lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const copyEmail = () => {
    navigator.clipboard.writeText('matheodelaunay04@gmail.com');
    setOpen(false);
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    setOpen(false);
  };

  const actions = [
    {
      id: 'copy-email',
      title: 'Copy Email',
      icon: Mail,
      onSelect: copyEmail,
    },
    {
      id: 'github',
      title: 'Go to GitHub',
      icon: Github,
      onSelect: () => {
        window.open('https://github.com/D-Seonay', '_blank');
        setOpen(false);
      },
    },
    {
      id: 'linkedin',
      title: 'Go to LinkedIn',
      icon: Linkedin,
      onSelect: () => {
        window.open('https://www.linkedin.com/in/matheo-delaunay/', '_blank');
        setOpen(false);
      },
    },
    {
      id: 'toggle-theme',
      title: 'Toggle Theme',
      icon: SunMoon,
      onSelect: toggleTheme,
    },
  ];

  const filteredActions = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  const allItems = [
    ...filteredActions.map(a => ({ ...a, type: 'action' as const })),
    ...filteredProjects.map(p => ({ 
      id: p.id.toString(), 
      title: p.title, 
      icon: Terminal, 
      onSelect: () => {
        window.open(p.link, '_blank');
        setOpen(false);
      },
      type: 'project' as const
    })),
  ];

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      
      if (!open) return;

      if (e.key === 'Escape') {
        setOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % allItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        allItems[activeIndex]?.onSelect();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, allItems, activeIndex]);

  // Ensure active item is visible in scroll container
  useEffect(() => {
    if (open && scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[var(--bg)] border border-[var(--card-border)] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center px-4 border-b border-[var(--card-border)]">
                <Search className="w-5 h-5 text-[var(--meta)]" />
                <input
                  autoFocus
                  placeholder="Search projects or commands..."
                  className="w-full bg-transparent border-none outline-none py-4 px-4 text-[var(--fg)] placeholder:text-[var(--meta)] font-mono text-sm"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--accent)] rounded border border-[var(--card-border)] text-[10px] font-mono text-[var(--meta)]">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </div>

              <div 
                ref={scrollContainerRef}
                className="max-h-[400px] overflow-y-auto p-2 scrollbar-hide"
              >
                {allItems.length > 0 ? (
                  allItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = index === activeIndex;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={item.onSelect}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left group ${
                          isActive 
                            ? 'bg-zinc-800/80 text-[var(--fg)] translate-x-1' 
                            : 'text-[var(--meta)] hover:bg-[var(--accent)] hover:text-[var(--fg)]'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--accent)]' : ''}`} />
                        <span className="flex-1 text-sm font-mono uppercase tracking-wider">{item.title}</span>
                        {item.type === 'project' ? (
                          <ArrowRight className={`w-4 h-4 transition-all ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                        ) : (
                          <span className={`text-[10px] font-mono tracking-widest transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                            Enter
                          </span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-8 text-center text-[var(--meta)] font-mono text-xs uppercase tracking-widest">
                    No results found for "{query}"
                  </div>
                )}
              </div>

              <div className="px-4 py-3 bg-[var(--bg)] border-t border-[var(--card-border)] flex justify-between items-center text-[10px] font-mono text-[var(--meta)] uppercase tracking-widest">
                <div className="flex gap-4">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                </div>
                <span>ESC to close</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
