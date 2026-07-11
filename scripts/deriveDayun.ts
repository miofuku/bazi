// 反推生日 + 排大运，for docs/命理分析.csv 的全部案例。
//
// 方法：四柱在 1940–2020 内反查候选生辰（同 reverseBazi.ts 的扫描法），对每个
// 候选生辰 × 两种性别用 calculateBazi 排大运，然后用 CSV 自带的「当前大运」列
// 在截图年（流年列）做校验 —— 只保留大运序列在截图年恰好落在 CSV 标注大运上的
// (生日, 性别) 组合。顺行/逆行由性别决定，所以这一步同时把性别也推断出来了；
// 自述中的 元男/元女 等字样仅作交叉印证。大运边界按整年比较，容差 ±1 年
// （起运分数 + 立春/元旦差异）。
//
// 输出：逐案例打印 + docs/命理分析-dayun.json（供后续 harness 使用）。
// Run: npx tsx scripts/deriveDayun.ts

import { readFileSync, writeFileSync } from 'node:fs';
import { SolarTime } from 'tyme4ts';
import { calculateBazi } from '../services/baziService';
import { Gender } from '../types';

const SEQ_S = '甲乙丙丁戊己庚辛壬癸';
const SEQ_B = '子丑寅卯辰巳午未申酉戌亥';
const GZ = /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/;
const yearGz = (y: number) => `${SEQ_S[(((y - 1984) % 10) + 10) % 10]}${SEQ_B[(((y - 1984) % 12) + 12) % 12]}`;

// ── CSV ───────────────────────────────────────────────────────────────────────
interface Row { id: number; bazi: [string, string, string, string]; csvDayun: string; ssGz: string; text: string }
const rows: Row[] = [];
const csv = readFileSync(new URL('../docs/命理分析.csv', import.meta.url), 'utf8');
for (const line of csv.split('\n').slice(1)) {
  if (!line.trim()) continue;
  const f = line.split(',');
  const id = Number(f[0]);
  const bazi = [f[2], f[3], f[4], f[5]] as [string, string, string, string];
  if (!id || !bazi.every((p) => GZ.test(p)) || !GZ.test(f[6]) || !GZ.test(f[7])) {
    throw new Error(`CSV 行解析失败: ${line.slice(0, 60)}`);
  }
  rows.push({ id, bazi, csvDayun: f[6], ssGz: f[7], text: f.slice(8).join(',') });
}

// ── 反查（同 reverseBazi.ts）──────────────────────────────────────────────────
const gzOf = (name: string) => name.slice(0, 2);
const pillarsAt = (y: number, mo: number, d: number, h: number, mi: number) => {
  const hourObj = SolarTime.fromYmdHms(y, mo, d, h, mi, 0).getSixtyCycleHour();
  const dayObj = hourObj.getSixtyCycleDay();
  const monthObj = dayObj.getSixtyCycleMonth();
  return {
    year: gzOf(monthObj.getSixtyCycleYear().getName()),
    month: gzOf(monthObj.getName()),
    day: gzOf(dayObj.getName()),
    hour: gzOf(hourObj.getName()),
  };
};
const HOUR_CHECKS = [
  { h: 0, mi: 30 }, { h: 1, mi: 30 }, { h: 3, mi: 30 }, { h: 5, mi: 30 },
  { h: 7, mi: 30 }, { h: 9, mi: 30 }, { h: 11, mi: 30 }, { h: 13, mi: 30 },
  { h: 15, mi: 30 }, { h: 17, mi: 30 }, { h: 19, mi: 30 }, { h: 21, mi: 30 },
  { h: 23, mi: 30 },
];
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const ymd = (d: Date) => [d.getFullYear(), d.getMonth() + 1, d.getDate()] as const;
const FROM = 1940, TO = 2020, NOWCAP = 2026;

const reverse = (t: [string, string, string, string]) => {
  const out: { y: number; mo: number; d: number; h: number; mi: number }[] = [];
  let anchor: Date | null = null;
  for (let i = 0; i < 60; i++) {
    const d = addDays(new Date(FROM, 0, 1), i);
    if (pillarsAt(...ymd(d), 12, 0).day === t[2]) { anchor = d; break; }
  }
  if (!anchor) return out;
  const end = new Date(TO, 11, 31);
  for (let d = anchor; d <= end; d = addDays(d, 60)) {
    const p = pillarsAt(...ymd(d), 12, 0);
    if (p.year !== t[0] || p.month !== t[1] || p.day !== t[2]) continue;
    for (const c of HOUR_CHECKS) {
      const q = pillarsAt(...ymd(d), c.h, c.mi);
      if (q.year === t[0] && q.month === t[1] && q.day === t[2] && q.hour === t[3]) {
        out.push({ y: ymd(d)[0], mo: ymd(d)[1], d: ymd(d)[2], h: c.h, mi: c.mi });
      }
    }
  }
  return out;
};

