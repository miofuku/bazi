// 真太阳时 (true solar time) conversion. Bazi's hour pillar is set by the local
// APPARENT solar time, not the civil clock. Two corrections turn clock time into
// true solar time:
//   1. 经度时差 (longitude): civil clocks run on a timezone's standard meridian;
//      每偏离 1° 经度 = 4 分钟. LMT = clock + (longitude − tzMeridian) × 4min.
//   2. 均时差 (equation of time): the sun runs ahead/behind mean time seasonally.
// Verified against docs/名人AA级八字验证集_1.csv (see scripts/checkSolarTime.ts).

export interface CivilTime {
  year: number; month: number; day: number; hour: number; minute: number;
}

const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();

const dayOfYear = (y: number, m: number, d: number): number => {
  let n = d;
  for (let i = 1; i < m; i++) n += daysInMonth(y, i);
  return n;
};

// Equation of time in minutes (approx, ~±30s). Positive = sundial ahead of clock.
export const equationOfTime = (y: number, m: number, d: number): number => {
  const n = dayOfYear(y, m, d);
  const b = ((2 * Math.PI) / 365) * (n - 81);
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
};

/**
 * Convert a civil clock time to true solar time.
 * @param longitude east-positive degrees (e.g. Beijing +116.4, New York −74)
 * @param tzMeridian standard meridian of the clock's timezone, in degrees
 *        (tzOffsetHours × 15). For pure LMT, pass the longitude itself.
 */
export const toTrueSolarTime = (t: CivilTime, longitude: number, tzMeridian: number): CivilTime => {
  const lonCorrection = (longitude - tzMeridian) * 4; // minutes
  const eot = equationOfTime(t.year, t.month, t.day);
  let total = t.hour * 60 + t.minute + lonCorrection + eot;

  // Roll over day boundaries.
  let { year, month, day } = t;
  while (total < 0) {
    total += 1440;
    day -= 1;
    if (day < 1) { month -= 1; if (month < 1) { month = 12; year -= 1; } day = daysInMonth(year, month); }
  }
  while (total >= 1440) {
    total -= 1440;
    day += 1;
    if (day > daysInMonth(year, month)) { day = 1; month += 1; if (month > 12) { month = 1; year += 1; } }
  }

  return { year, month, day, hour: Math.floor(total / 60), minute: Math.round(total % 60) };
};
