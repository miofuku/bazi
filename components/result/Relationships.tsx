import React from 'react';
import { RelationshipReading } from '../../content/xiangfa/relationships';
import { ElementIcon } from './icons';
import { useAccent } from './AtmosphereContext';

const PROMINENCE: Record<RelationshipReading['prominence'], { label: string; dim: boolean }> = {
  strong: { label: 'Strong in you', dim: false },
  present: { label: 'Present', dim: false },
  faint: { label: 'Quiet', dim: true },
};

// "How you meet the world" — the five relationships every living thing has, with
// the prominent ones leading. (The Ten Gods, masked as nature.)
export const Relationships: React.FC<{ items: RelationshipReading[] }> = ({ items }) => {
  const { accent, accentDeep } = useAccent();
  return (
    <section>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: accentDeep }}>How you meet the world</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">Five relationships, in your own measure</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
        Every living thing stands in the same five relationships to the world — what feeds it, what it gives off, what it tends, what prunes it, and its own kind. The mix you carry shapes where life feels easy, and where it asks more of you.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((r) => {
          const meta = PROMINENCE[r.prominence];
          return (
            <div
              key={r.id}
              className={`flex gap-4 rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5 shadow-lift ${meta.dim ? 'opacity-70' : ''}`}
            >
              <span className="mt-0.5 shrink-0" style={{ color: accent }}>
                <ElementIcon type={r.icon} className="h-8 w-8 stroke-[1.4]" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="font-display text-lg font-semibold text-ink">{r.title}</h3>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{ background: meta.dim ? 'rgba(91,102,96,0.12)' : `${accent}22`, color: meta.dim ? '#5B6660' : accentDeep }}
                  >
                    {meta.label}
                  </span>
                </div>
                <p className="mt-1 font-display text-sm italic text-stone">{r.naturePhrase}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{r.meaning}</p>
                <p className="mt-3 border-t border-ink/5 pt-3 text-sm leading-relaxed text-ink/85">{r.flavorText}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
