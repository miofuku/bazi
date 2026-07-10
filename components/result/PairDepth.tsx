import React from 'react';
import { PairNarrative } from '../../content/xiangfa/pair';
import { RELATIONSHIPS } from '../../content/xiangfa/relationships';
import { NatureArt } from '../illustrations/NatureArt';
import { ForceArt } from '../illustrations/ForceArt';
import { PERSON, WIND, windHex, REL_TONE } from '../../utils/tokens';

// The paired report's depth sections, in reading order:
//   A1 what you are to each other · A2 who holds whose needs ·
//   C where the charts rub or lock · B your decades, in step.
// The joint storyline (PairStoryline) closes the page separately, after roles.

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-sage-deep">{children}</p>
);

// ── A1 · what you are to each other ──────────────────────────────────────────
const MutualNature: React.FC<{ n: PairNarrative }> = ({ n }) => (
  <div className="mt-6 rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5 shadow-lift">
    <Eyebrow>What you are to each other</Eyebrow>
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      {n.mutual.map((m, i) => {
        const otherReading = i === 0 ? n.readingB : n.readingA;
        const otherHex = i === 0 ? PERSON.b : PERSON.a;
        return (
          <div key={m.self} className="rounded-xl bg-white/60 p-5 ring-1 ring-ink/5">
            <div className="flex items-center gap-3">
              <NatureArt id={otherReading.stem.symbol} accent={otherHex} className="h-12 w-12 shrink-0" />
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">To {m.self}, {m.other} is</h3>
                <p className="font-display text-sm italic text-stone">{m.naturePhrase}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">{m.line}</p>
            <p className="mt-3 border-t border-ink/5 pt-2 text-xs leading-relaxed text-stone">{RELATIONSHIPS[m.id].meaning}</p>
          </div>
        );
      })}
    </div>
    <p className="mt-4 text-sm italic leading-relaxed text-stone">{n.mutualNote}</p>
  </div>
);

// ── A2 · what you each need — and who holds it ───────────────────────────────
const LEVEL_LABEL = { plenty: 'Holds plenty', some: 'Has some', thin: 'Runs thin' } as const;
const LEVEL_HEX = { plenty: WIND.tailwind, some: WIND.even, thin: WIND.headwind } as const;

