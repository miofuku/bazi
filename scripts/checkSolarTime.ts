// Verify the 真太阳时 conversion reproduces the CSV's true solar time (and thus
// the correct hour pillar) from clock time + longitude + timezone alone.
// Run: npx tsx scripts/checkSolarTime.ts

import * as fs from 'fs';
import { toTrueSolarTime } from '../utils/trueSolarTime';
import { calculateBazi } from '../services/baziService';
import { Gender } from '../types';

const csv = fs.readFileSync('docs/名人AA级八字验证集_1.csv', 'utf8').replace(/^﻿/, '');
const rows = csv.split('\n').slice(1).filter((l) => l.trim());

const gz = (p: { stem: { chinese: string }; branch: { chinese: string } }) =>
  p.stem.chinese + p.branch.chinese;

let timeClose = 0, hourPass = 0, total = 0;

for (const line of rows) {
  const f = line.split(',');
  const name = f[0].split(' ')[0];
  const [y, mo, d] = f[2].split('-').map(Number);
  const [ch, cm] = f[3].split(':').map(Number);
  const lon = Number(f[6]);
  const tz = f[7];
  const [sh, sm] = f[8].split(':').map(Number); // CSV 真太阳时
  const hSolar = f[13];
  total++;

  // timezone standard meridian: parse (±N); LMT → local mean time (meridian = longitude).
  const off = tz.match(/\(([-+]?\d+)\)/);
  const tzMeridian = off ? Number(off[1]) * 15 : lon;

  const tst = toTrueSolarTime({ year: y, month: mo, day: d, hour: ch, minute: cm }, lon, tzMeridian);

  const mineMin = tst.hour * 60 + tst.minute;
  const csvMin = sh * 60 + sm;
  const deltaMin = Math.abs(mineMin - csvMin);
  const close = deltaMin <= 3;
  if (close) timeClose++;

  const c = calculateBazi(tst.year, tst.month, tst.day, tst.hour, tst.minute, Gender.MALE);
  const hourOk = gz(c.hourPillar) === hSolar;
  if (hourOk) hourPass++;

  console.log(
    `${hourOk ? '✓' : '✗'} ${name.padEnd(6)} 算得真太阳 ${String(tst.hour).padStart(2, '0')}:${String(tst.minute).padStart(2, '0')} ` +
    `vs CSV ${f[8]} (Δ${deltaMin}m) → 时柱 ${gz(c.hourPillar)} vs ${hSolar}`,
  );
}

console.log(`\n真太阳时 ±3分: ${timeClose}/${total}   时柱正确: ${hourPass}/${total}`);
