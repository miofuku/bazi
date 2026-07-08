import React from 'react';
import { InteractionsReading, BranchRelation, ElementDynamic } from '../../content/xiangfa/interactions';
import { ForceArt } from '../illustrations/ForceArt';
import { ELEMENT_HEX, REL_TONE } from '../../utils/tokens';
import { ELEMENT_NATURE } from './icons';
import { useAccent } from './AtmosphereContext';

// a force emblem in a defined, colour-ringed disc, with its name beneath
const Disc: React.FC<{ element: ElementDynamic['from']; dim?: boolean }> = ({ element, dim }) => {
  const hex = ELEMENT_HEX[element];
  return (
    <div className="flex shrink-0 flex-col items-center gap-2" style={{ opacity: dim ? 0.85 : 1 }}>
      <span className="grid h-14 w-14 place-items-center rounded-full ring-1 sm:h-16 sm:w-16" style={{ background: `${hex}14`, ['--tw-ring-color' as any]: `${hex}55` }}>
        <ForceArt element={element} className="h-11 w-11 sm:h-12 sm:w-12" />
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: hex }}>{ELEMENT_NATURE[element].label}</span>
    </div>
  );
};

// the flowing "X bends Y" connector: gradient line + arrowhead + centred verb pill
const ControlFlow: React.FC<{ d: ElementDynamic }> = ({ d }) => {
  const from = ELEMENT_HEX[d.from], to = ELEMENT_HEX[d.to];
  return (
    <div className="relative flex h-14 flex-1 items-center sm:h-16">
      <span className="h-[3px] flex-1 rounded-full" style={{ background: `linear-gradient(90deg, ${from}, ${to})` }} />
      <span
        className="-ml-px h-0 w-0"
        style={{ borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: `9px solid ${to}` }}
      />
      <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-baseline gap-1.5 rounded-full border border-ink/5 bg-white px-3 py-1 shadow-sm">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-ink/80">{d.verb}</span>
        <span className="font-sc text-xs text-stone/55" title="controls (克)">{d.relationCn}</span>
      </span>
    </div>
  );
};

// branch-relation centre mark
const AxisMark: React.FC<{ kind: BranchRelation['kind']; color: string }> = ({ kind, color }) => {
  const p = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (kind === 'clash') return <svg {...p}><path d="M10 6L5 12l5 6" /><path d="M14 6l5 6-5 6" /></svg>;
  if (kind === 'punish') return <svg {...p}><path d="M17 8a6 6 0 10.001 8M17 8V5m0 3h-3" /></svg>;
  if (kind === 'harm') return <svg {...p}><path d="M3 12q3-4 6 0t6 0 6 0" /></svg>;
  return <svg {...p}><path d="M8 12a4 4 0 014-4 4 4 0 014 4M8 12a4 4 0 004 4 4 4 0 004-4" /></svg>;
};

// Horizontal on tablet+, stacked vertically on a narrow phone.
const AxisDiagram: React.FC<{ r: BranchRelation }> = ({ r }) => {
  const color = REL_TONE[r.kind];
  const line = <span className="h-5 w-px sm:h-px sm:w-10" style={{ background: `${color}66` }} />;
  return (
    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-3">
      <span className="font-display text-sm font-semibold text-ink sm:flex-1 sm:text-right">{r.poleA}</span>
      <div className="flex flex-col items-center sm:flex-row">
        {line}
        <span className="my-1 grid h-10 w-10 shrink-0 place-items-center rounded-full sm:mx-1.5 sm:my-0" style={{ background: `${color}22`, boxShadow: `0 0 0 1px ${color}33` }}>
          <AxisMark kind={r.kind} color={color} />
        </span>
        {line}
      </div>
      <span className="font-display text-sm font-semibold text-ink sm:flex-1 sm:text-left">{r.poleB}</span>
    </div>
  );
};

// "The push and pull within you" — forces acting on one another (生克), shown as
// who-bends-whom, and the parts of you that strain or bond (刑冲合害) as axes.
export const Interactions: React.FC<{ data: InteractionsReading }> = ({ data }) => {
  const { accentDeep } = useAccent();
  return (
    <section>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: accentDeep }}>The push and pull within you</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">Your forces aren't separate — they act on each other</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
        In nature nothing stands alone: roots break ground, rain feeds the tree, the blade prunes new growth. The same is true inside you — your strengths lean on and strain against one another, and that friction is where much of your character is made.
      </p>

      {/* element dynamics (生克) — who bends whom */}
      <div className="mt-8 space-y-4">
        {data.dynamics.map((d, i) => (
          <div key={i} className="rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5 shadow-lift">
            <div className="flex items-center gap-3 sm:gap-5">
              <Disc element={d.from} />
              <ControlFlow d={d} />
              <Disc element={d.to} dim />
            </div>
            <p className="mt-5 font-display text-lg font-semibold text-ink">{d.phrase}.</p>
            <p className="mt-1 text-[15px] leading-relaxed text-ink/75">{d.meaning}</p>
          </div>
        ))}
      </div>

      {/* branch relations (刑冲合害) — concrete axes */}
      {data.relations.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {data.relations.map((r, i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-white/55 ring-1 ring-ink/5 shadow-lift">
              <div className="h-1 w-full" style={{ background: REL_TONE[r.kind], opacity: 0.85 }} />
              <div className="p-6">
                <h3 className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-widest" style={{ color: REL_TONE[r.kind] }}>{r.title}</h3>
                <AxisDiagram r={r} />
                <p className="mt-4 text-sm leading-relaxed text-ink/75">{r.theme}</p>
                <p className="mt-3 border-t border-ink/5 pt-3 text-xs italic text-stone">{r.where}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
