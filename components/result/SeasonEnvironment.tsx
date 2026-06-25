import React from 'react';
import { SeasonalModifier } from '../../content/xiangfa';

const SEASON_ART: Record<SeasonalModifier['season'], { glyph: string; tint: string }> = {
  Spring: { glyph: '🌱', tint: 'from-wood/10' },
  Summer: { glyph: '☀️', tint: 'from-fire/10' },
  Autumn: { glyph: '🍂', tint: 'from-earth/10' },
  Winter: { glyph: '❄️', tint: 'from-water/10' },
};

// "The season you were born into" — the climate the living nature first met.
export const SeasonEnvironment: React.FC<{ season: SeasonalModifier }> = ({ season }) => {
  const art = SEASON_ART[season.season];
  return (
    <section className={`overflow-hidden rounded-2xl bg-gradient-to-br ${art.tint} to-transparent p-8 ring-1 ring-ink/5 md:p-10`}>
      <div className="flex items-start gap-5">
        <span className="text-4xl leading-none" aria-hidden>{art.glyph}</span>
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-sage-deep">
            The season you were born into · {season.season}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">{season.environmentTitle}</h2>
          <p className="mt-1 font-display text-base italic text-stone">{season.climate}</p>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/80">{season.reading}</p>
        </div>
      </div>
    </section>
  );
};
