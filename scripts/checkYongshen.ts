// Validation harness for the 用神 engine (Phase 2).
// Run: npx tsx scripts/checkYongshen.ts
//
// Reuses the same GanZhi charts as checkStrength. For each, prints strength +
// 用神/忌神 + per-element favor, to eyeball against reality.

import { STEMS, BRANCHES } from '../utils/constants';
import { calculateStrength } from '../utils/StrengthCalculator';
import { selectYongshen } from '../utils/YongshenSelector';
import { getRulingStem } from '../utils/qiLing';
import { Pillar, ElementType, Favor } from '../types';

const pillar = (gz: string, name: string): Pillar => ({
  stem: STEMS[gz.charAt(0)],
  branch: BRANCHES[gz.charAt(1)],
  name,
});

interface Case {
  label: string;
  bazi: [string, string, string, string];
  daysIntoMonth?: number;
}

const CASES: Case[] = [
  { label: '命例一 中和 (1986.8.4)', bazi: ['丙寅', '乙未', '庚辰', '戊寅'], daysIntoMonth: 28 },
  { label: '命例二 身强', bazi: ['庚午', '庚辰', '辛丑', '甲午'] },
  { label: '命例三 身弱', bazi: ['癸亥', '壬戌', '辛卯', '壬辰'] },
  { label: '命例四 从财', bazi: ['丙子', '甲午', '壬寅', '丙午'] },
];

const NOUN: Record<ElementType, string> = {
  [ElementType.WOOD]: '木', [ElementType.FIRE]: '火', [ElementType.EARTH]: '土',
  [ElementType.METAL]: '金', [ElementType.WATER]: '水',
};
const MARK: Record<Favor, string> = { favorable: '喜', neutral: '闲', unfavorable: '忌' };

for (const c of CASES) {
  const [y, m, d, h] = c.bazi;
  const ruling =
    c.daysIntoMonth !== undefined ? getRulingStem(m.charAt(1), c.daysIntoMonth)?.stem : undefined;
  const s = calculateStrength(pillar(y, 'Y'), pillar(m, 'M'), pillar(d, 'D'), pillar(h, 'H'), ruling);
  const ys = selectYongshen(s, m.charAt(1), d.charAt(0));

  const line = (Object.keys(ys.favor) as ElementType[])
    .map((e) => `${NOUN[e]}${MARK[ys.favor[e]]}`)
    .join(' ');
  console.log(`\n${c.label}  [${c.bazi.join(' ')}]  ${s.category}`);
  console.log(`  ${line}`);
  console.log(`  用神 ${NOUN[ys.primaryYong]}   忌神 ${NOUN[ys.primaryJi]}   (${ys.method})`);
  console.log(`  ${ys.note}`);
}
