import { Gender } from '../types';

// A reading is deterministic from its birth data, so a reading IS a URL:
//   single — ?d=2000-06-15&t=12:00&g=m[&lon=121.5&tz=8]
//   pair   — ?ad=…&at=…&ag=m&al=Ana&bd=…&bg=f&bl=Ben&lens=work
// This is what makes results shareable, emailable, and returnable-to after a
// purchase without any backend — the browser simply recomputes the reading.

export interface SharedBirth {
  year: number; month: number; day: number;
  hour?: number; minute: number;
  gender: Gender;
  lon?: number; tzOffsetHours?: number; // resolved 真太阳时 correction, if used
}
export interface SharedPairPerson extends SharedBirth { label: string }
export type PairLens = 'partner' | 'marriage';

const pad = (n: number) => String(n).padStart(2, '0');
const inRange = (n: number, lo: number, hi: number) => Number.isFinite(n) && n >= lo && n <= hi;

// ── prefixed read/write of one birth ('' for single, 'a'/'b' for pair) ───────
const writeBirth = (p: URLSearchParams, pre: string, b: SharedBirth) => {
  p.set(`${pre}d`, `${b.year}-${pad(b.month)}-${pad(b.day)}`);
  if (b.hour !== undefined) p.set(`${pre}t`, `${pad(b.hour)}:${pad(b.minute)}`);
  p.set(`${pre}g`, b.gender === Gender.MALE ? 'm' : 'f');
  if (b.lon !== undefined && b.tzOffsetHours !== undefined) {
    p.set(`${pre}lon`, String(b.lon));
    p.set(`${pre}tz`, String(b.tzOffsetHours));
  }
};

const readBirth = (p: URLSearchParams, pre: string): SharedBirth | null => {
  const d = p.get(`${pre}d`);
  const g = p.get(`${pre}g`);
  if (!d || !g) return null;

  const dm = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dm || (g !== 'm' && g !== 'f')) return null;
  const year = Number(dm[1]), month = Number(dm[2]), day = Number(dm[3]);
  if (!inRange(year, 1900, 2100) || !inRange(month, 1, 12) || !inRange(day, 1, 31)) return null;

  let hour: number | undefined;
  let minute = 0;
  const t = p.get(`${pre}t`);
  if (t) {
    const tm = t.match(/^(\d{2}):(\d{2})$/);
    if (!tm) return null;
    hour = Number(tm[1]); minute = Number(tm[2]);
    if (!inRange(hour, 0, 23) || !inRange(minute, 0, 59)) return null;
  }

  const lonStr = p.get(`${pre}lon`);
  const tzStr = p.get(`${pre}tz`);
  let lon: number | undefined, tzOffsetHours: number | undefined;
  if (lonStr !== null && tzStr !== null) {
    lon = Number(lonStr); tzOffsetHours = Number(tzStr);
    if (!inRange(lon, -180, 180) || !inRange(tzOffsetHours, -12, 14)) return null;
  }

  return { year, month, day, hour, minute, gender: g === 'm' ? Gender.MALE : Gender.FEMALE, lon, tzOffsetHours };
};

// ── single reading ────────────────────────────────────────────────────────────
export const encodeBirth = (b: SharedBirth): string => {
  const p = new URLSearchParams();
  writeBirth(p, '', b);
  return `?${p.toString()}`;
};

export const decodeBirth = (search: string): SharedBirth | null =>
  readBirth(new URLSearchParams(search), '');

// ── paired reading ────────────────────────────────────────────────────────────
const LENS_PARAM: Record<PairLens, string> = { partner: 'work', marriage: 'love' };

export const encodePair = (a: SharedPairPerson, b: SharedPairPerson, lens: PairLens): string => {
  const p = new URLSearchParams();
  writeBirth(p, 'a', a);
  if (a.label) p.set('al', a.label);
  writeBirth(p, 'b', b);
  if (b.label) p.set('bl', b.label);
  p.set('lens', LENS_PARAM[lens]);
  return `?${p.toString()}`;
};

export const decodePair = (search: string): { a: SharedPairPerson; b: SharedPairPerson; lens: PairLens } | null => {
  const p = new URLSearchParams(search);
  const lensParam = p.get('lens');
  const lens = (Object.keys(LENS_PARAM) as PairLens[]).find((k) => LENS_PARAM[k] === lensParam);
  const a = readBirth(p, 'a');
  const b = readBirth(p, 'b');
  if (!a || !b || !lens) return null;
  return {
    a: { ...a, label: p.get('al') ?? 'Person A' },
    b: { ...b, label: p.get('bl') ?? 'Person B' },
    lens,
  };
};
