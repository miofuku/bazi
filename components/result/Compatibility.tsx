import React, { useMemo } from 'react';
import { ElementType, Favor } from '../../types';
import {
  CompatibilityReading, RelationLens, ROLE, ROLE_ORDER, GroupProfile,
} from '../../utils/CompatibilityAnalyzer';
import { PairResult, teamDailyWeather } from '../../services/compatibilityService';

const ELEMENT_HEX: Record<ElementType, string> = {
  [ElementType.WOOD]: '#4A6741', [ElementType.FIRE]: '#C4664A',
  [ElementType.EARTH]: '#8C7051', [ElementType.METAL]: '#8A8C84',
  [ElementType.WATER]: '#3D5A6C',
};
const A_HEX = '#6E8B6A'; // person A — sage
const B_HEX = '#C4664A'; // person B — clay

// ── Role-coverage radar ──────────────────────────────────────────────────────
const RADAR = 260;
const RADAR_R = 92;
const MAX_SHARE = 0.5;

const polygon = (profile: GroupProfile) => {
  const cx = RADAR / 2;
  const cy = RADAR / 2;
  return ROLE_ORDER.map((role, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / ROLE_ORDER.length;
    const r = RADAR_R * Math.min(profile[role] / MAX_SHARE, 1);
    return `${cx + r * Math.cos(ang)},${cy + r * Math.sin(ang)}`;
  }).join(' ');
};

const RoleRadar: React.FC<{
  profiles: { a: GroupProfile; b: GroupProfile };
  labelA: string;
  labelB: string;
  gaps: string[];
}> = ({ profiles, labelA, labelB, gaps }) => {
  const cx = RADAR / 2;
  const cy = RADAR / 2;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${RADAR} ${RADAR}`} className="w-full max-w-[300px]">
        {/* grid rings */}
        {[0.5, 1].map((f) => (
          <polygon
            key={f}
            points={ROLE_ORDER.map((_, i) => {
              const ang = -Math.PI / 2 + (i * 2 * Math.PI) / ROLE_ORDER.length;
              return `${cx + RADAR_R * f * Math.cos(ang)},${cy + RADAR_R * f * Math.sin(ang)}`;
            }).join(' ')}
            fill="none"
            stroke="#26302B"
            strokeOpacity={0.08}
          />
        ))}
        {ROLE_ORDER.map((role, i) => {
          const ang = -Math.PI / 2 + (i * 2 * Math.PI) / ROLE_ORDER.length;
          const lx = cx + (RADAR_R + 20) * Math.cos(ang);
          const ly = cy + (RADAR_R + 20) * Math.sin(ang);
          const label = ROLE[role].split('·')[0];
          const isGap = gaps.includes(ROLE[role]);
          return (
            <g key={role}>
              <line x1={cx} y1={cy} x2={cx + RADAR_R * Math.cos(ang)} y2={cy + RADAR_R * Math.sin(ang)} stroke="#26302B" strokeOpacity={0.08} />
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="font-sc"
                fontSize="11" fill={isGap ? '#C4664A' : '#5A6A5A'} fontWeight={isGap ? 700 : 500}>
                {label}{isGap ? '⚠' : ''}
              </text>
            </g>
          );
        })}
        <polygon points={polygon(profiles.a)} fill={A_HEX} fillOpacity={0.18} stroke={A_HEX} strokeWidth={1.5} />
        <polygon points={polygon(profiles.b)} fill={B_HEX} fillOpacity={0.18} stroke={B_HEX} strokeWidth={1.5} />
      </svg>
      <div className="mt-1 flex gap-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: A_HEX }} />{labelA}</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: B_HEX }} />{labelB}</span>
      </div>
    </div>
  );
};

// ── Bidirectional supply arrows ──────────────────────────────────────────────
const SupplyRow: React.FC<{
  from: string; to: string; score: number;
  brings: { element: ElementType; favor: Favor }[];
}> = ({ from, to, score, brings }) => {
  const pos = score >= 0;
  const pct = Math.min(Math.abs(score), 1) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-right text-sm text-ink/70">{from} <span className="text-ink/30">→</span> {to}</span>
      <div className="relative h-3 flex-1 rounded-full bg-ink/5">
        <div className="absolute inset-y-0 rounded-full" style={{ width: `${pct}%`, background: pos ? A_HEX : B_HEX, opacity: 0.75 }} />
      </div>
      <span className="w-10 shrink-0 text-sm font-semibold" style={{ color: pos ? '#4A6741' : '#C4664A' }}>
        {pos ? '+' : ''}{score.toFixed(2)}
      </span>
      <span className="flex w-16 shrink-0 gap-1">
        {brings.map((x, i) => (
          <span key={i} className="font-sc text-sm" style={{ color: ELEMENT_HEX[x.element] }} title={x.favor === 'favorable' ? '喜' : '忌'}>
            {{ [ElementType.WOOD]: '木', [ElementType.FIRE]: '火', [ElementType.EARTH]: '土', [ElementType.METAL]: '金', [ElementType.WATER]: '水' }[x.element]}
            {x.favor === 'favorable' ? '' : '⁻'}
          </span>
        ))}
      </span>
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
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <h4 className="font-display text-lg font-semibold text-ink">Days that suit you both</h4>
        <span className="text-sm text-ink/50">{mutualCount} of the next 45 days</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {days.map((d, i) => (
          <div
            key={i}
            title={`${d.date.toLocaleDateString()} ${d.chinese} · ${result.a.person.label} ${d.aScore.toFixed(1)} / ${result.b.person.label} ${d.bScore.toFixed(1)}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[11px] transition-transform hover:scale-110"
            style={{
              background: d.mutual ? ELEMENT_HEX[d.stemElement] : `${ELEMENT_HEX[d.stemElement]}1a`,
              color: d.mutual ? '#fff' : '#26302B99',
              boxShadow: d.mutual ? 'inset 0 0 0 1.5px #ffffff55' : undefined,
              fontWeight: d.mutual ? 700 : 400,
            }}
          >
            {d.date.getDate()}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-stone">
        Filled days feed <em>both</em> your natures — the calm windows for a hard conversation, a launch, a decision made together.
      </p>
    </div>
  );
};

