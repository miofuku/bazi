// Verification against docs/命理分析.csv — 16 normal people with real-life
// self-reports. Tests the product's core temporal signal: per-year 顺涩
// (favor of the 流年 against 用忌 + structural interactions with the natal
// chart — the same formula the LifeSeasons/daily layers use, minus the 大运
// term, which we can't reconstruct for past years).
//
// Ground truth: good/bad YEARS hand-labelled from each person's 自述.
// Run: npx tsx scripts/checkNormalCases.ts

import { STEMS, BRANCHES } from '../utils/constants';
import { calculateStrength } from '../utils/StrengthCalculator';
import { selectYongshen } from '../utils/YongshenSelector';
import { pillarFavor } from '../utils/timeFavor';
import { structuralFavor } from '../utils/structural';
import { BaziChart, ElementType, Favor, Pillar } from '../types';

const pillar = (gz: string, name: string): Pillar => ({
  stem: STEMS[gz.charAt(0)],
  branch: BRANCHES[gz.charAt(1)],
  name,
});

// Sexagenary pillar of a Gregorian year (1984 = 甲子).
const SEQ_S = '甲乙丙丁戊己庚辛壬癸';
const SEQ_B = '子丑寅卯辰巳午未申酉戌亥';
const yearGz = (y: number) => `${SEQ_S[(((y - 1984) % 10) + 10) % 10]}${SEQ_B[(((y - 1984) % 12) + 12) % 12]}`;

interface Case {
  id: number;
  bazi: [string, string, string, string];
  dayun: string;                     // 当前大运 (from the CSV)
  years: Record<number, 1 | -1>;     // strong labels from the 自述
  weak?: Record<number, 1 | -1>;     // ambiguous labels — reported, not scored
  nowState?: 1 | -1;                 // current overall state (scored vs 当前大运)
  note: string;
}

const CASES: Case[] = [
  { id: 1, bazi: ['甲申', '甲戌', '甲子', '癸酉'], dayun: '辛未', years: {}, note: '22岁 心高气傲 无分年事件' },
  { id: 2, bazi: ['壬申', '己酉', '甲辰', '丁卯'], dayun: '壬子', years: {}, note: '自诊喜壬水印 工作频换' },
  { id: 3, bazi: ['庚辰', '己丑', '乙酉', '丙子'], dayun: '壬辰', years: {}, weak: { 2025: 1 }, note: '985硕25年入央企 26年5月辞职' },
  { id: 4, bazi: ['丁亥', '甲辰', '壬午', '庚戌'], dayun: '壬寅', years: { 2020: -1, 2021: -1, 2022: 1, 2025: 1 }, note: '20/21抑郁 22中考超常 25高考中上' },
  { id: 5, bazi: ['癸未', '壬戌', '甲戌', '壬申'], dayun: '庚申', years: {}, weak: { 2006: -1 }, note: '06年父母离异 家族精神疾病' },
  { id: 6, bazi: ['辛卯', '庚寅', '甲寅', '甲子'], dayun: '壬辰', years: { 2024: -1, 2025: 1 }, weak: { 2026: -1 }, nowState: -1, note: '女 24焦虑失眠 25火来泄秀好转 26春冲突' },
  { id: 7, bazi: ['癸未', '辛酉', '乙未', '壬午'], dayun: '己未', years: {}, weak: { 2026: -1 }, nowState: -1, note: '童年压抑 毕业迷茫' },
  { id: 8, bazi: ['丙戌', '癸巳', '癸卯', '庚申'], dayun: '乙未', years: { 2018: -1, 2023: 1 }, note: '男 23突飞猛进 18高考砸' },
  { id: 9, bazi: ['戊子', '戊午', '癸未', '戊午'], dayun: '丙辰', years: { 2024: -1, 2025: -1 }, nowState: -1, note: '24年起停滞 内耗焦虑' },
  { id: 10, bazi: ['辛未', '甲午', '乙亥', '辛巳'], dayun: '辛卯', years: {}, weak: { 2022: -1 }, note: '22辞职 之后不温不火' },
  { id: 11, bazi: ['庚辰', '辛巳', '庚午', '己卯'], dayun: '戊寅', years: { 2022: -1 }, nowState: -1, note: '22休学崩溃 现焦虑心痛' },
  { id: 12, bazi: ['癸未', '丙辰', '丙寅', '乙未'], dayun: '甲寅', years: { 2021: -1, 2024: -1, 2025: -1 }, weak: { 2017: -1 }, nowState: -1, note: '21离异+高考砸 24/25考研败 26找工不顺' },
  { id: 13, bazi: ['庚辰', '壬午', '乙卯', '丙戌'], dayun: '乙酉', years: { 2018: 1, 2019: -1, 2020: -1, 2025: 1 }, note: '18超常上央财 19-20挂科网贷 25好转' },
  { id: 14, bazi: ['甲申', '壬申', '癸未', '癸亥'], dayun: '庚午', years: {}, weak: { 2026: -1 }, nowState: -1, note: '身世坎坷 26养父病重无钱' },
  { id: 15, bazi: ['戊寅', '戊午', '丁亥', '戊申'], dayun: '庚申', years: { 2019: 1, 2025: 1 }, nowState: 1, note: '19考上本科(后挂科) 25医师证+上班' },
  { id: 16, bazi: ['丁丑', '丁未', '丁巳', '乙巳'], dayun: '甲辰', years: {}, note: '每次大考都砸 无明确年份' },
];

