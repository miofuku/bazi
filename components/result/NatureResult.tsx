import React, { useMemo } from 'react';
import { BaziChart } from '../../types';
import { buildXiangfaReading } from '../../content/xiangfa';
import { ELEMENT_COLORS } from '../../utils/constants';
import { YourNature } from './YourNature';
import { SeasonEnvironment } from './SeasonEnvironment';
import { ThriveNeeds } from './ThriveNeeds';
import { PillarsView } from './PillarsView';
import { InnerClimate } from './InnerClimate';

const SectionDivider: React.FC = () => <div className="mx-auto h-px w-16 bg-ink/10" />;

export const NatureResult: React.FC<{ chart: BaziChart }> = ({ chart }) => {
  const reading = useMemo(() => buildXiangfaReading(chart), [chart]);

  return (
    <div className="animate-fade-in space-y-20">
      {/* Hero line */}
      <header className="text-center">
        {chart.date && (
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-stone/70">
            {chart.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            {' · '}
            {chart.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink md:text-4xl">
          You are <span className={ELEMENT_COLORS[reading.stem.element]}>{reading.stem.imageTitle.toLowerCase()}</span>,
        </h1>
        <p className="mt-2 font-display text-xl italic text-stone">{reading.season.environmentTitle.toLowerCase()}.</p>
        <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-ink/70">{reading.stem.thrivingLine}</p>
      </header>

      <SectionDivider />
      <YourNature stem={reading.stem} />

      <SectionDivider />
      <SeasonEnvironment season={reading.season} />

      <SectionDivider />
      <ThriveNeeds needStatus={reading.needStatus} />

      <SectionDivider />
      <InnerClimate
        elementShare={reading.elementShare}
        dominantElement={reading.dominantElement}
        weakestElement={reading.weakestElement}
      />

      <SectionDivider />
      <section>
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-sage-deep">Your four pillars</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">The moment, in full</h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
          The year, season, day, and hour of your birth, each a stem above an earthly branch. The Day is you; the rest is the world you arrived into.
        </p>
        <div className="mt-8">
          <PillarsView chart={chart} />
        </div>
      </section>

      <p className="border-t border-ink/5 pt-8 text-center text-xs italic leading-relaxed text-stone">
        八字象法 reads your birth as a living image in nature — a way to understand yourself, not a prediction of fortune.
      </p>
    </div>
  );
};