// ── 大运 + 校验 ───────────────────────────────────────────────────────────────
const ssYearOf = (ssGz: string, birthYear: number) => {
  for (let y = NOWCAP; y > birthYear; y--) if (yearGz(y) === ssGz) return y;
  return null;
};
const textGender = (t: string): '男' | '女' | null => {
  if (/元女|女命|老公|丈夫/.test(t)) return '女';
  if (/元男|男命|老婆|妻子/.test(t)) return '男';
  if (/(^|[，。,"\s])男([，。,"\s]|$)/.test(t)) return '男';
  if (/(^|[，。,"\s])女([，。,"\s]|$)/.test(t)) return '女';
  return null;
};

interface Match {
  birth: string; gender: '男' | '女'; startAge: number; ssYear: number;
  dayun: { gz: string; year: number; startAge: number }[];
}
const pad = (n: number) => String(n).padStart(2, '0');
const results: any[] = [];
let nOk = 0, nAmb = 0, nUn = 0, nGenderAgree = 0, nGenderConflict = 0;

for (const r of rows) {
  const matches: Match[] = [];
  const tried: string[] = [];
  for (const c of reverse(r.bazi)) {
    for (const g of [Gender.MALE, Gender.FEMALE]) {
      const chart = calculateBazi(c.y, c.mo, c.d, c.h, c.mi, g);
      const dayun = chart.daYun.map((x) => ({
        gz: `${x.pillar.stem.chinese}${x.pillar.branch.chinese}`, year: x.year, startAge: x.startAge,
      }));
      const ssYear = ssYearOf(r.ssGz, c.y);
      const entry = dayun.find((e) => e.gz === r.csvDayun);
      const active = ssYear ? dayun.filter((e) => ssYear >= e.year && ssYear < e.year + 10).pop() : undefined;
      tried.push(`${c.y}-${pad(c.mo)}-${pad(c.d)} ${g === Gender.MALE ? '男' : '女'} @${ssYear} → ${active?.gz ?? '童限'}`);
      if (entry && ssYear && ssYear >= entry.year - 1 && ssYear <= entry.year + 10) {
        matches.push({
          birth: `${c.y}-${pad(c.mo)}-${pad(c.d)} ${pad(c.h)}:${pad(c.mi)}`,
          gender: g === Gender.MALE ? '男' : '女',
          startAge: chart.daYun[0].startAge, ssYear, dayun,
        });
      }
    }
  }

  const hint = textGender(r.text);
  let picked = matches;
  let genderSource = 'validated';
  if (matches.length > 1 && hint) {
    const byHint = matches.filter((m) => m.gender === hint);
    if (byHint.length) { picked = byHint; genderSource = 'text+validated'; }
  }
  const status = picked.length === 1 ? 'ok' : picked.length > 1 ? 'ambiguous' : 'unmatched';
  if (status === 'ok') nOk++; else if (status === 'ambiguous') nAmb++; else nUn++;
  if (status === 'ok' && hint) { picked[0].gender === hint ? nGenderAgree++ : nGenderConflict++; }

  const m = picked[0];
  results.push({
    id: r.id, bazi: r.bazi.join(' '), csvDayun: r.csvDayun, screenshot: r.ssGz, status,
    ...(m ? {
      birth: m.birth, gender: m.gender,
      genderSource: hint ? (m.gender === hint ? `${genderSource}(自述一致)` : `${genderSource}(自述矛盾:${hint})`) : genderSource,
      startAge: m.startAge, ssYear: m.ssYear, dayun: m.dayun,
    } : {}),
    ...(status !== 'ok' ? { candidates: status === 'ambiguous' ? picked : tried } : {}),
  });

  if (m) {
    const seq = m.dayun.map((e) => `${e.gz}${String(e.year).slice(2)}`).join(' ');
    const flag = status === 'ok' ? '✓' : '≈';
    console.log(`#${r.id} ${flag} ${r.bazi.join(' ')} · 生 ${m.birth} ${m.gender} 起运${m.startAge}岁 · ${seq}`);
    if (status === 'ambiguous') console.log(`     二义: ${picked.map((x) => `${x.birth} ${x.gender}`).join(' | ')}`);
  } else {
    console.log(`#${r.id} ✗ ${r.bazi.join(' ')} · CSV大运 ${r.csvDayun} @${r.ssGz} 无一候选吻合:`);
    for (const t of tried) console.log(`     ${t}`);
    if (!tried.length) console.log(`     （四柱在 ${FROM}–${TO} 内无匹配生日）`);
  }
}

writeFileSync(new URL('../docs/命理分析-dayun.json', import.meta.url), JSON.stringify(results, null, 1));
console.log(`\n════ 汇总 ════`);
console.log(`唯一确定: ${nOk} · 二义: ${nAmb} · 无匹配: ${nUn} / 共${rows.length}`);
console.log(`性别推断 vs 自述: 一致 ${nGenderAgree} · 矛盾 ${nGenderConflict}`);
console.log(`已写入 docs/命理分析-dayun.json`);
