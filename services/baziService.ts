import { SolarTime, ChildLimit, Gender as TymeGender } from 'tyme4ts';
import { BaziChart, Gender, Pillar, ElementType, DaYun } from '../types';
import { STEMS, BRANCHES } from '../utils/constants';
import { toTrueSolarTime } from '../utils/trueSolarTime';

// Optional birthplace, to correct clock time to 真太阳时 (see trueSolarTime.ts).
export interface Geo {
  longitude: number;    // east-positive degrees
  tzOffsetHours: number; // clock's UTC offset (e.g. -8 for PST); LMT → longitude/15
}

// Safe access to library classes in case of load failure
const SafeSolarTime = typeof SolarTime !== 'undefined' ? SolarTime : null;
const SafeChildLimit = typeof ChildLimit !== 'undefined' ? ChildLimit : null;

export const calculateBazi = (
  year: number,
  month: number,
  day: number,
  hour: number | undefined, // undefined when the birth hour is unknown → 三柱 reading
  minute: number,
  gender: Gender,
  geo?: Geo
): BaziChart => {

  if (!SafeSolarTime || !SafeChildLimit) {
    throw new Error("Tyme4ts library not loaded. Cannot calculate BaZi chart.");
  }

  try {
    // When the hour is unknown, read from 年月日 (三柱): anchor at local noon so the
    // day pillar is stable (away from the 子时 boundary), take no 时柱, and skip
    // 真太阳时 (which only refines the hour). 起运 age is then approximate.
    const hourKnown = typeof hour === 'number';
    const h = hourKnown ? (hour as number) : 12;
    const mi = hourKnown ? minute : 0;

    // 0. Correct clock time to 真太阳时 when a birthplace is given — the hour
    // pillar (and 起运) follow apparent solar time, not the civil clock.
    const st = geo && hourKnown
      ? toTrueSolarTime({ year, month, day, hour: h, minute: mi }, geo.longitude, geo.tzOffsetHours * 15)
      : { year, month, day, hour: h, minute: mi };

    // 1. Initialize SolarTime
    // We use SolarTime as the single source of truth to ensure all pillars (Year, Month, Day, Hour)
    // are consistent with the exact solar term (Jie Qi) timestamp.
    const t = SafeSolarTime.fromYmdHms(st.year, st.month, st.day, st.hour, st.minute, 0);

    // 2. Retrieve GanZhi (Pillars) via chaining
    // In the tyme4ts library, we traverse up from the Hour pillar to ensure context is preserved.
    // Hour -> Day -> Month -> Year
    const hourObj = t.getSixtyCycleHour();
    const dayObj = hourObj.getSixtyCycleDay();
    const monthObj = dayObj.getSixtyCycleMonth();
    const yearObj = monthObj.getSixtyCycleYear();

    // 3. Helper to Parse GanZhi string (e.g., "甲子") into internal Pillar structure
    const parseGanZhi = (ganZhiStr: string, pillarName: string): Pillar => {
      const stemChar = ganZhiStr.charAt(0);
      const branchChar = ganZhiStr.charAt(1);
      const stem = STEMS[stemChar];
      const branch = BRANCHES[branchChar];

      if (!stem || !branch) {
        console.error(`Critical Error: Invalid GanZhi returned from library: ${ganZhiStr}`);
        return {
          stem: STEMS['甲'],
          branch: BRANCHES['子'],
          name: pillarName
        };
      }
      return { stem, branch, name: pillarName };
    };

    // 4. Construct Pillars
    const yearPillar = parseGanZhi(yearObj.getName(), 'Year Pillar');
    const monthPillar = parseGanZhi(monthObj.getName(), 'Month Pillar');
    const dayPillar = parseGanZhi(dayObj.getName(), 'Day Pillar');
    const hourPillar = hourKnown ? parseGanZhi(hourObj.getName(), 'Hour Pillar') : null;

    // 5. Calculate Da Yun (Major Cycles)
    const tymeGender = gender === Gender.MALE ? TymeGender.MAN : TymeGender.WOMAN;
    const childLimit = SafeChildLimit.fromSolarTime(t, tymeGender);
    const startDecade = childLimit.getStartDecadeFortune();

    const daYunList: DaYun[] = [];
    let currentDecade = startDecade;

    // Generate 8 cycles (approx 80 years)
    for (let i = 0; i < 8; i++) {
      const startAge = currentDecade.getStartAge();
      const endAge = currentDecade.getEndAge();
      // robust calculation: Birth Year + Start Age = Cycle Start Year
      const startYear = year + startAge;

      daYunList.push({
        startAge: startAge,
        endAge: endAge,
        year: startYear,
        pillar: parseGanZhi(currentDecade.getName(), `Cycle ${i + 1}`)
      });
      currentDecade = currentDecade.next(1);
    }

    // 6. 人元司令 — the month branch's ruling hidden stem on the birth day.
    // Days from the governing 节 (0-based) drive 分野.
    let rulingStem: string | undefined;
    try {
      const birthDay = t.getSolarDay();
      let term = birthDay.getTerm();
      while (!term.isJie()) term = term.next(-1);
      const daysIntoMonth = birthDay.subtract(term.getSolarDay());
      rulingStem = getRulingStem(monthPillar.branch.chinese, daysIntoMonth)?.stem;
    } catch (e) {
      console.error('Failed to compute 司令:', e);
    }

    return generateChartResult(yearPillar, monthPillar, dayPillar, hourPillar, daYunList, rulingStem);

  } catch (e) {
    console.error("Tyme4ts Library Execution Error:", e);
    throw new Error("Failed to calculate chart using the Bazi engine.");
  }
};

