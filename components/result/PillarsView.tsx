import React from 'react';
import { BaziChart, Pillar } from '../../types';
import { ELEMENT_COLORS, STEM_SYMBOLS, BRANCH_SYMBOLS } from '../../utils/constants';
import { ElementIcon } from './icons';
import { useAccent } from './AtmosphereContext';

// The four pillars, shown calmly: Chinese glyphs as accents, the Day pillar
// (the self) gently highlighted. No fortune-telling deity labels.
const PillarColumn: React.FC<{ pillar: Pillar; label: string; isSelf?: boolean }> = ({ pillar, label, isSelf }) => {
  const { accent, accentDeep } = useAccent();
  return (
  <div
    className="flex flex-col items-center rounded-2xl p-5 ring-1 transition-all duration-500"
    style={isSelf
      ? { background: `${accent}14`, '--tw-ring-color': `${accent}4d` } as React.CSSProperties
      : { background: 'rgba(255,255,255,0.4)', '--tw-ring-color': 'rgba(38,48,43,0.05)' } as React.CSSProperties}
  >
    <div className="mb-4 text-[10px] font-sans font-semibold uppercase tracking-[0.25em]" style={{ color: isSelf ? accentDeep : 'rgba(91,102,96,0.7)' }}>
      {isSelf ? 'You' : label}
    </div>

    {/* Stem */}
    <div className="flex flex-col items-center gap-1">
      <span className={`font-sc text-4xl md:text-5xl font-semibold ${ELEMENT_COLORS[pillar.stem.element]}`}>{pillar.stem.chinese}</span>
      <span className={ELEMENT_COLORS[pillar.stem.element]}>
        <ElementIcon type={STEM_SYMBOLS[pillar.stem.chinese]} className="w-6 h-6 stroke-[1.4]" />
      </span>
      <span className="font-sans text-[10px] uppercase tracking-widest text-stone/60">{pillar.stem.name}</span>
      <span className="font-sans text-[9px] text-stone/50 text-center leading-tight">{isSelf ? 'Day Master' : pillar.stem.deity}</span>
    </div>

    <div className="my-4 h-px w-10 bg-ink/10" />

    {/* Branch */}
    <div className="flex flex-col items-center gap-1">
      <span className={`font-sc text-4xl md:text-5xl font-semibold ${ELEMENT_COLORS[pillar.branch.element]}`}>{pillar.branch.chinese}</span>
      <span className={ELEMENT_COLORS[pillar.branch.element]}>
        <ElementIcon type={BRANCH_SYMBOLS[pillar.branch.chinese]} className="w-6 h-6 stroke-[1.4]" />
      </span>
      <span className="font-sans text-[10px] uppercase tracking-widest text-stone/60">{pillar.branch.zodiac}</span>
      {pillar.branch.deity && <span className="font-sans text-[9px] text-stone/50 text-center leading-tight">{pillar.branch.deity}</span>}
    </div>

    {/* Hidden stems, quiet */}
    {pillar.branch.hiddenStems.length > 0 && (
      <div className="mt-4 flex gap-1.5 opacity-70">
        {pillar.branch.hiddenStems.map((hs, i) => (
          <span key={i} className={`font-sc text-sm ${ELEMENT_COLORS[hs.element]}`}>{hs.chinese}</span>
        ))}
      </div>
    )}
  </div>
  );
};

export const PillarsView: React.FC<{ chart: BaziChart }> = ({ chart }) => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
    <PillarColumn pillar={chart.yearPillar} label="Year" />
    <PillarColumn pillar={chart.monthPillar} label="Season" />
    <PillarColumn pillar={chart.dayPillar} label="Day" isSelf />
    <PillarColumn pillar={chart.hourPillar} label="Hour" />
  </div>
);
