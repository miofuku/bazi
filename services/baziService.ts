import { SolarTime, ChildLimit, Gender as TymeGender } from 'tyme4ts'; 
import { BaziChart, Gender, Pillar, ElementType, DaYun } from '../types';
import { STEMS, BRANCHES } from '../utils/constants';

// Safe access to library classes in case of load failure
const SafeSolarTime = typeof SolarTime !== 'undefined' ? SolarTime : null;
const SafeChildLimit = typeof ChildLimit !== 'undefined' ? ChildLimit : null;

export const calculateBazi = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  gender: Gender
): BaziChart => {
  
  if (!SafeSolarTime || !SafeChildLimit) {
    throw new Error("Tyme4ts library not loaded. Cannot calculate BaZi chart.");
  }

  try {
    // 1. Initialize SolarTime
    // We use SolarTime as the single source of truth to ensure all pillars (Year, Month, Day, Hour)
    // are consistent with the exact solar term (Jie Qi) timestamp.
    const t = SafeSolarTime.fromYmdHms(year, month, day, hour, minute, 0);
    
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
    const hourPillar = parseGanZhi(hourObj.getName(), 'Hour Pillar');

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
        pillar: parseGanZhi(currentDecade.getName(), `Cycle ${i+1}`)
      });
      currentDecade = currentDecade.next(1);
    }

    return generateChartResult(yearPillar, monthPillar, dayPillar, hourPillar, daYunList);

  } catch (e) {
    console.error("Tyme4ts Library Execution Error:", e);
    throw new Error("Failed to calculate chart using the Bazi engine.");
  }
};

// Helper to aggregate counts and return final chart structure
const generateChartResult = (
  yearPillar: Pillar, 
  monthPillar: Pillar, 
  dayPillar: Pillar, 
  hourPillar: Pillar, 
  daYun: DaYun[]
): BaziChart => {
  const elementCounts: Record<ElementType, number> = {
    [ElementType.WOOD]: 0,
    [ElementType.FIRE]: 0,
    [ElementType.EARTH]: 0,
    [ElementType.METAL]: 0,
    [ElementType.WATER]: 0,
  };

  [yearPillar, monthPillar, dayPillar, hourPillar].forEach(p => {
    if (p.stem) elementCounts[p.stem.element]++;
    if (p.branch) elementCounts[p.branch.element]++;
  });

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster: dayPillar.stem,
    daYun,
    elementCounts
  };
