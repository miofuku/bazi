// Q1: does the 大运/流年 layer align with real life events? For each famous
// chart we take the death/crisis year from 命运总结 and score the 大运 and 流年
// active then against the person's 用忌. If the engine is directionally right,
// tragic years should skew toward 忌神 (negative) rather than 喜用.
// Run: npx tsx scripts/checkFamousDayun.ts

import * as fs from 'fs';
import { calculateBazi, Geo } from '../services/baziService';
import { Gender, ElementType } from '../types';
import { pillarFavor } from '../utils/timeFavor';

const csv = fs.readFileSync('docs/名人AA级八字验证集_1.csv', 'utf8').replace(/^﻿/, '');
const rows = csv.split('\n').slice(1).filter((l) => l.trim());

const NOUN: Record<ElementType, string> = {
  [ElementType.WOOD]: '木', [ElementType.FIRE]: '火', [ElementType.EARTH]: '土',
  [ElementType.METAL]: '金', [ElementType.WATER]: '水',
};

// year pillar for a given civil year (mid-year, after 立春).
const yearPillar = (year: number) => {
  const c = calculateBazi(year, 6, 1, 12, 0, Gender.MALE);
  return c.yearPillar;
};

const sign = (n: number) => (n > 0.05 ? '喜+' : n < -0.05 ? '忌−' : '平·');

let deathN = 0, deathNeg = 0;

for (const line of rows) {
  const f = line.split(',');
  const name = f[0].split(' ')[0];
  const summary = f[17] ?? '';
  // death/crisis keyword → the year nearest it; else last year mentioned.
  const isDeceased = /身亡|病逝|自杀|处决|崩逝|猝逝|过量|坠崖|意外身亡|窒息/.test(summary);
  const years = [...summary.matchAll(/(\d{4})年/g)].map((m) => Number(m[1]));
  if (!years.length) continue;
  const eventYear = years[years.length - 1];

  const [y, mo, d] = f[2].split('-').map(Number);
  const [ch, cm] = f[3].split(':').map(Number);
  const off = f[7].match(/\(([-+]?\d+)\)/);
  const geo: Geo = { longitude: Number(f[6]), tzOffsetHours: off ? Number(off[1]) : Number(f[6]) / 15 };
  const chart = calculateBazi(y, mo, d, ch, cm, Gender.MALE, geo);
  const favor = chart.yongshen!.favor;

  const dy = chart.daYun.find((x) => eventYear >= x.year && eventYear < x.year + 10) ?? chart.daYun[0];
  const dyFav = pillarFavor(favor, dy.pillar);
  const lyFav = pillarFavor(favor, yearPillar(eventYear));
  const combined = dyFav + lyFav;

  if (isDeceased) { deathN++; if (combined < 0) deathNeg++; }

  console.log(
    `${name.padEnd(6)} ${isDeceased ? '✝' : ' '}${eventYear}  大运${dy.pillar.stem.chinese}${dy.pillar.branch.chinese}${sign(dyFav)}  ` +
    `流年${yearPillar(eventYear).stem.chinese}${yearPillar(eventYear).branch.chinese}${sign(lyFav)}  ` +
    `合计${combined >= 0 ? '+' : ''}${combined.toFixed(2)}  忌${NOUN[chart.yongshen!.primaryJi]}`,
  );
}

console.log(`\n身故/危机年落在忌神向(合计<0): ${deathNeg}/${deathN}`);
