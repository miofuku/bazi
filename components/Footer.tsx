import React from 'react';
import { Sprig } from './Sprig';

export const Footer: React.FC = () => (
  <footer className="border-t border-black/5 py-20 bg-mist relative overflow-hidden">
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-56 bg-sage/5 blur-[120px] pointer-events-none"></div>

    <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
      <span className="text-sage mb-8"><Sprig className="w-12 h-12" /></span>

      <h3 className="text-2xl font-display font-semibold text-ink mb-2 tracking-tight">Rootwise</h3>
      <p className="text-[10px] uppercase tracking-[0.5em] text-sage-deep mb-12 font-semibold">Your nature, by season</p>

      <p className="text-sm text-stone max-w-md leading-relaxed mb-4">
        A quiet space for self-reflection — a way to understand your temperament and grow in tune with it.
      </p>
      <p className="text-xs text-stone/70 italic max-w-md leading-relaxed mb-12">
        Rooted in xiàngfǎ — an old Chinese way of seeing a person as part of nature.
      </p>

      <div className="w-full pt-10 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-stone uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Rootwise · made with care for human nature
        </p>
        <p className="text-[10px] text-stone uppercase tracking-widest">Your nature, by season</p>
      </div>
    </div>
  </footer>
);
