import React from 'react';
import { NeedStatus } from '../../content/xiangfa';
import { ForceArt } from '../illustrations/ForceArt';
import { useAccent } from './AtmosphereContext';

// "What helps you grow" — the living thing's needs, ordered by what the season
// makes most urgent, mirrored to a human life and marked against the chart.
export const ThriveNeeds: React.FC<{ needStatus: NeedStatus[]; natureName: string }> = ({ needStatus, natureName }) => {
  const { accent, accentDeep } = useAccent();

  const statusMeta = (status: NeedStatus['status']) => {
    switch (status) {
      case 'scarce':
        return { label: 'Could use more', style: { background: 'rgba(185,138,102,0.15)', color: '#9a6a44' }, note: 'This is thin in your makeup right now — the thing most worth seeking out.' };
      case 'abundant':
        return { label: 'Runs deep', style: { background: `${accent}33`, color: accentDeep }, note: 'Already abundant in you — a natural strength to lean on.' };
      default:
        return { label: 'You have some', style: { background: `${accent}22`, color: accentDeep }, note: 'Present in fair measure — keep it close.' };
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
            <div key={need.id} className="flex flex-col rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5">
              <div className="mb-4 flex items-center justify-between">
                <ForceArt element={need.element} className="h-11 w-11" />
                <span className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider" style={meta.style}>{meta.label}</span>
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
