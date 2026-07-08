import React from 'react';
import { SeasonalModifier } from '../../content/xiangfa';
import { SeasonArt } from '../illustrations/SeasonArt';
import { useAccent } from './AtmosphereContext';

const SEASON_TINT: Record<SeasonalModifier['season'], string> = {
  Spring: 'from-wood/10',
  Summer: 'from-fire/10',
  Autumn: 'from-earth/10',
  Winter: 'from-water/10',
};

// "The climate you grew up in" — the conditions your nature first had to grow in.
export const SeasonEnvironment: React.FC<{ season: SeasonalModifier }> = ({ season }) => {
  const { accent, accentDeep } = useAccent();
  return (
    <section className={`overflow-hidden rounded-2xl bg-gradient-to-br ${SEASON_TINT[season.season]} to-transparent p-8 ring-1 ring-ink/5 shadow-lift md:p-10`}>
      <div className="flex items-start gap-6">
        <SeasonArt season={season.season} accent={accent} className="hidden h-16 w-16 shrink-0 sm:block" />
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: accentDeep }}>
            The climate you grew up in · {season.season}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">{season.environmentTitle}</h2>
          <p className="mt-1 font-display text-base italic text-stone">{season.climate}</p>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/80">{season.reading}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone">
            The world you arrived into — your early home, the people and conditions around you — leaves a mark that never quite washes out. It's why two people of the same nature can grow so differently.
          </p>
        </div>
      </div>
    </section>
  );
};
