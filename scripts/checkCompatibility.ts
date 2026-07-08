// Validation harness for the 关系适配 engine (Phase 3).
// Run: npx tsx scripts/checkCompatibility.ts

import { STEMS, BRANCHES } from '../utils/constants';
import { calculateStrength } from '../utils/StrengthCalculator';
import { selectYongshen } from '../utils/YongshenSelector';
import { getRulingStem } from '../utils/qiLing';
import { analyzeCompatibility, Person, RelationLens } from '../utils/CompatibilityAnalyzer';
import { Pillar } from '../types';

const pillar = (gz: string, name: string): Pillar => ({
  stem: STEMS[gz.charAt(0)], branch: BRANCHES[gz.charAt(1)], name,
});

const person = (
  label: string,
  bazi: [string, string, string, string],
  daysIntoMonth?: number,
): Person => {
  const [y, m, d, h] = bazi;
  const ruling = daysIntoMonth !== undefined ? getRulingStem(m.charAt(1), daysIntoMonth)?.stem : undefined;
  const strength = calculateStrength(pillar(y, 'Y'), pillar(m, 'M'), pillar(d, 'D'), pillar(h, 'H'), ruling);
  const yongshen = selectYongshen(strength, m.charAt(1), d.charAt(0));
  return { label, strength, yongshen, dayBranch: d.charAt(1) };
};

const mingA = person('命一', ['丙寅', '乙未', '庚辰', '戊寅'], 28); // 庚 中和 (妻)
const mingThree = person('命三', ['癸亥', '壬戌', '辛卯', '壬辰']); // 辛 身弱 (夫)
const mingTwo = person('命二', ['庚午', '庚辰', '辛丑', '甲午']);   // 辛 身强
const mingFour = person('命四', ['丙子', '甲午', '壬寅', '丙午']);  // 壬 从财

const pairs: [Person, Person, RelationLens, string][] = [
  [mingA, mingThree, 'marriage', '命一 × 命三（真实夫妻）'],
  [mingA, mingThree, 'partner', '命一 × 命三（若作合伙）'],
  [mingA, mingFour, 'partner', '命一 × 命四（对照：两旺盘）'],
  [mingThree, mingTwo, 'partner', '命三 × 命二（对照：同辛日主）'],
];

for (const [a, b, lens, title] of pairs) {
  const r = analyzeCompatibility(a, b, lens);
  console.log(`\n【${title}】lens=${lens}`);
  console.log(`  互补分 ${r.mutualScore.toFixed(2)}  不对称 ${r.asymmetry.toFixed(2)}  ${r.samePeers ? '同类比劫' : '异类'}  领域${r.divergentDomains ? '相异' : '相同'}`);
  console.log(`  ${r.note}`);
}
