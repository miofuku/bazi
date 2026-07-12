import React, { useEffect, useMemo, useState } from 'react';
import { BaziChart, ElementType } from '../../types';
import { buildDailyReading, getDayPillar, computeDayFavor } from '../../services/dailyService';
import { NatureArt } from '../illustrations/NatureArt';
import { STEM_PROFILES } from '../../content/xiangfa';
import { GOALS, GoalId, goalAdvice, goalWindNote } from '../../content/xiangfa/goals';
import { ELEMENT_HEX, WIND, windTone, windHex } from '../../utils/tokens';
import { useAccent } from './AtmosphereContext';

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// A day's 顺涩 (climate-bounded: 流日 weather within the 大运/流年 climate) → a wind.
// Same voice as the life-seasons, pointed at the day. Not luck; the sort of day it is.
const WIND_LABEL: Record<ReturnType<typeof windTone>, string> = { tailwind: 'Tailwind', even: 'Even', headwind: 'Headwind' };
const windOf = (favor: number) => {
  const t = windTone(favor);
  return { label: WIND_LABEL[t], hex: WIND[t] };
};

// A daily "weather" calendar — what kind of day today is for this nature, and a
// month you can click through. Not fortune; the same ecological framing as the
// rest of the reading, pointed at the day instead of the birth.
export const DailyCalendar: React.FC<{ chart: BaziChart }> = ({ chart }) => {
  const { accent, accentDeep } = useAccent();
  const today = useMemo(() => new Date(), []);
  const [selected, setSelected] = useState<Date>(today);

  // A short-term goal the daily posture is re-voiced toward — persisted locally
  // (the reading never leaves the device). Toggling the active goal clears it.
  const [goal, setGoal] = useState<GoalId | null>(() => {
    if (typeof window === 'undefined') return null;
    const s = window.localStorage.getItem('rootwise.dailyGoal');
    return GOALS.some((g) => g.id === s) ? (s as GoalId) : null;
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (goal) window.localStorage.setItem('rootwise.dailyGoal', goal);
    else window.localStorage.removeItem('rootwise.dailyGoal');
  }, [goal]);

  const reading = useMemo(() => buildDailyReading(chart, selected), [chart, selected]);
  // The day's own nature (丙 = Sun, 丁 = Flame …) — keyed on the stem, not just
  // the element, so consecutive Yang/Yin days read distinctly.
  const dayNature = reading ? STEM_PROFILES[reading.dayPillar.stem.chinese as keyof typeof STEM_PROFILES] : null;

  // Cells for the current month, padded so the 1st lands on its weekday.
  const cells = useMemo(() => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out: { date: Date; element: ElementType | null; favor: number | null }[] = [];
    for (let i = 0; i < firstWeekday; i++) out.push({ date: null as unknown as Date, element: null, favor: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const pillar = getDayPillar(date);
      out.push({ date, element: pillar ? pillar.stem.element : null, favor: computeDayFavor(chart, date)?.favor ?? null });
    }
    return out;
  }, [today, chart]);

  const monthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <section>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: accentDeep }}>
        Day by day
      </p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">Every day has its own weather</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
        Every day carries its own element. Read against your nature, each one leans a little with you or against you — a day to push out, to gather, or to rest. These are small differences within your larger weather, not good days and bad ones: read them against each other, for the sort of day it is and how to grow with it.
      </p>

      {/* Optional goal lens — re-voices each day's posture toward what you're
          working on. Pacing advice, not a forecast; toggling clears it. */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-ink/45">Working toward something?</span>
        {GOALS.map((g) => {
          const on = goal === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setGoal(on ? null : g.id)}
              aria-pressed={on}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sage ${
                on
                  ? 'border-sage bg-sage text-white'
                  : 'border-sage/40 text-sage-deep hover:border-sage hover:bg-sage/10'
              }`}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* ---- Month grid ---- */}
        <div className="rounded-2xl bg-white/55 p-5 ring-1 ring-ink/5 shadow-lift">
          <div className="mb-4 text-center">
            <span className="font-display text-lg font-semibold text-ink">{monthLabel}</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((d, i) => (
              <span key={i} className="pb-1 text-[10px] font-semibold uppercase tracking-wider text-ink/40">
                {d}
              </span>
            ))}
            {cells.map((cell, i) => {
              if (!cell.date) return <span key={i} />;
              const isToday = sameDay(cell.date, today);
              const isSelected = sameDay(cell.date, selected);
              const hex = cell.element ? ELEMENT_HEX[cell.element] : '#999';
              return (
                <button
                  key={i}
                  onClick={() => setSelected(cell.date)}
                  className="relative aspect-square rounded-lg text-sm transition-all hover:scale-105"
                  style={{
                    background: isSelected ? hex : `${hex}1f`,
                    color: isSelected ? '#fff' : '#26302B',
                    boxShadow: isToday && !isSelected ? `inset 0 0 0 1.5px ${hex}` : undefined,
                    fontWeight: isToday || isSelected ? 600 : 400,
                  }}
                >
                  {cell.date.getDate()}
                  {cell.favor != null && (
                    <span
                      className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
                      style={{ background: windHex(cell.favor), boxShadow: isSelected ? '0 0 0 1px #ffffffaa' : undefined }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend — element fill (kind of day) + the corner dot (its weather) */}
          <div className="mt-4 flex flex-wrap gap-3 border-t border-ink/5 pt-3">
            {(Object.keys(ELEMENT_HEX) as ElementType[]).map((el) => (
              <span key={el} className="flex items-center gap-1.5 text-[11px] text-ink/60">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: ELEMENT_HEX[el] }} />
                {el}
              </span>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {(['Tailwind', 'Even', 'Headwind'] as const).map((label) => {
              const hex = label === 'Tailwind' ? WIND.tailwind : label === 'Headwind' ? WIND.headwind : WIND.even;
              return (
                <span key={label} className="flex items-center gap-1.5 text-[11px] text-ink/50">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: hex }} />
                  {label}
                </span>
              );
            })}
          </div>
        </div>

        {/* ---- Selected-day card ---- */}
        {reading && (
          <div className="flex flex-col rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5 shadow-lift">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: accentDeep }}>
                  {sameDay(reading.date, today)
                    ? 'Today'
                    : reading.date.toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
                <p className="mt-1 text-sm text-ink/60">
                  {reading.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <NatureArt id={dayNature?.symbol ?? 'sun'} accent={ELEMENT_HEX[reading.element]} className="h-11 w-11" />
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: ELEMENT_HEX[reading.element] }}>
                  {dayNature?.archetypeName.replace(/^The\s+/i, '')}
                </span>
              </div>
            </div>

            {reading.favor != null && (() => { const w = windOf(reading.favor); return (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider" style={{ background: `${w.hex}1f`, color: w.hex }}>{w.label}</span>
              </div>
            ); })()}

            <h3 className="font-display text-xl font-semibold text-ink">{reading.content.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">{reading.content.body}</p>

            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/45">Good for</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {reading.content.goodFor.map((g) => (
                  <span
                    key={g}
                    className="rounded-full px-3 py-1 text-xs"
                    style={{ background: `${accent}1f`, color: accentDeep }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              <span className="font-semibold text-ink/80">Ease off: </span>
              {reading.content.easeOff}
            </p>

            {goal && (() => {
              const g = GOALS.find((x) => x.id === goal)!;
              const wind = reading.favor != null ? windTone(reading.favor) : 'even';
              const note = goalWindNote(wind);
              return (
                <div className="mt-4 rounded-xl p-4 ring-1" style={{ background: `${accent}12`, ['--tw-ring-color' as any]: `${accent}33` }}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: accentDeep }}>
                    Toward your {g.toward}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/85">{goalAdvice(goal, reading.mode)}</p>
                  {note && <p className="mt-2 text-xs italic leading-relaxed text-stone">{note}</p>}
                </div>
              );
            })()}

            <p className="mt-4 border-t border-ink/5 pt-3 text-xs italic leading-relaxed text-stone">
              {reading.balanceNote}
            </p>

            {reading.layers && (
              <p className="mt-2 text-[11px] leading-relaxed text-stone/70">
                Set within a {windOf(reading.layers.year).label.toLowerCase()} year and a {windOf(reading.layers.daYun).label.toLowerCase()} decade — the day moves inside that larger weather, not past it.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
