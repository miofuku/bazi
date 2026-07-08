import React from 'react';
import { StoryBeat, StoryArt } from '../../content/xiangfa/narrative';
import { NatureArt } from '../illustrations/NatureArt';
import { ForceArt } from '../illustrations/ForceArt';
import { useAccent } from './AtmosphereContext';

const InlineIcon: React.FC<{ kind: StoryArt['kind']; color: string }> = ({ kind, color }) => {
  const p = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (kind === 'tension') return <svg {...p}><path d="M9 6L4 12l5 6" /><path d="M15 6l5 6-5 6" /></svg>;
  if (kind === 'decades') return <svg {...p}><path d="M3 12h18" /><circle cx="6" cy="12" r="1.6" fill={color} stroke="none" /><circle cx="12" cy="12" r="1.6" fill={color} stroke="none" /><circle cx="18" cy="12" r="1.6" fill={color} stroke="none" /></svg>;
  return <svg {...p}><path d="M5 12c0-4 4-4 7-2s7 2 7-2M5 12c0 4 4 4 7 2s7-2 7 2" /></svg>; // thread
};

const NodeArt: React.FC<{ art: StoryArt; accent: string }> = ({ art, accent }) => {
  const cls = 'h-14 w-14 shrink-0';
  if (art.kind === 'nature' && art.symbol) return <NatureArt id={art.symbol} accent={accent} className={cls} />;
  if (art.kind === 'force' && art.element !== undefined) return <ForceArt element={art.element} className={cls} />;
  return (
    <span className={`grid ${cls} place-items-center rounded-full`} style={{ background: `${accent}14` }}>
      <InlineIcon kind={art.kind} color={accent} />
    </span>
  );
};

// "Your story" — the synthesis as one illustrated line: a node per beat, strung
// together down a single thread.
export const Storyline: React.FC<{ beats: StoryBeat[] }> = ({ beats }) => {
  const { accent, accentDeep } = useAccent();
  return (
    <section className="rounded-3xl bg-white/45 p-8 ring-1 ring-ink/5 shadow-lift md:p-12">
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: accentDeep }}>Your story</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">One line, from root to canopy</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/60">
        None of the above is a separate verdict. They're the bricks of a single life — here is how they stack into one growing thing.
      </p>

      <div className="mt-10">
        {beats.map((b, i) => (
          <div key={i} className="flex gap-5 pb-10 last:pb-0 sm:gap-6">
            <div className="flex flex-col items-center">
              <NodeArt art={b.art} accent={accent} />
              {i < beats.length - 1 && <div className="mt-2 w-px flex-1" style={{ background: `${accent}33` }} />}
            </div>
            <p className="flex-1 pt-2 text-[1.0625rem] leading-relaxed text-ink/85">{b.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