const CN: Record<ElementType, string> = {
  [ElementType.WOOD]: '木', [ElementType.FIRE]: '火', [ElementType.EARTH]: '土',
  [ElementType.METAL]: '金', [ElementType.WATER]: '水',
};
const clamp1 = (n: number) => Math.max(-1, Math.min(1, n));

let hit = 0, miss = 0, weakHit = 0, weakMiss = 0, nowHit = 0, nowMiss = 0;

for (const c of CASES) {
  const [y, m, d, h] = c.bazi;
  const pY = pillar(y, 'Year'), pM = pillar(m, 'Month'), pD = pillar(d, 'Day'), pH = pillar(h, 'Hour');
  const strength = calculateStrength(pY, pM, pD, pH);
  const ys = selectYongshen(strength, m.charAt(1), d.charAt(0));
  const chartLike = { yearPillar: pY, monthPillar: pM, dayPillar: pD, hourPillar: pH, dayMaster: pD.stem } as unknown as BaziChart;

  const favorOf = (gz: string): number => {
    const p = pillar(gz, 'Yr');
    return clamp1(pillarFavor(ys.favor, p) + structuralFavor(p, chartLike, ys.favor).delta);
  };

  const fmt = (Object.keys(ys.favor) as ElementType[])
    .filter((e) => ys.favor[e] !== 'neutral')
    .map((e) => `${CN[e]}${ys.favor[e] === 'favorable' ? '喜' : '忌'}`).join(' ');
  console.log(`\n#${c.id} [${c.bazi.join(' ')}] ${strength.category} · ${fmt} · ${c.note}`);

  const score = (years: Record<number, 1 | -1>, strong: boolean) => {
    for (const [yr, expected] of Object.entries(years)) {
      const f = favorOf(yearGz(Number(yr)));
      const ok = expected > 0 ? f > 0.1 : f < -0.1;
      if (strong) { ok ? hit++ : miss++; } else { ok ? weakHit++ : weakMiss++; }
      console.log(`   ${yr} ${yearGz(Number(yr))} 预期${expected > 0 ? '好' : '差'} → ${f.toFixed(2)} ${ok ? '✓' : '✗'}${strong ? '' : ' (weak)'}`);
    }
  };
  score(c.years, true);
  if (c.weak) score(c.weak, false);

  if (c.nowState !== undefined) {
    const f = clamp1(pillarFavor(ys.favor, pillar(c.dayun, 'DY')) + structuralFavor(pillar(c.dayun, 'DY'), chartLike, ys.favor).delta);
    const ok = c.nowState > 0 ? f > 0.1 : f < -0.1;
    ok ? nowHit++ : nowMiss++;
    console.log(`   当前大运 ${c.dayun} 预期${c.nowState > 0 ? '好' : '差'} → ${f.toFixed(2)} ${ok ? '✓' : '✗'}`);
  }
}

const pct = (a: number, b: number) => (a + b ? `${((a / (a + b)) * 100).toFixed(0)}%` : 'n/a');
console.log(`\n════ 结果 ════`);
console.log(`强标注流年: ${hit}/${hit + miss} (${pct(hit, miss)})  · 随机基线≈50%（三分类下更低）`);
console.log(`弱标注流年: ${weakHit}/${weakHit + weakMiss} (${pct(weakHit, weakMiss)})`);
console.log(`当前大运 vs 现状: ${nowHit}/${nowHit + nowMiss} (${pct(nowHit, nowMiss)})`);
