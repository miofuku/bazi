import React from 'react';
import { NeedStatus } from '../../content/xiangfa';
import { ELEMENT_COLORS } from '../../utils/constants';
import { ElementGlyph } from './icons';
import { useAccent } from './AtmosphereContext';

// "What helps you grow" — the living thing's needs, ordered by what the season
// makes most urgent, each marked against what the chart actually holds.
export const ThriveNeeds: React.FC<{ needStatus: NeedStatus[] }> = ({ needStatus }) => {
  const { accent, accentDeep } = useAccent();

  const statusMeta = (status: NeedStatus['status']) => {
    switch (status) {
      case 'scarce':
        return { label: 'Could use more', style: { background: 'rgba(185,138,102,0.15)', color: '#9a6a44' }, note: 'This is thin in your makeup right now — the thing most worth seeking out.' };
      case 'abundant':
        return { label: 'Runs deep', style: { background: `${accent}33`, color: accentDeep }, note: 'Already abundant in you — a natural strength.' };
      default:
        return { label: 'You have some', style: { background: `${accent}22`, color: accentDeep }, note: 'Present in fair measure — lean on it.' };
    }
  };

  return (
    <section>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: accentDeep }}>What helps you grow</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">The conditions you flourish in</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
        Every living thing needs certain conditions to thrive. These are yours, in the order this season calls for them — and how much of each your own makeup already carries.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {needStatus.map(({ need, status }) => {
          const meta = statusMeta(status);
          return (
            <div key={need.id} className="flex flex-col rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5">
              <div className="mb-4 flex items-center justify-between">
                <span className={ELEMENT_COLORS[need.element]}>
                  <ElementGlyph type={need.element} className="h-9 w-9 fill-none" />
                </span>
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