// ── Main view ────────────────────────────────────────────────────────────────
const Chip: React.FC<{ children: React.ReactNode; tone: 'good' | 'warn' | 'bad' }> = ({ children, tone }) => {
  const c = { good: ['#eef3ec', '#4A6741'], warn: ['#f6efe4', '#8C7051'], bad: ['#f6e8e4', '#C4664A'] }[tone];
  return <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: c[0], color: c[1] }}>{children}</span>;
};

const RIVALRY_LABEL = { low: '低', medium: '中', high: '高' } as const;
const RIVALRY_TONE = { low: 'good', medium: 'warn', high: 'bad' } as const;

// ── Two-axis headline: 相吸 (chemistry) vs 相守 (built to last) ────────────────
// The royal-marriage validation showed 用神互补 = chemistry/attraction, NOT
// durability. So we split the read into two axes instead of one score: spark is
// the starting energy; whether it lasts rests on structure (role split + 争权 for
// co-founders; tending + 配偶宫 for marriage, which 八字 can't decide).
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const AxisMeter: React.FC<{
  title: string; en: string; pct: number; verdict: string; hex: string; detail: string;
}> = ({ title, en, pct, verdict, hex, detail }) => (
  <div>
    <div className="flex items-baseline justify-between">
      <span className="font-display text-base font-semibold text-ink">
        {title} <span className="font-sans text-xs font-normal uppercase tracking-wider text-ink/40">{en}</span>
      </span>
      <span className="text-sm font-semibold" style={{ color: hex }}>{verdict}</span>
    </div>
    <div className="mt-1.5 h-2.5 w-full rounded-full bg-ink/5">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: hex, opacity: 0.82 }} />
    </div>
    <p className="mt-1.5 text-xs leading-relaxed text-ink/60">{detail}</p>
  </div>
);