import { calculateDeity, getHiddenStemsForBranch, DEITY_FULL_NAMES } from '../utils/baziCalculator';
import { calculateFiveElementScores } from '../utils/FiveElementScorer';
import { calculateStrength } from '../utils/StrengthCalculator';
import { getRulingStem } from '../utils/qiLing';
import { selectYongshen } from '../utils/YongshenSelector';

// Helper to aggregate counts and return final chart structure
const generateChartResult = (
  yearPillar: Pillar,
  monthPillar: Pillar,
  dayPillar: Pillar,
  hourPillar: Pillar | null,
  daYun: DaYun[],
  rulingStem?: string
): BaziChart => {
  const elementCounts: Record<ElementType, number> = {
    [ElementType.WOOD]: 0,
    [ElementType.FIRE]: 0,
    [ElementType.EARTH]: 0,
    [ElementType.METAL]: 0,
    [ElementType.WATER]: 0,
  };

  const dayMasterChar = dayPillar.stem.chinese;

  // Enrich Pillars with Deities
  const enrichPillar = (pillar: Pillar) => {
    // 1. Stem Deity
    const stemDeityShort = calculateDeity(dayMasterChar, pillar.stem.chinese);
    pillar.stem.deity = DEITY_FULL_NAMES[stemDeityShort];

    // 2. Branch Hidden Stems & Deities
    const hiddenStemData = getHiddenStemsForBranch(pillar.branch.chinese);

    // Convert generic hidden stems to full Stem objects with Deities
    pillar.branch.hiddenStems = hiddenStemData.map(hs => {
      const stemConst = STEMS[hs.stem];
      const deityShort = calculateDeity(dayMasterChar, stemConst.chinese);
      return {
        ...stemConst,
        deity: DEITY_FULL_NAMES[deityShort]
      };
    });

    // 3. Branch Main Qi Deity (First hidden stem is usually Main Qi)
    if (pillar.branch.hiddenStems.length > 0) {
      pillar.branch.deity = pillar.branch.hiddenStems[0].deity;
    }
  };

  const presentPillars = [yearPillar, monthPillar, dayPillar, hourPillar].filter(
    (p): p is Pillar => p !== null,
  );
  presentPillars.forEach(p => {
    enrichPillar(p);

    // Element Counting
    if (p.stem) elementCounts[p.stem.element]++;
    if (p.branch) elementCounts[p.branch.element]++;
  });

  const scores = calculateFiveElementScores(
    yearPillar.stem, yearPillar.branch,
    monthPillar.stem, monthPillar.branch,
    dayPillar.stem, dayPillar.branch,
    hourPillar?.stem, hourPillar?.branch
  );

  const strength = calculateStrength(yearPillar, monthPillar, dayPillar, hourPillar, rulingStem);
  const yongshen = selectYongshen(strength, monthPillar.branch.chinese, dayPillar.stem.chinese);

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster: dayPillar.stem,
    daYun,

    elementCounts,
    elementScores: scores,
    strength,
    yongshen,
  };
};
