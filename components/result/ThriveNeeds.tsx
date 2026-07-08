import React from 'react';
import { NeedStatus } from '../../content/xiangfa';
import { ForceArt } from '../illustrations/ForceArt';
import { useAccent } from './AtmosphereContext';

// "What helps you grow" — the living thing's needs, ordered by what the season
// makes most urgent, mirrored to a human life and marked against the chart.
export const ThriveNeeds: React.FC<{ needStatus: NeedStatus[]; natureName: string }> = ({ needStatus, natureName }) => {
  const { accentDeep } = useAccent();

  // A fixed three-tone scale — clay (seek out) · stone (some) · green (plenty) —
  // decoupled from the element accent so the three read as distinct categories
  // in every reading, not near-identical shades of one colour.
  const statusMeta = (status: NeedStatus['status']) => {
    switch (status) {
      case 'scarce':
        return { label: 'Could use more', level: 1, style: { background: 'rgba(178,85,57,0.16)', color: '#A2472A' }, note: 'This is thin in your makeup right now — the thing most worth seeking out.' };
      case 'abundant':
        return { label: 'Runs deep', level: 3, style: { background: 'rgba(74,103,65,0.18)', color: '#3C5834' }, note: 'Already abundant in you — a natural strength to lean on.' };
      default:
        return { label: 'You have some', level: 2, style: { background: 'rgba(78,90,84,0.13)', color: '#4C574F' }, note: 'Present in fair measure — keep it close.' };
    }
  };

  const article = /^[aeiou]/i.test(natureName.replace(/^The\s+/i, '')) ? 'an' : 'a';
  const shortName = natureName.replace(/^The\s+/i, '').toLowerCase();

  return (
    <section>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: accentDeep }}>What helps you grow</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">The conditions you flourish in</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
        Just as {article} {shortName} needs the right light, water, and ground to thrive, a person grows toward certain things. These are yours — in the order this season calls for them, and how much of each your life already holds.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {needStatus.map(({ need, status }) => {
          const meta = statusMeta(status);
          return (
            <div key={need.id} className="flex flex-col rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5 shadow-lift">
              <div className="mb-4 flex items-center justify-between">
                <ForceArt element={need.element} className="h-11 w-11" />
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide" style={meta.style}>
                  <span className="flex gap-[3px]" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: 'currentColor', opacity: i < meta.level ? 1 : 0.28 }} />
                    ))}
                  </span>
                  {meta.label}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-ink">{need.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">{need.why}</p>
              <p className="mt-4 border-t border-ink/5 pt-3 text-xs italic leading-relaxed text-stone">{meta.note}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