const TwoAxes: React.FC<{ reading: CompatibilityReading; lens: RelationLens }> = ({ reading, lens }) => {
  // 相吸 (chemistry) from mutual 用神 supply, mapped [-0.6,0.6] → [0,1].
  const spark = clamp01((reading.mutualScore + 0.6) / 1.2);
  const sparkVerdict =
    reading.mutualScore > 0.3 ? '火花强' : reading.mutualScore > 0.1 ? '有来电' : reading.mutualScore > -0.2 ? '平淡' : '相斥';
  const sparkDetail =
    reading.mutualScore > 0.1
      ? '用神互补、能量相吸——天生投合的化学反应。'
      : '能量供需平淡——少了天生的牵引，更靠事上磨合。';
  const sparkHex = lens === 'partner' ? '#4A6741' : '#C4664A';

  if (lens === 'partner' && reading.roleCoverage && reading.rivalry) {
    const cov = reading.roleCoverage;
    const riv = reading.rivalry;
    // 相守 (durability) for co-founders = role split + 争权 + coverage — the axes the
    // analyzer already computes, aggregated into one scannable read.
    let d = reading.divergentDomains ? 0.5 : -0.3;
    d += { low: 0.4, medium: 0, high: -0.5 }[riv.level];
    d -= cov.gaps.length * 0.1 + cov.overlaps.length * 0.1;
    const struct = clamp01((d + 0.6) / 1.2);
    const structVerdict = d > 0.4 ? '结构稳' : d > 0 ? '可打磨' : '易散伙';
    const structDetail =
      `${reading.divergentDomains ? '分工天然' : '争同一角色'} · 比劫争权${RIVALRY_LABEL[riv.level]}` +
      `${cov.gaps.length ? ` · 盲区${cov.gaps.length}处` : ' · 职能覆盖全'}。`;
    return (
      <div className="mt-8 grid gap-5 rounded-2xl bg-white/60 p-6 ring-1 ring-ink/5 sm:grid-cols-2">
        <AxisMeter title="相吸" en="chemistry" pct={spark * 100} verdict={sparkVerdict} hex={sparkHex} detail={sparkDetail} />
        <AxisMeter title="相守" en="built to last" pct={struct * 100} verdict={structVerdict} hex="#8C7051" detail={structDetail} />
        <p className="border-t border-ink/5 pt-3 text-xs italic text-stone sm:col-span-2">
          相吸 ≠ 相守 —— 火花是起点；能不能长久有效，靠的是分工与争权这一轴。
        </p>
      </div>
    );
  }

  // marriage: 八字 reads 相吸; 相守 is tending + choices, not fate.
  return (
    <div className="mt-8 grid gap-5 rounded-2xl bg-white/60 p-6 ring-1 ring-ink/5 sm:grid-cols-2">
      <AxisMeter title="相吸" en="chemistry" pct={spark * 100} verdict={sparkVerdict} hex={sparkHex} detail={sparkDetail} />
      <div>
        <div className="flex items-baseline justify-between">
          <span className="font-display text-base font-semibold text-ink">
            相守 <span className="font-sans text-xs font-normal uppercase tracking-wider text-ink/40">built to last</span>
          </span>
          <span className="text-sm font-semibold text-stone">看经营</span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink/60">
          八字只照见相吸；能否长久是经营与选择，非命中注定——最恩爱的盘也可能离散，最平淡的盘却能白头。
        </p>
      </div>
      <p className="border-t border-ink/5 pt-3 text-xs italic text-stone sm:col-span-2">
        相吸 ≠ 相守 —— 化学反应我们能读，长久与否由你们书写。
      </p>
    </div>
  );
};

