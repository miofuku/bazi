import React, { useMemo, useState } from 'react';
import { BaziChart, ElementType } from '../../types';
import { buildDailyReading, getDayPillar } from '../../services/dailyService';
import { ForceArt } from '../illustrations/ForceArt';
import { useAccent } from './AtmosphereContext';

// Element colours from the Tailwind palette (index.html), used to tint each day.
const ELEMENT_HEX: Record<ElementType, string> = {
  [ElementType.WOOD]: '#4A6741',
  [ElementType.FIRE]: '#C4664A',
  [ElementType.EARTH]: '#8C7051',
  [ElementType.METAL]: '#8A8C84',
  [ElementType.WATER]: '#3D5A6C',
};

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// A daily "weather" calendar — what kind of day today is for this nature, and a
// month you can click through. Not fortune; the same ecological framing as the
// rest of the reading, pointed at the day instead of the birth.
export const DailyCalendar: React.FC<{ chart: BaziChart }> = ({ chart }) => {
  const { accent, accentDeep } = useAccent();
  const today = useMemo(() => new Date(), []);
  const [selected, setSelected] = useState<Date>(today);

  const reading = useMemo(() => buildDailyReading(chart, selected), [chart, selected]);

  // Cells for the current month, padded so the 1st lands on its weekday.
  const cells = useMemo(() => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out: { date: Date; element: ElementType | null }[] = [];
    for (let i = 0; i < firstWeekday; i++) out.push({ date: null as unknown as Date, element: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const pillar = getDayPillar(date);
      out.push({ date, element: pillar ? pillar.stem.element : null });
    }
    return out;
  }, [today]);

  const monthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <section>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: accentDeep }}>
        Your days
      </p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">A calendar of weather, not fortune</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
        Every day carries its own element. Read against your nature, each one becomes a kind of weather — a day to push out, to gather, to rest. Not luck or destiny; just the sort of day it is for you, and how to grow with it.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* ---- Month grid ---- */}
        <div className="rounded-2xl bg-white/55 p-5 ring-1 ring-ink/5">
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
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3 border-t border-ink/5 pt-3">
            {(Object.keys(ELEMENT_HEX) as ElementType[]).map((el) => (
              <span key={el} className="flex items-center gap-1.5 text-[11px] text-ink/60">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: ELEMENT_HEX[el] }} />
                {el}
              </span>
            ))}
          </div>
        </div>

        {/* ---- Selected-day card ---- */}
        {reading && (
          <div className="flex flex-col rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5">
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
                <ForceArt element={reading.element} className="h-10 w-10" />
                <span className="font-sc text-2xl" style={{ color: ELEMENT_HEX[reading.element] }}>
                  {reading.dayPillar.stem.chinese}
                  {reading.dayPillar.branch.chinese}
                </span>
              </div>
            </div>

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

            <p className="mt-4 border-t border-ink/5 pt-3 text-xs italic leading-relaxed text-stone">
              {reading.balanceNote}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
