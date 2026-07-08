// Verify the 关系适配 engine against docs/王室家庭关系边表.csv — real royal-family
// edges with known 结局. People are built from their FULL birth data in
// docs/名人AA级八字验证集.csv (真太阳时 + 司令 + strength + 用神), so the 用神 are
// accurate — not approximated from pillars alone.
// Run: npx tsx scripts/checkRoyalPairs.ts

import * as fs from 'fs';
import { calculateBazi } from '../services/baziService';
import { analyzeCompatibility, Person } from '../utils/CompatibilityAnalyzer';
import { Gender, BaziChart } from '../types';

const splitCsv = (l: string): string[] => {
  const out: string[] = []; let cur = ''; let q = false;
  for (const ch of l) {
    if (ch === '"') q = !q;
    else if (ch === ',' && !q) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
};

// ── CSV1: name → chart (built from 真太阳时) ──
const fam = fs.readFileSync('docs/名人AA级八字验证集.csv', 'utf8').replace(/^﻿/, '')
  .split('\n').slice(1).filter((l) => l.trim()).map(splitCsv);

const charts = new Map<string, BaziChart>();
for (const f of fam) {
  const cnName = f[0].split(' ')[0];
  const [y, mo, d] = f[2].split('-').map(Number);
  const [h, mi] = f[8].split(':').map(Number); // 真太阳时
  charts.set(cnName, calculateBazi(y, mo, d, h, mi, Gender.MALE));
}

const toPerson = (name: string): Person => {
  const c = charts.get(name);
  if (!c) throw new Error(`no chart for ${name}`);
  return { label: name, strength: c.strength!, yongshen: c.yongshen!, dayBranch: c.dayPillar.branch.chinese };
};

// ── CSV2: relationship edges ──
const rows = fs.readFileSync('docs/王室家庭关系边表.csv', 'utf8').replace(/^﻿/, '')
  .split('\n').slice(1).filter((l) => l.trim()).map(splitCsv);

const marriages = rows.filter((r) => r[2] === '夫妻');
const kin = rows.filter((r) => r[2] !== '夫妻');

console.log('══════ 夫妻镜: 用神互补 + 配偶宫互藏 vs 真实结局 (accurate 用神 from birth data) ══════\n');
const scored: { title: string; mutual: number; combined: number; outcome: string }[] = [];
for (const [aName, bName, , , outcome] of marriages) {
  const a = toPerson(aName), b = toPerson(bName);
  const r = analyzeCompatibility(a, b, 'marriage');
  const sp = r.spousePalace!;
  const combined = r.mutualScore + (sp[0].score + sp[1].score) / 2;
  scored.push({ title: `${aName}×${bName}`, mutual: r.mutualScore, combined, outcome });
  console.log(`【${aName} × ${bName}】 ${outcome}`);
  console.log(`  ${a.strength.dayElement}(${a.strength.category}) 用${favStr(a)} × ${b.strength.dayElement}(${b.strength.category}) 用${favStr(b)}`);
  console.log(`  mutualScore=${r.mutualScore.toFixed(2)}  不对称=${r.asymmetry.toFixed(2)}  配偶宫 ${sp[0].score.toFixed(2)}/${sp[1].score.toFixed(2)}  ⇒ combined=${combined.toFixed(2)}\n`);
}

console.log('── engine 排名 vs 现实 ──');
scored.sort((x, y) => y.combined - x.combined)
  .forEach((s, i) => console.log(`  ${i + 1}. ${s.title.padEnd(16)} combined=${s.combined.toFixed(2)}  «${s.outcome}»`));

console.log('\n══════ 亲子 / 兄弟 (informational) ══════\n');
for (const [aName, bName, rel, , outcome] of kin) {
  try {
    const r = analyzeCompatibility(toPerson(aName), toPerson(bName), 'partner');
    console.log(`【${aName}→${bName}】${rel}  mutualScore=${r.mutualScore.toFixed(2)}${outcome ? '  «' + outcome + '»' : ''}`);
  } catch (e) { console.log(`【${aName}→${bName}】${rel}  (${(e as Error).message})`); }
}

function favStr(p: Person): string {
  const NOUN: Record<string, string> = { Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水' };
  return Object.entries(p.yongshen.favor).filter(([, v]) => v === 'favorable').map(([k]) => NOUN[k]).join('') || '—';
}