export const Compatibility: React.FC<{
  result: PairResult;
  lens: RelationLens;
  onLensChange: (l: RelationLens) => void;
  onReset: () => void;
}> = ({ result, lens, onLensChange, onReset }) => {
  const { reading, a, b } = result;
  const labelA = a.person.label;
  const labelB = b.person.label;

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 season-sky" aria-hidden />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <button onClick={onReset} className="mb-8 text-xs font-semibold uppercase tracking-widest text-stone hover:text-sage">
          ← Start over
        </button>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-deep">Two natures</p>
        <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          {labelA} <span className="text-sage">&</span> {labelB}
        </h2>

        {/* lens toggle */}
        <div className="mt-6 inline-flex rounded-full border border-ink/10 p-1">
          {(['partner', 'marriage'] as RelationLens[]).map((l) => (
            <button key={l} onClick={() => onLensChange(l)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${lens === l ? 'bg-sage text-white' : 'text-stone hover:text-sage'}`}>
              {l === 'partner' ? 'Co-founder' : 'Marriage'}
            </button>
          ))}
        </div>

        {/* Two-axis headline — 相吸 vs 相守 (chemistry is the spark, not the staying power) */}
        <TwoAxes reading={reading} lens={lens} />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Role radar */}
          <div className="rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5">
            <h4 className="mb-3 font-display text-lg font-semibold text-ink">Where each of you is strong</h4>
            <RoleRadar profiles={reading.profiles} labelA={labelA} labelB={labelB} gaps={reading.roleCoverage?.gaps ?? []} />
          </div>

          {/* Supply + diagnosis */}
          <div className="flex flex-col gap-4 rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5">
            <h4 className="font-display text-lg font-semibold text-ink">What you bring each other</h4>
            <div className="flex flex-col gap-2">
              <SupplyRow from={labelA} to={labelB} score={reading.aToB.score} brings={reading.aToB.brings} />
              <SupplyRow from={labelB} to={labelA} score={reading.bToA.score} brings={reading.bToA.brings} />
            </div>
            {reading.asymmetry > 0.25 && (
              <p className="text-xs italic text-stone">
                Uneven: {reading.aToB.score > reading.bToA.score ? labelA : labelB} nourishes the other more.
              </p>
            )}

            {lens === 'partner' && reading.roleCoverage && reading.rivalry && (
              <div className="mt-1 flex flex-col gap-3 border-t border-ink/5 pt-3">
                <div className="flex flex-wrap gap-2">
                  {reading.roleCoverage.covered.map((r) => <Chip key={r} tone="good">✓ {r}</Chip>)}
                  {reading.roleCoverage.gaps.map((r) => <Chip key={r} tone="warn">⚠ 盲区 {r}</Chip>)}
                  {reading.roleCoverage.overlaps.map((r) => <Chip key={r} tone="bad">↯ 撞车 {r}</Chip>)}
                </div>
                <div className="flex items-center gap-2 text-sm text-ink/70">
                  <span>比劫争权</span>
                  <Chip tone={RIVALRY_TONE[reading.rivalry.level]}>{RIVALRY_LABEL[reading.rivalry.level]}</Chip>
                  <span className="text-xs text-stone">{reading.rivalry.reason}</span>
                </div>
              </div>
            )}

            {lens === 'marriage' && reading.spousePalace && (
              <div className="mt-1 flex flex-col gap-2 border-t border-ink/5 pt-3 text-sm text-ink/70">
                {reading.spousePalace.map((sp, i) => (
                  <p key={i}>
                    <span className="font-semibold text-ink/80">{sp.from} 配偶宫</span>
                    {sp.holds.length ? ` 藏 ${sp.holds.map((e) => ({ [ElementType.WOOD]: '木', [ElementType.FIRE]: '火', [ElementType.EARTH]: '土', [ElementType.METAL]: '金', [ElementType.WATER]: '水' }[e])).join('')}（对方喜用）` : ' 未藏对方喜用'}
                    {sp.clashes.length ? `，兼带忌 ${sp.clashes.map((e) => ({ [ElementType.WOOD]: '木', [ElementType.FIRE]: '火', [ElementType.EARTH]: '土', [ElementType.METAL]: '金', [ElementType.WATER]: '水' }[e])).join('')}` : ''}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Full diagnosis text */}
        <div className="mt-6 rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5">
          <p className="text-sm leading-relaxed text-ink/75">{reading.note}</p>
        </div>

        {/* Team daily weather */}
        <div className="mt-6 rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5">
          <TeamWeather result={result} />
        </div>
      </div>
    </div>
  );
};