const NeedExchange: React.FC<{ n: PairNarrative }> = ({ n }) => {
  const byPerson = [n.needRows.slice(0, 2), n.needRows.slice(2)];
  return (
    <div className="mt-6 rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5 shadow-lift">
      <Eyebrow>What you each need — and who holds it</Eyebrow>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
        Every nature has conditions it grows toward. Read against the other person's makeup, each need becomes a simple question: is the weather you're short on something they carry?
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {byPerson.map((rows, i) => (
          <div key={i} className="flex flex-col gap-3">
            <h3 className="font-display text-base font-semibold" style={{ color: i === 0 ? PERSON.a : PERSON.b }}>
              What {rows[0]?.who} needs
            </h3>
            {rows.map((r) => (
              <div key={r.need.id} className="rounded-xl bg-white/60 p-4 ring-1 ring-ink/5">
                <div className="flex items-center gap-2.5">
                  <ForceArt element={r.need.element} className="h-8 w-8 shrink-0" />
                  <span className="text-sm font-semibold text-ink">{r.need.label}</span>
                  <span
                    className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{ background: `${LEVEL_HEX[r.otherLevel]}1f`, color: LEVEL_HEX[r.otherLevel] }}
                  >
                    {r.other}: {LEVEL_LABEL[r.otherLevel]}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">{r.line}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── C · where the charts rub, where they lock ────────────────────────────────
const CrossBonds: React.FC<{ n: PairNarrative }> = ({ n }) => (
  <div className="mt-6 rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5 shadow-lift">
    <Eyebrow>Where you rub, where you lock</Eyebrow>
    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
      Set the two charts side by side and the same parts of life face each other — core to core, root to root. Where they lock, being together runs easy; where they grind, you've found the friction that keeps returning.
    </p>
    {n.cross.length === 0 ? (
      <p className="mt-4 text-sm italic text-stone">
        No sharp cross-currents between your charts — an unusually even meeting. What friction you have, you make yourselves.
      </p>
    ) : (
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {n.cross.map((r, i) => (
          <div key={i} className="overflow-hidden rounded-xl bg-white/60 ring-1 ring-ink/5">
            <div className="h-1 w-full" style={{ background: REL_TONE[r.kind], opacity: 0.85 }} />
            <div className="p-5">
              <h3 className="font-sans text-[11px] font-semibold uppercase tracking-widest" style={{ color: REL_TONE[r.kind] }}>{r.title}</h3>
              <p className="mt-2 font-display text-base font-semibold text-ink">{r.poleA} · {r.poleB}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">{r.theme}</p>
              <p className="mt-3 border-t border-ink/5 pt-2 text-xs italic text-stone">{r.where}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ── B · your decades, in step ────────────────────────────────────────────────
const SharedSeasons: React.FC<{ n: PairNarrative }> = ({ n }) => {
  const span = n.windowTo - n.windowFrom;
  const pct = (y: number) => ((y - n.windowFrom) / span) * 100;
  return (
    <div className="mt-6 rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5 shadow-lift">
      <Eyebrow>Your decades, in step</Eyebrow>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
        Each of you moves through your own long weathers. Laid side by side, they show when the wind carries you both — and when one of you has more to spare than the other.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {n.bands.map((band, i) => (
          <div key={band.label} className="flex items-center gap-3">
            <span className="w-20 shrink-0 truncate text-right text-sm font-semibold" style={{ color: i === 0 ? PERSON.a : PERSON.b }}>
              {band.label}
            </span>
            <div className="flex h-3 flex-1 overflow-hidden rounded-full ring-1 ring-ink/5">
              {band.segments.map((s) => (
                <div
                  key={s.fromYear}
                  style={{ width: `${((s.toYear - s.fromYear) / span) * 100}%`, background: windHex(s.favor) }}
                  title={`${s.fromYear}–${s.toYear - 1}`}
                />
              ))}
            </div>
          </div>
        ))}
        {/* year ticks */}
        <div className="ml-[5.75rem] flex justify-between text-[10px] uppercase tracking-wider text-stone/60">
          {[0, 10, 20, 30].map((off) => <span key={off}>{n.windowFrom + off}</span>)}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {n.joint.length > 0 ? (
          n.joint.map((w) => (
            <span key={w.fromYear} className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${WIND.tailwind}1f`, color: WIND.tailwind }}>
              Shared tailwind · {w.fromYear}–{w.toYear - 1}
            </span>
          ))
        ) : (
          <span className="text-sm italic text-stone">
            No long shared tailwind in the next thirty years — your strong stretches alternate. That has its own use: one carries while the other rebuilds.
          </span>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink/75">{n.nowLine}</p>
    </div>
  );
};

export const PairDepth: React.FC<{ narrative: PairNarrative }> = ({ narrative }) => (
  <>
    <MutualNature n={narrative} />
    <NeedExchange n={narrative} />
    <CrossBonds n={narrative} />
    <SharedSeasons n={narrative} />
  </>
);

// ── D · one line, two natures ────────────────────────────────────────────────
export const PairStoryline: React.FC<{ narrative: PairNarrative }> = ({ narrative }) => (
  <div className="mt-6 rounded-3xl bg-white/45 p-8 ring-1 ring-ink/5 shadow-lift md:p-10">
    <Eyebrow>Your story, together</Eyebrow>
    <h3 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">One line, two natures</h3>
    <div className="mt-8">
      {narrative.beats.map((text, i) => (
        <div key={i} className="flex gap-5 pb-8 last:pb-0">
          <div className="flex flex-col items-center">
            <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-sage" />
            {i < narrative.beats.length - 1 && <div className="mt-2 w-px flex-1 bg-sage/25" />}
          </div>
          <p className="flex-1 text-[15px] leading-relaxed text-ink/85">{text}</p>
        </div>
      ))}
    </div>
  </div>
);
