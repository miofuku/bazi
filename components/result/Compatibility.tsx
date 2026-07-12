import React, { useMemo, useState } from 'react';
import { ElementType } from '../../types';
import {
  CompatibilityReading, RelationLens, ROLE, ROLE_ORDER, GroupProfile,
} from '../../utils/CompatibilityAnalyzer';
import { PairResult, teamDailyWeather } from '../../services/compatibilityService';
import { ELEMENT_HEX, PERSON, WIND } from '../../utils/tokens';
import { NatureArt } from '../illustrations/NatureArt';
import { STEM_PROFILES } from '../../content/xiangfa';
import { Meter } from './Meter';
import { UnlockPanel } from './UnlockPanel';
import { paymentConfigured, hasEntitlement } from '../../services/entitlementService';
import { buildPairNarrative } from '../../content/xiangfa/pair';
import { PairDepth, PairStoryline } from './PairDepth';
import { ResultShell } from './ResultShell';

const A_HEX = PERSON.a; // person A — sage
const B_HEX = PERSON.b; // person B — clay

// ── Role-coverage radar ──────────────────────────────────────────────────────
const RADAR = 260;
const RADAR_R = 92;
const MAX_SHARE = 0.5;

const radarPoints = (profile: GroupProfile): [number, number][] => {
  const cx = RADAR / 2, cy = RADAR / 2;
  return ROLE_ORDER.map((role, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / ROLE_ORDER.length;
    const r = RADAR_R * Math.min(profile[role] / MAX_SHARE, 1);
    return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
  });
};
const polygon = (profile: GroupProfile) => radarPoints(profile).map(([x, y]) => `${x},${y}`).join(' ');

