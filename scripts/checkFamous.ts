// Validate the pillar engine against docs/名人AA级八字验证集_1.csv (17 AA-rated
// charts). Each row gives the CSV author's pillars plus BOTH hour pillars
// (真太阳时 vs 钟表). We run the engine with each time and compare, to (a) confirm
// tyme4ts reproduces the pillars and (b) prove 真太阳时 is the correct input.
//
// Run: npx tsx scripts/checkFamous.ts

import * as fs from 'fs';
import { calculateBazi } from '../services/baziService';
import { Gender } from '../types';

const csv = fs.readFileSync('docs/名人AA级八字验证集_1.csv', 'utf8').replace(/^﻿/, '');
const rows = csv.split('\n').slice(1).filter((l) => l.trim());

interface Row {
  name: string; date: string; clock: string; solar: string;
  yP: string; mP: string; dP: string; hSolar: string; hClock: string;
}

const parse = (line: string): Row => {
  const f = line.split(',');
  return {
    name: f[0], date: f[2], clock: f[3], solar: f[8],
    yP: f[10], mP: f[11], dP: f[12], hSolar: f[13], hClock: f[14],
  };
};

const gz = (p: { stem: { chinese: string }; branch: { chinese: string } }) =>
  p.stem.chinese + p.branch.chinese;

const run = (date: string, time: string) => {
  const [y, mo, d] = date.split('-').map(Number);
  const [h, mi] = time.split(':').map(Number);
  const c = calculateBazi(y, mo, d, h, mi, Gender.MALE);
  return { y: gz(c.yearPillar), m: gz(c.monthPillar), d: gz(c.dayPillar), h: gz(c.hourPillar) };
};

let ymdPass = 0, solarHourPass = 0, clockHourPass = 0, total = 0;
const ymdFails: string[] = [];

for (const line of rows) {
  const r = parse(line);
  total++;
  const solar = run(r.date, r.solar);
  const clock = run(r.date, r.clock);

  const ymdOk = solar.y === r.yP && solar.m === r.mP && solar.d === r.dP;
  const solarHourOk = solar.h === r.hSolar;
  const clockHourOk = clock.h === r.hClock;
  if (ymdOk) ymdPass++; else ymdFails.push(r.name);
  if (solarHourOk) solarHourPass++;
  if (clockHourOk) clockHourPass++;

  const flag = (ok: boolean) => (ok ? '✓' : '✗');
  const diff = r.hSolar !== r.hClock ? ' ⟵真太阳≠钟表' : '';
  console.log(
    `${flag(ymdOk && solarHourOk)} ${r.name.split(' ')[0].padEnd(6)} ` +
    `年月日[真]${solar.y}${solar.m}${solar.d}${flag(ymdOk)} ` +
    `时[真]${solar.h}vs${r.hSolar}${flag(solarHourOk)} ` +
    `时[钟]${clock.h}vs${r.hClock}${flag(clockHourOk)}${diff}`,
  );
}

console.log(`\n年月日(真太阳): ${ymdPass}/${total}   时柱(真太阳): ${solarHourPass}/${total}   时柱(钟表): ${clockHourPass}/${total}`);
if (ymdFails.length) console.log('年月日不符:', ymdFails.join('、'));
