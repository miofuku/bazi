import React from 'react';
import { BaziChart } from '../../types';
import { ELEMENT_COLORS } from '../../utils/constants';
import { PillarsView } from './PillarsView';

// An optional, collapsed disclosure for the curious. This is the ONLY place the
// traditional chart and its Chinese characters appear — the machinery behind the
// reading, kept out of the main experience by design.
export const TheFullChart: React.FC<{ chart: BaziChart }> = ({ chart }) => (
  <details className="group mx-auto max-w-2xl rounded-2xl border border-ink/10 bg-white/40 px-6 py-4">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm text-stone marker:hidden">
      <span className="font-sans font-medium">The full chart, for the curious</span>
      <span className="text-stone/60 transition-transform group-open:rotate-180">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </summary>

    <div className="mt-6 border-t border-ink/5 pt-6">
      <p className="mb-6 text-sm leading-relaxed text-stone">
        Your reading is drawn from an old Chinese way of mapping a birth moment onto the natural world. Here is that underlying map — four time-units, each a pairing of forces. You never need it to understand yourself; it's simply the machinery beneath the mirror.
      </p>
      <PillarsView chart={chart} />

      <p className="mb-4 mt-10 text-sm font-medium text-stone">The ten-year cycles (大运)</p>
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {chart.daYun.map((yun) => (
          <div key={yun.startAge} className="min-w-[64px] flex-1 rounded-lg bg-white/50 p-2 text-center ring-1 ring-ink/5 shadow-lift">
            <div className="text-[10px] uppercase tracking-wider text-stone/60">{yun.startAge}–{yun.endAge}</div>
            <div className="mt-1 font-sc text-lg font-semibold">
              <span className={ELEMENT_COLORS[yun.pillar.stem.element]}>{yun.pillar.stem.chinese}</span>
              <span className={ELEMENT_COLORS[yun.pillar.branch.element]}>{yun.pillar.branch.chinese}</span>
            </div>
            <div className="text-[9px] text-stone/50">{yun.year}</div>
          </div>
        ))}
      </div>
    </div>
  </details>
);
