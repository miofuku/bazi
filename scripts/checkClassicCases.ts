// Verification against docs/古籍命例.csv — classical cases from 滴天髓阐微 (54)
// and 神峰通考 (69), extracted 2026-07-11. Two axes:
//   1. 旺衰判定: calculateStrength category vs the master's verdict (where the
//      text states one clearly — strong/weak/balanced/follow-*).
//   2. 运标注: per-大运 favor (用忌 supply + structural vs natal — same formula
//      as checkNormalCases' nowState) vs the narrated outcome of that decade.
//      `X=死` marks the death decade (scored as expected-negative AND tallied
//      separately); `?` suffix = weak/uncertain label (reported, not headline).
// No 司令 here — classical cases carry no birth dates. Selection bias caveat:
// these charts were curated to illustrate doctrine; treat as mechanism
// calibration, not an unbiased benchmark.
// Run: npx tsx scripts/checkClassicCases.ts

import { readFileSync } from 'node:fs';
import { STEMS, BRANCHES } from '../utils/constants';
import { calculateStrength } from '../utils/StrengthCalculator';
import { selectYongshen } from '../utils/YongshenSelector';
import { pillarFavor } from '../utils/timeFavor';
import { structuralFavor } from '../utils/structural';
import { BaziChart, ElementType, Pillar, StrengthCategory } from '../types';

const pillar = (gz: string, name: string): Pillar => ({
  stem: STEMS[gz.charAt(0)],
  branch: BRANCHES[gz.charAt(1)],
  name,
});
const GZ = /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/;
const CN: Record<ElementType, string> = {
  [ElementType.WOOD]: '木', [ElementType.FIRE]: '火', [ElementType.EARTH]: '土',
  [ElementType.METAL]: '金', [ElementType.WATER]: '水',
};
const clamp1 = (n: number) => Math.max(-1, Math.min(1, n));

interface Label { gz: string; expected: 1 | -1; weak: boolean; death: boolean }
interface Case {
  id: number; source: string; name: string; bazi: [string, string, string, string];
  expect?: StrengthCategory; summary: string; labels: Label[];
}

const cases: Case[] = [];
const csv = readFileSync(new URL('../docs/古籍命例.csv', import.meta.url), 'utf8');
for (const line of csv.split('\n').slice(1)) {
  if (!line.trim()) continue;
  const f = line.split(',');
  const bazi = [f[4], f[5], f[6], f[7]] as [string, string, string, string];
  if (!bazi.every((p) => GZ.test(p))) throw new Error(`四柱解析失败: ${line.slice(0, 40)}`);
  const labels: Label[] = [];
  for (const item of (f[11] ?? '').split(';').filter(Boolean)) {
    const m = item.match(/^([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])=(\+1|-1|死)(\?)?$/);
    if (!m) throw new Error(`运标注解析失败: ${item} (#${f[0]})`);
    labels.push({ gz: m[1], expected: m[2] === '+1' ? 1 : -1, weak: !!m[3], death: m[2] === '死' });
  }
  cases.push({
    id: Number(f[0]), source: f[1], name: f[2], bazi,
    expect: (f[9] || undefined) as StrengthCategory | undefined,
    summary: f[10] ?? '', labels,
  });
}

// [hit, miss] per bucket
const V: Record<string, [number, number]> = {};   // verdict, keyed by expected category
let vHit = 0, vMiss = 0;
const T = { strong: [0, 0], weak: [0, 0], death: [0, 0] };

for (const c of cases) {
  const [y, m, d, h] = c.bazi;
  const pY = pillar(y, 'Year'), pM = pillar(m, 'Month'), pD = pillar(d, 'Day'), pH = pillar(h, 'Hour');
  const strength = calculateStrength(pY, pM, pD, pH);
  const ys = selectYongshen(strength, m.charAt(1), d.charAt(0));
  const chartLike = { yearPillar: pY, monthPillar: pM, dayPillar: pD, hourPillar: pH, dayMaster: pD.stem } as unknown as BaziChart;

  const fmt = (Object.keys(ys.favor) as ElementType[])
    .filter((e) => ys.favor[e] !== 'neutral')
    .map((e) => `${CN[e]}${ys.favor[e] === 'favorable' ? '喜' : '忌'}`).join(' ');

  let verdictStr = '';
  if (c.expect) {
    const ok = strength.category === c.expect;
    ok ? vHit++ : vMiss++;
    (V[c.expect] ??= [0, 0])[ok ? 0 : 1]++;
    verdictStr = ` · 判定${c.expect} ${ok ? '✓' : `✗(算得${strength.category})`}`;
  }
  console.log(`\n#${c.id} ${c.source}·${c.name} [${c.bazi.join(' ')}] ${strength.category}(${(strength.supportShare * 100).toFixed(0)}%) · ${fmt}${verdictStr}`);

  for (const lab of c.labels) {
    const p = pillar(lab.gz, 'DY');
    const favor = clamp1(pillarFavor(ys.favor, p) + structuralFavor(p, chartLike, ys.favor).delta);
    const ok = lab.expected > 0 ? favor > 0.1 : favor < -0.1;
    T[lab.weak ? 'weak' : 'strong'][ok ? 0 : 1]++;
    if (lab.death) T.death[ok ? 0 : 1]++;
    console.log(`   ${lab.gz}运 预期${lab.death ? '死' : lab.expected > 0 ? '好' : '差'} → ${favor.toFixed(2)} ${ok ? '✓' : '✗'}${lab.weak ? ' (weak)' : ''}`);
  }
}

const pct = (t: [number, number] | number[]) =>
  t[0] + t[1] ? `${t[0]}/${t[0] + t[1]} (${((t[0] / (t[0] + t[1])) * 100).toFixed(0)}%)` : 'n/a';
console.log(`\n════ 结果 ════`);
console.log(`旺衰判定 vs 宗师: ${pct([vHit, vMiss])}`);
for (const [cat, t] of Object.entries(V)) console.log(`  ${cat.padEnd(13)} ${pct(t)}`);
console.log(`强标注大运: ${pct(T.strong)}  · 随机基线≈50%（三分类下更低）`);
console.log(`弱标注大运: ${pct(T.weak)}`);
console.log(`  其中死运(忌向): ${pct(T.death)}`);
