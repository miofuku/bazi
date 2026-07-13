import React from 'react';
import { NeedStatus } from '../../content/xiangfa';
import { LifeSeason } from '../../content/xiangfa/relationships';
import { useAccent } from './AtmosphereContext';

const TONE_WORD: Record<LifeSeason['tone'], string> = {
  kind: 'a kind season', steady: 'a steady season', demanding: 'a demanding season',
};
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

// A one-glance summary right after the hero — mirrors the paired reading's "In
// short". The hero already names your nature, so this adds the two things it
// doesn't: where you are now (the current decade) and the one thing that would
// most help you grow. A skimmer gets the gist before the long reading, and a
// returning reader is re-oriented fast; the full detail lives in the sections
// below (Life seasons, What helps you grow).
export const ReadingGist: React.FC<{ current?: LifeSeason; topNeed?: NeedStatus }> = ({ current, topNeed }) => {
  const { accentDeep } = useAccent();
  if (!current && !topNeed) return null;

  return (
    <section className="rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5 shadow-lift md:p-8">
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: accentDeep }}>In short</p>
      <p className="mt-3 font-display text-lg leading-relaxed text-ink/85 md:text-xl">
        {current && (
          <>
            Right now you’re moving through your{' '}
            <span className="font-semibold text-ink">{lowerFirst(current.label)} years</span>, ages{' '}
            {current.startAge}–{current.endAge} — {TONE_WORD[current.tone]}.{' '}
          </>
        )}
        {topNeed && (
          <>
            {current ? 'The one thing that would most help you grow through it' : 'What would most help you grow right now'}:{' '}
            <span className="font-semibold text-ink">{lowerFirst(topNeed.need.label)}</span>.
          </>
        )}
      </p>
    </section>
  );
};
