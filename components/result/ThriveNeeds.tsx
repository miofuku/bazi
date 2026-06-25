import React from 'react';
import { NeedStatus } from '../../content/xiangfa';
import { ELEMENT_COLORS } from '../../utils/constants';
import { ElementGlyph } from './icons';

const STATUS_META: Record<NeedStatus['status'], { label: string; chip: string; note: string }> = {
  scarce: {
    label: 'Could use more',
    chip: 'bg-clay/15 text-clay',
    note: 'This is thin in your makeup right now — the thing most worth seeking out.',
  },
  present: {
    label: 'You have some',
    chip: 'bg-sage/15 text-sage-deep',
    note: 'Present in fair measure — lean on it.',
  },
  abundant: {
    label: 'Runs deep',
    chip: 'bg-sage/25 text-sage-deep',
    note: 'Already abundant in you — a natural strength.',
  },
};

// "What helps you grow" — the living thing's needs, ordered by what the season
// makes most urgent, each marked against what the chart actually holds.
export const ThriveNeeds: React.FC<{ needStatus: NeedStatus[] }> = ({ needStatus }) => (
  <section>
    <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-sage-deep">What helps you grow</p>
    <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">The conditions you flourish in</h2>
    <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
      Every living thing needs certain conditions to thrive. These are yours, in the order this season calls for them — and how much of each your own makeup already carries.
    </p>

    <div className="mt-8 grid gap-4 md:grid-cols-3">
      {needStatus.map(({ need, status }) => {
        const meta = STATUS_META[status];
        return (
          <div key={need.id} className="flex flex-col rounded-2xl bg-white/45 p-6 ring-1 ring-ink/5">
            <div className="mb-4 flex items-center justify-between">
              <span className={ELEMENT_COLORS[need.element]}>
                <ElementGlyph type={need.element} className="h-9 w-9 fill-none" />
              </span>
              <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${meta.chip}`}>{meta.label}</span>
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
