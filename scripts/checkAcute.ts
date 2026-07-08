// Verify 应期精修 (utils/acuteTiming.ts) against docs/名人AA级八字验证集.csv death years.
// For each person with a known death, rank every year of life by acute-danger score and
// report where the actual death year lands. Signal = death years cluster near the top.
// Run: npx tsx scripts/checkAcute.ts

import * as fs from 'fs';
import { SolarTime } from 'tyme4ts';
import { calculateBazi } from '../services/baziService';
import { acuteDanger } from '../utils/acuteTiming';
import { STEMS, BRANCHES } from '../utils/constants';
import { Gender, Pillar } from '../types';

const splitCsv = (l: string): string[] => {
  const out: string[] = []; let cur = ''; let q = false;
  for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { out.push(cur); cur = ''; } else cur += ch; }
  out.push(cur); return out;
};

const yearPillar = (y: number): Pillar => {
  const gz = SolarTime.fromYmdHms(y, 7, 1, 12, 0, 0).getSixtyCycleHour().getYear().getName();
  return { stem: STEMS[gz.charAt(0)], branch: BRANCHES[gz.charAt(1)], name: 'Y' };
};

const rows = fs.readFileSync('docs/名人AA级八字验证集.csv', 'utf8').replace(/^﻿/, '')
  .split('\n').slice(1).filter((l) => l.trim()).map(splitCsv);

const DEATH_WORD = /(身亡|病逝|逝|自杀|过量|处决|意外|猝逝|崩逝|去世|身故)/;
// 大运 direction depends on gender — the CSV has no column, so name the women.
const FEMALE = new Set(['玛丽莲·梦露', '珍妮丝·乔普林', '伊丽莎白·泰勒', '格蕾丝·凯利', '伊丽莎白二世', '戴安娜王妃', '玛格丽特公主', '维多利亚女王', '梅根·马克尔']);
const ALIVE = new Set(['巴拉克·奥巴马', '唐纳德·特朗普', '查尔斯三世', '威廉王子', '乔治小王子', '哈里王子', '卡尔十六世·古斯塔夫', '威廉-亚历山大', '梅根·马克尔']);

interface Res { name: string; deathYear: number; rank: number; total: number; pct: number; score: number; flags: string[]; top: string; }
const results: Res[] = [];

for (const f of rows) {
  const name = f[0].split(' ')[0];
  const summary = f[17] || '';
  const [by, bmo, bd] = f[2].split('-').map(Number);
  const [h, mi] = f[8].split(':').map(Number); // 真太阳时
  if (ALIVE.has(name)) continue; // still living — skip (regex can catch a relative's death)
  const ageM = summary.match(/(\d{2,3})岁/);
  if (!ageM || !DEATH_WORD.test(summary)) continue; // no death marker
  const deathAge = Number(ageM[1]);
  const deathYear = by + deathAge;

  const chart = calculateBazi(by, bmo, bd, h, mi, FEMALE.has(name) ? Gender.FEMALE : Gender.MALE);
  const daYun = chart.daYun ?? [];
  if (!daYun.length) continue;
  const firstAge = daYun[0].startAge;

  const scored: { year: number; score: number; flags: string[] }[] = [];
  for (let y = by + firstAge; y <= deathYear + 3; y++) {
    const cyc = daYun.find((c, i) => y >= c.year && (!daYun[i + 1] || y < daYun[i + 1].year));
    if (!cyc) continue;
    const d = acuteDanger(chart, cyc.pillar, yearPillar(y));
    scored.push({ year: y, score: d.score, flags: d.flags });
  }
  if (scored.length < 5) continue;
  scored.sort((a, b) => b.score - a.score);
  // best rank among death year ±1 (立春 / accident slack)
  let best = { rank: 999, e: scored[0] };
  scored.forEach((e, i) => { if (Math.abs(e.year - deathYear) <= 1 && i < best.rank) best = { rank: i, e }; });
  const total = scored.length;
  const pct = Math.round((1 - best.rank / total) * 100);
  results.push({
    name, deathYear, rank: best.rank + 1, total, pct, score: best.e.score, flags: best.e.flags,
    top: scored.slice(0, 3).map((s) => `${s.year}(${s.score.toFixed(1)})`).join(' '),
  });
}

results.sort((a, b) => b.pct - a.pct);
console.log('姓名        卒年   危险排名/总年   百分位   分数  标记');
for (const r of results) {
  console.log(`${r.name.padEnd(9)} ${r.deathYear}  #${String(r.rank).padStart(2)}/${r.total}      ${String(r.pct).padStart(3)}%   ${r.score.toFixed(1)}  ${r.flags.join('、') || '—'}`);
}
const mean = Math.round(results.reduce((s, r) => s + r.pct, 0) / results.length);
const top3 = results.filter((r) => r.rank <= 3).length;
const top10pct = results.filter((r) => r.pct >= 90).length;
console.log(`\nN=${results.length}  平均百分位=${mean}% (随机基线50%)  卒年落入最危Top3=${top3}/${results.length}  落入前10%=${top10pct}/${results.length}`);
console.log('每人最危Top3年份对照：');
for (const r of results) console.log(`  ${r.name.padEnd(9)} 卒${r.deathYear}  top3: ${r.top}`);