const RoleRadar: React.FC<{
  profiles: { a: GroupProfile; b: GroupProfile };
  labelA: string;
  labelB: string;
  gaps: string[];
}> = ({ profiles, labelA, labelB, gaps }) => {
  const cx = RADAR / 2;
  const cy = RADAR / 2;
  const roleNames = ROLE_ORDER.map((r) => ROLE[r].split('·')[0]).join('、');
  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${RADAR} ${RADAR}`}
        className="w-full max-w-[300px]"
        role="img"
        aria-label={`Role coverage radar across ${roleNames}, comparing ${labelA} and ${labelB}.${gaps.length ? ` Blind spots neither covers: ${gaps.join('、')}.` : ''}`}
      >
        {/* reference rings — finer, so magnitude reads at a glance */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon
            key={f}
            points={ROLE_ORDER.map((_, i) => {
              const ang = -Math.PI / 2 + (i * 2 * Math.PI) / ROLE_ORDER.length;
              return `${cx + RADAR_R * f * Math.cos(ang)},${cy + RADAR_R * f * Math.sin(ang)}`;
            }).join(' ')}
            fill="none"
            stroke="#26302B"
            strokeOpacity={f === 1 ? 0.1 : 0.055}
          />
        ))}
        {ROLE_ORDER.map((role, i) => {
          const ang = -Math.PI / 2 + (i * 2 * Math.PI) / ROLE_ORDER.length;
          const lx = cx + (RADAR_R + 22) * Math.cos(ang);
          const ly = cy + (RADAR_R + 22) * Math.sin(ang);
          const label = ROLE[role].split('·')[0];
          const isGap = gaps.includes(ROLE[role]);
          return (
            <g key={role}>
              <line x1={cx} y1={cy} x2={cx + RADAR_R * Math.cos(ang)} y2={cy + RADAR_R * Math.sin(ang)} stroke="#26302B" strokeOpacity={0.055} />
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="font-sans"
                fontSize="9.5" letterSpacing="0.03em" fill={isGap ? WIND.headwind : '#5A6A5A'} fontWeight={isGap ? 700 : 500}>
                {label}{isGap ? ' ⚠' : ''}
              </text>
            </g>
          );
        })}
        {/* each person's shape + vertex dots */}
        {([['a', A_HEX], ['b', B_HEX]] as const).map(([k, hex]) => (
          <g key={k}>
            <polygon points={polygon(profiles[k])} fill={hex} fillOpacity={0.15} stroke={hex} strokeWidth={1.75} strokeLinejoin="round" />
            {radarPoints(profiles[k]).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.4} fill={hex} />)}
          </g>
        ))}
      </svg>
      <div className="mt-1 flex gap-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: A_HEX }} />{labelA}</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: B_HEX }} />{labelB}</span>
      </div>
    </div>
  );
};

// ── Team daily weather strip ─────────────────────────────────────────────────
const TeamWeather: React.FC<{ result: PairResult }> = ({ result }) => {
  const days = useMemo(
    () => teamDailyWeather(result.a.person, result.b.person, 45),
    [result],
  );
  const mutualCount = days.filter((d) => d.mutual).length;
  const [active, setActive] = useState<number | null>(null);
  const labelA = result.a.person.label;
  const labelB = result.b.person.label;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h4 className="font-sans text-[11px] font-semibold uppercase tracking-widest text-sage-deep">Shared weather · next 45 days</h4>
        <span className="text-xs text-ink/45">{mutualCount} lean your way</span>
      </div>
      <div className="flex flex-wrap gap-1" onMouseLeave={() => setActive(null)}>
        {days.map((d, i) => {
          const isActive = active === i;
          return (
            <div
              key={i}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(isActive ? null : i)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-[10px] transition-shadow"
              style={{
                background: d.mutual ? ELEMENT_HEX[d.stemElement] : `${ELEMENT_HEX[d.stemElement]}14`,
                color: d.mutual ? '#fff' : '#26302B80',
                fontWeight: d.mutual ? 600 : 400,
                boxShadow: isActive ? `0 0 0 1.5px ${ELEMENT_HEX[d.stemElement]}` : undefined,
              }}
            >
              {d.date.getDate()}
            </div>
          );
        })}
      </div>
      <p className="mt-3 min-h-[2.75em] text-xs leading-relaxed text-stone/80">
        {active != null ? (() => {
          const d = days[active];
          const lean = d.mutual
            ? 'leans toward you both'
            : d.aScore > 0 ? `leans toward ${labelA}`
            : d.bScore > 0 ? `leans toward ${labelB}`
            : 'quiet for both';
          return (
            <span>
              <span className="font-semibold text-ink/75">
                {d.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              {' — '}{lean}.
            </span>
          );
        })() : (
          <>Filled days lean gently toward you both — a soft shared tailwind, not a day to plan around. What any single day actually asks of you shows up in each of your own daily readings.</>
        )}
      </p>
    </div>
  );
};

// ── Main view ────────────────────────────────────────────────────────────────
const Chip: React.FC<{ children: React.ReactNode; tone: 'good' | 'warn' | 'bad' }> = ({ children, tone }) => {
  const c = { good: ['#eef3ec', '#4A6741'], warn: ['#f6efe4', '#8C7051'], bad: ['#f6e8e4', '#C4664A'] }[tone];
  return <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: c[0], color: c[1] }}>{children}</span>;
};

const RIVALRY_LABEL = { low: 'Low', medium: 'Med', high: 'High' } as const;
const RIVALRY_TONE = { low: 'good', medium: 'warn', high: 'bad' } as const;

// ── Two-axis headline: 相吸 (chemistry) vs 相守 (built to last) ────────────────
// The royal-marriage validation showed 用神互补 = chemistry/attraction, NOT
// durability. So we split the read into two axes instead of one score: spark is
// the starting energy; whether it lasts rests on structure (role split + 争权 for
// co-founders; tending + 配偶宫 for marriage, which 八字 can't decide).
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const AxisMeter: React.FC<{
  title: string; pct: number; verdict: string; hex: string; detail: string;
}> = ({ title, pct, verdict, hex, detail }) => (
  <div>
    <div className="flex items-baseline justify-between">
      <span className="font-display text-base font-semibold text-ink">
        {title}
      </span>
      <span className="text-sm font-semibold" style={{ color: hex }}>{verdict}</span>
    </div>
    <div className="mt-1.5"><Meter value={pct / 100} hex={hex} /></div>
    <p className="mt-1.5 text-xs leading-relaxed text-ink/60">{detail}</p>
  </div>
);

const TwoAxes: React.FC<{ reading: CompatibilityReading; lens: RelationLens }> = ({ reading, lens }) => {
  // 相吸 (chemistry) from mutual 用神 supply, mapped [-0.6,0.6] → [0,1].
  const spark = clamp01((reading.mutualScore + 0.6) / 1.2);
  const sparkVerdict =
    reading.mutualScore > 0.3 ? 'Strong spark' : reading.mutualScore > 0.1 ? 'Some draw' : reading.mutualScore > -0.2 ? 'Faint' : 'At odds';
  const sparkDetail =
    reading.mutualScore > 0.1
      ? 'Your elements feed each other — a natural, born-in draw.'
      : 'Quiet supply — less natural pull, more worked out in the doing.';
  const sparkHex = lens === 'partner' ? WIND.tailwind : WIND.headwind;

  if (lens === 'partner' && reading.roleCoverage && reading.rivalry) {
    const cov = reading.roleCoverage;
    const riv = reading.rivalry;
    // Staying power for co-founders = role split + rivalry + coverage — the axes the
    // analyzer already computes, aggregated into one scannable read.
    let d = reading.divergentDomains ? 0.5 : -0.3;
    d += { low: 0.4, medium: 0, high: -0.5 }[riv.level];
    d -= cov.gaps.length * 0.1 + cov.overlaps.length * 0.1;
    const struct = clamp01((d + 0.6) / 1.2);
    const structVerdict = d > 0.4 ? 'Solid' : d > 0 ? 'Workable' : 'Fragile';
    const structDetail =
      `${reading.divergentDomains ? 'Natural role split' : 'Same role contested'} · rivalry ${RIVALRY_LABEL[riv.level].toLowerCase()}` +
      `${cov.gaps.length ? ` · ${cov.gaps.length} blind spot${cov.gaps.length > 1 ? 's' : ''}` : ' · roles covered'}.`;
    return (
      <div className="mt-8 grid gap-5 rounded-2xl bg-white/60 p-6 ring-1 ring-ink/5 shadow-lift sm:grid-cols-2">
        <AxisMeter title="Chemistry" pct={spark * 100} verdict={sparkVerdict} hex={sparkHex} detail={sparkDetail} />
        <AxisMeter title="Built to last" pct={struct * 100} verdict={structVerdict} hex={ELEMENT_HEX[ElementType.EARTH]} detail={structDetail} />
        <p className="border-t border-ink/5 pt-3 text-xs italic text-stone sm:col-span-2">
          Chemistry isn’t staying power — a spark is the start; lasting rests on the split of roles and the pull for control.
        </p>
      </div>
    );
  }

  // marriage: the chart reads the spark (相吸); staying power (相守) is tending + choice, not fate.
  return (
    <div className="mt-8 grid gap-5 rounded-2xl bg-white/60 p-6 ring-1 ring-ink/5 shadow-lift sm:grid-cols-2">
      <AxisMeter title="Chemistry" pct={spark * 100} verdict={sparkVerdict} hex={sparkHex} detail={sparkDetail} />
      <div>
        <div className="flex items-baseline justify-between">
          <span className="font-display text-base font-semibold text-ink">
            Built to last
          </span>
          <span className="text-sm font-semibold text-stone">Yours to write</span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink/60">
          The chart shows only the spark. Whether it lasts is tending and choice — the most loving pairing can part, and the plainest can last a lifetime.
        </p>
      </div>
      <p className="border-t border-ink/5 pt-3 text-xs italic text-stone sm:col-span-2">
        Chemistry we can read; how long it lasts, you write.
      </p>
    </div>
  );
};

export const Compatibility: React.FC<{
  result: PairResult;
  lens: RelationLens;
  onReset: () => void;
}> = ({ result, lens, onReset }) => {
  const { reading, a, b } = result;
  // Free tier: header + two axes + In short. The detail cards unlock with a
  // one-time purchase; until payment is configured, everything stays free.
  const [unlocked, setUnlocked] = useState(() => !paymentConfigured || hasEntitlement());
  // The depth sections: two full readings woven into one relational narrative.
  const narrative = useMemo(
    () => buildPairNarrative(
      { label: a.person.label, chart: a.chart },
      { label: b.person.label, chart: b.chart },
      lens,
      new Date().getFullYear(),
    ),
    [a, b, lens],
  );
  const labelA = a.person.label;
  const labelB = b.person.label;
  const symA = STEM_PROFILES[a.chart.dayMaster.chinese]?.symbol ?? 'tree';
  const symB = STEM_PROFILES[b.chart.dayMaster.chinese]?.symbol ?? 'tree';
  const lensLabel = lens === 'partner' ? 'Work' : 'Love';

  return (
    <ResultShell onReset={onReset} background={<div className="fixed inset-0 -z-10 season-sky" aria-hidden />}>
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Header — the two natures shown as glyphs, echoing the single reading's hero */}
        <div className="flex flex-col items-center text-center">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-deep">Paired natures · {lensLabel}</p>
          <div className="mt-6 flex items-center justify-center gap-3 sm:gap-6">
            <NatureArt id={symA} accent={PERSON.a} className="h-12 w-12 shrink-0 sm:h-16 sm:w-16 md:h-20 md:w-20" />
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl md:text-5xl">
              {labelA} <span className="text-sage">&</span> {labelB}
            </h2>
            <NatureArt id={symB} accent={PERSON.b} className="h-12 w-12 shrink-0 sm:h-16 sm:w-16 md:h-20 md:w-20" />
          </div>
        </div>

        {/* Two-axis headline — 相吸 vs 相守 (chemistry is the spark, not the staying power) */}
        <TwoAxes reading={reading} lens={lens} />

        {/* In short — the human synthesis; free, like the axes above */}
        <div className="mt-6 rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5 shadow-lift">
          <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-sage-deep">In short</p>
          <p className="font-display text-lg leading-relaxed text-ink/85 md:text-xl">{reading.note}</p>
        </div>

        {!unlocked && <UnlockPanel lens={lens} onUnlocked={() => setUnlocked(true)} />}

        {unlocked && (<>
        {/* A1 what you are to each other · A2 needs · C cross-chart · B decades */}
        <PairDepth narrative={narrative} />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Role radar */}
          <div className="rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5 shadow-lift">
            <h4 className="mb-3 font-display text-lg font-semibold text-ink">Where each of you is strong</h4>
            <RoleRadar profiles={reading.profiles} labelA={labelA} labelB={labelB} gaps={reading.roleCoverage?.gaps ?? []} />
          </div>

          {/* Coverage / palaces — the structural read beside the radar */}
          <div className="flex flex-col gap-4 rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5 shadow-lift">
            <h4 className="font-display text-lg font-semibold text-ink">
              {lens === 'partner' ? 'Who covers what' : 'Your innermost seats'}
            </h4>

            {lens === 'partner' && reading.roleCoverage && reading.rivalry && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {reading.roleCoverage.covered
                    .filter((r) => !reading.roleCoverage!.overlaps.includes(r))
                    .map((r) => <Chip key={r} tone="good">✓ {r.split('·')[0]}</Chip>)}
                  {reading.roleCoverage.gaps.map((r) => <Chip key={r} tone="warn">⚠ Gap · {r.split('·')[0]}</Chip>)}
                  {reading.roleCoverage.overlaps.map((r) => <Chip key={r} tone="bad">↯ Both · {r.split('·')[0]}</Chip>)}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-ink/70">
                  <span>Rivalry for the lead</span>
                  <Chip tone={RIVALRY_TONE[reading.rivalry.level]}>{RIVALRY_LABEL[reading.rivalry.level]}</Chip>
                  <span className="text-xs text-stone">{reading.rivalry.reason}</span>
                </div>
              </div>
            )}

            {lens === 'marriage' && reading.spousePalace && (
              <div className="flex flex-col gap-2 text-sm text-ink/70">
                {reading.spousePalace.map((sp, i) => {
                  const other = i === 0 ? labelB : labelA;
                  const list = (arr: ElementType[]) => arr.map((e) => (e as string).toLowerCase()).join(' & ');
                  return (
                    <p key={i}>
                      <span className="font-semibold text-ink/80">{sp.from}’s innermost seat</span>
                      {sp.holds.length ? ` holds ${list(sp.holds)} — just what ${other} thrives on` : ` holds none of what ${other} thrives on`}
                      {sp.clashes.length ? `, and some ${list(sp.clashes)} they’d rather avoid` : ''}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* D · the joint storyline closes the reading */}
        <PairStoryline narrative={narrative} />

        {/* Shared weather — a low-key footnote, not decision support */}
        <div className="mt-6 rounded-2xl bg-white/35 p-5 ring-1 ring-ink/5">
          <TeamWeather result={result} />
        </div>
        </>)}
      </div>
    </ResultShell>
  );
};
