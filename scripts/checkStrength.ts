// Sanity / validation harness for the strength engine (Phase 1).
// Run: npx tsx scripts/checkStrength.ts
//
// Charts are given directly as GanZhi so results are deterministic and
// independent of the calendar library. Add 命例 with a confirmed verdict to
// CASES as they come in, and compare `expect` against the computed category.

import { STEMS, BRANCHES } from '../utils/constants';
import { calculateStrength } from '../utils/StrengthCalculator';
import { getRulingStem } from '../utils/qiLing';
import { Pillar, StrengthCategory } from '../types';

const pillar = (ganZhi: string, name: string): Pillar => ({
  stem: STEMS[ganZhi.charAt(0)],
  branch: BRANCHES[ganZhi.charAt(1)],
  name,
});

interface Case {
  label: string;
  bazi: [string, string, string, string]; // 年 月 日 时
  daysIntoMonth?: number; // 0-based offset from the governing 节, enables 司令
  expect?: StrengthCategory;
}

const CASES: Case[] = [
  {
    label: '木旺极端：壬子 癸卯 甲寅 乙亥 (甲生卯月，水木一片)',
    bazi: ['壬子', '癸卯', '甲寅', '乙亥'],
    expect: 'follow-strong',
  },
  {
    label: '金旺木衰：庚申 乙酉 甲戌 辛未 (甲生酉月，金土围剿)',
    bazi: ['庚申', '乙酉', '甲戌', '辛未'],
    expect: 'weak',
  },
  {
    label: '得令有根：戊寅 甲寅 甲子 庚寅 (甲生寅月，两禄一印，无冲)',
    bazi: ['戊寅', '甲寅', '甲子', '庚寅'],
    expect: 'strong',
  },
  {
    label: '火无根：辛丑 庚子 丙申 戊子 (丙生子月，申子水局，火木死绝→从)',
    bazi: ['辛丑', '庚子', '丙申', '戊子'],
    expect: 'follow-weak',
  },
  // ── 用户提供的命例 (2026-07-07)，待确认结论 ─────────────────────────────
  {
    label: '命例一：丙寅 乙未 庚辰 戊寅 (1986.8.4，未月28日入，己土司令，近申)',
    bazi: ['丙寅', '乙未', '庚辰', '戊寅'],
    daysIntoMonth: 28,
    expect: 'balanced',
  },
  {
    label: '命例二：庚午 庚辰 辛丑 甲午 (辛生辰月，用户判明显偏强)',
    bazi: ['庚午', '庚辰', '辛丑', '甲午'],
    expect: 'strong',
  },
  {
    label: '命例三：癸亥 壬戌 辛卯 壬辰 (辛生戌月)',
    bazi: ['癸亥', '壬戌', '辛卯', '壬辰'],
  },
  {
    label: '命例四：丙子 甲午 壬寅 丙午 (壬生午月，双午冲子拔根，金水为忌→从财)',
    bazi: ['丙子', '甲午', '壬寅', '丙午'],
    expect: 'follow-weak',
  },
];

const fmt = (n: number) => n.toFixed(2).padStart(6);

for (const c of CASES) {
  const [y, m, d, h] = c.bazi;
  const rulingStem =
    c.daysIntoMonth !== undefined
      ? getRulingStem(m.charAt(1), c.daysIntoMonth)?.stem
      : undefined;
  const r = calculateStrength(
    pillar(y, 'Year'),
    pillar(m, 'Month'),
    pillar(d, 'Day'),
    pillar(h, 'Hour'),
    rulingStem,
  );

  const ok = c.expect ? (r.category === c.expect ? '✓' : `✗ expected ${c.expect}`) : '';
  console.log(`\n${c.label}`);
  console.log(
    `  power  Wood${fmt(r.elementPower.Wood)}  Fire${fmt(r.elementPower.Fire)}  Earth${fmt(
      r.elementPower.Earth,
    )}  Metal${fmt(r.elementPower.Metal)}  Water${fmt(r.elementPower.Water)}`,
  );
  console.log(
    `  同党 ${r.dayElement}+${r.resourceElement} = ${(r.supportShare * 100).toFixed(1)}%  ${
      r.rooted ? '有根' : '无根'
    }  →  ${r.category}  ${ok}`,
  );
}
