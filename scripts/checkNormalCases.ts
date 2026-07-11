// Verification against docs/命理分析.csv — 134 normal people with real-life
// self-reports (16 original + 118 added 2026-07-11). Tests the product's core
// temporal signal three ways per label: (1) 年+大运 equal-weight clamp — known
// NET NEGATIVE, kept only for comparison; (2) 仅流年 — the honest headline;
// (3) 流年主导 + 大运 breaking dead-zone ties — exploratory (its gain is
// mechanical; dead-zone resolution accuracy is ~coin-flip). Each term is 用忌
// supply + structural vs natal (same formula as checkFamousDayun). The 大运
// active in a past year and the 司令 birth date come from
// docs/命理分析-dayun.json (reverse-derived birthdays, scripts/deriveDayun.ts);
// cases without a derivation (#43 #47 #68 #127) fall back to 流年-only, no 司令.
//
// Pillars + 当前大运 are read from the CSV; ground-truth labels are hand-made
// from each person's 自述 and kept here. Conventions: explicit personal
// outcomes with clear years → strong; family events / vague spans / murky
// OCR → weak (reported, not headline); clear current-state statements →
// nowState (scored vs 当前大运). Charts read at earlier years (#50 #89 #116
// #117) get no nowState — their 大运 column isn't current.
//
// TRAIN/TEST: cases are split ~70/30 by a stable hash of the 四柱 string (see
// isTest). All tuning/development happens against TRAIN; the 测试 column is the
// honest out-of-sample number and must never be optimized against. The split is
// stable under appends and keeps same-chart duplicates together.
// Run: npx tsx scripts/checkNormalCases.ts

import { readFileSync } from 'node:fs';
import { SolarTime } from 'tyme4ts';
import { STEMS, BRANCHES } from '../utils/constants';
import { calculateStrength } from '../utils/StrengthCalculator';
import { selectYongshen } from '../utils/YongshenSelector';
import { getRulingStem } from '../utils/qiLing';
import { pillarFavor } from '../utils/timeFavor';
import { structuralFavor } from '../utils/structural';
import { BaziChart, ElementType, Pillar } from '../types';

const pillar = (gz: string, name: string): Pillar => ({
  stem: STEMS[gz.charAt(0)],
  branch: BRANCHES[gz.charAt(1)],
  name,
});

// Sexagenary pillar of a Gregorian year (1984 = 甲子).
const SEQ_S = '甲乙丙丁戊己庚辛壬癸';
const SEQ_B = '子丑寅卯辰巳午未申酉戌亥';
const yearGz = (y: number) => `${SEQ_S[(((y - 1984) % 10) + 10) % 10]}${SEQ_B[(((y - 1984) % 12) + 12) % 12]}`;

// CSV columns: 序号,文件名,年柱,月柱,日柱,时柱,当前大运,流年,自述 — the quoted
// 自述 is the only field that can contain commas, and it comes last.
const GZ = /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/;
const rows = new Map<number, { bazi: [string, string, string, string]; dayun: string }>();
const csv = readFileSync(new URL('../docs/命理分析.csv', import.meta.url), 'utf8');
for (const line of csv.split('\n').slice(1)) {
  if (!line.trim()) continue;
  const f = line.split(',');
  const id = Number(f[0]);
  const bazi = [f[2], f[3], f[4], f[5]] as [string, string, string, string];
  if (!id || !bazi.every((gz) => GZ.test(gz)) || !GZ.test(f[6])) {
    throw new Error(`CSV 行解析失败: ${line.slice(0, 60)}`);
  }
  rows.set(id, { bazi, dayun: f[6] });
}

interface Labels {
  years?: Record<number, 1 | -1>;   // strong labels from the 自述
  weak?: Record<number, 1 | -1>;    // ambiguous labels — reported separately
  nowState?: 1 | -1;                // current overall state (scored vs 当前大运)
  note?: string;
}

const LABELS: Record<number, Labels> = {
  1: { note: '22岁 心高气傲 无分年事件' },
  2: { note: '自诊喜壬水印 工作频换' },
  3: { weak: { 2025: 1 }, note: '985硕25年入央企 26年5月辞职' },
  4: { years: { 2020: -1, 2021: -1, 2022: 1, 2025: 1 }, note: '20/21抑郁 22中考超常 25高考中上' },
  5: { weak: { 2006: -1 }, note: '06年父母离异 家族精神疾病' },
  6: { years: { 2024: -1, 2025: 1 }, weak: { 2026: -1 }, nowState: -1, note: '女 24焦虑失眠 25火来泄秀好转 26春冲突' },
  7: { weak: { 2026: -1 }, nowState: -1, note: '童年压抑 毕业迷茫' },
  8: { years: { 2018: -1, 2023: 1 }, note: '男 23突飞猛进 18高考砸' },
  9: { years: { 2024: -1, 2025: -1 }, nowState: -1, note: '24年起停滞 内耗焦虑' },
  10: { weak: { 2022: -1 }, note: '22辞职 之后不温不火' },
  11: { years: { 2022: -1 }, nowState: -1, note: '22休学崩溃 现焦虑心痛' },
  12: { years: { 2021: -1, 2024: -1, 2025: -1 }, weak: { 2017: -1 }, nowState: -1, note: '21离异+高考砸 24/25考研败 26找工不顺' },
  13: { years: { 2018: 1, 2019: -1, 2020: -1, 2025: 1 }, note: '18超常上央财 19-20挂科网贷 25好转' },
  14: { weak: { 2026: -1 }, nowState: -1, note: '身世坎坷 26养父病重无钱' },
  15: { years: { 2019: 1, 2025: 1 }, nowState: 1, note: '19考上本科(后挂科) 25医师证+上班' },
  16: { note: '每次大考都砸 无明确年份' },
  19: { years: { 2019: -1 }, nowState: -1, note: '19起被霸凌 现官非口舌' },
  20: { nowState: -1, note: '读研后不快乐 前岗被PUA 现压力大' },
  21: { years: { 2012: -1, 2016: -1 }, nowState: -1, note: '12被霸凌PUA 16被房东欺 现一身病' },
  22: { nowState: -1, note: '父赌博操控 现空虚迷茫' },
  24: { years: { 2017: 1 }, weak: { 2025: 1 }, nowState: -1, note: '17高考上央C9 25身体略好 26延毕官非' },
  25: { years: { 2022: -1 }, note: '22毕业错失机会 23定岗项目败' },
  26: { years: { 2019: 1, 2022: -1, 2023: -1, 2025: 1 }, weak: { 2018: -1, 2024: -1 }, note: '18下滑 19上211 22/23考研败 24被刷 25上岸' },
  27: { nowState: -1, note: '失业在家三年 社恐' },
  29: { years: { 2025: -1 }, weak: { 2023: -1 }, nowState: -1, note: '25考研败情绪差 23挂科 现迷茫' },
  30: { years: { 2013: -1 }, nowState: 1, note: '13抑郁高考失利 乙卯运稳定好转' },
  31: { nowState: -1, note: '困卫生院低薪 现状差' },
  33: { nowState: -1, note: '己亥运人际家庭转差 (庚子运尚可)' },
  34: { nowState: -1, note: '读研痛苦内耗' },
  36: { weak: { 2021: -1, 2022: -1, 2023: -1 }, note: '庚弱三会火 21-23难熬' },
  37: { years: { 2024: 1 }, nowState: 1, note: '24结婚 现家庭美满' },
  38: { years: { 2020: 1, 2022: -1, 2024: 1 }, weak: { 2021: -1, 2023: -1 }, note: '20中考重点 22谷底+母病 24转专业成' },
  40: { years: { 2024: -1 }, weak: { 2025: -1 }, nowState: -1, note: '24险车祸身心折磨 25情感挫折 现想出家' },
  41: { years: { 2023: 1, 2024: 1, 2025: -1 }, note: '23-24拿奖开挂 25疲乏 (自述曾记错时辰)' },
  42: { years: { 2015: -1, 2021: -1 }, nowState: 1, note: '15被霸凌 21高考败复读 壬戌运转好' },
  43: { years: { 2022: -1 }, weak: { 2025: -1 }, nowState: -1, note: '22高考后精神差 25考研中断 现焦虑' },
  44: { weak: { 2019: -1 }, note: '985 19混日子 人际痛苦' },
  45: { weak: { 2013: -1, 2014: -1 }, note: '13-14被霸凌 复读二本 现县城事业编' },
  46: { years: { 2012: 1, 2019: 1, 2023: -1, 2024: 1 }, weak: { 2022: -1 }, note: '12学业转好 19高考好 23考研败 24上岸双九' },
  47: { years: { 2024: -1, 2025: 1 }, note: '24高考败身心差 25复读好转' },
  48: { years: { 2019: -1, 2025: -1, 2026: 1 }, weak: { 2013: -1 }, note: '19皮肤病起 25身心崩 26立春后好转' },
  49: { weak: { 2021: -1 }, nowState: -1, note: '21爷逝gap 25岳家负债 现财压大' },
  50: { nowState: -1, note: '入乙丑运后家庭压抑变糟 (2016年盘)' },
  51: { years: { 2011: -1 }, nowState: -1, note: '11高考失利 现工作压抑备孕难' },
  52: { years: { 2021: 1 }, nowState: 1, note: '21超常上北大 现选调轻松' },
  53: { years: { 2020: -1 }, nowState: -1, note: '20回国抑郁成绩崩 现觉努力无用' },
  54: { years: { 2023: -1 }, weak: { 2024: -1 }, note: '23掰断手 24转惰 技校迷茫' },
  55: { weak: { 2025: -1 }, note: '25父厂破产 现大专学玄学' },
  56: { years: { 2016: -1 }, weak: { 2024: -1 }, note: '16中学大病 24工作后迷惑' },
  57: { weak: { 2010: -1 }, note: '10年家道中落 (自述与#69雷同)' },
  61: { years: { 2020: 1 }, nowState: -1, note: '20考上在职研 现单位欠薪' },
  62: { years: { 2021: -1, 2023: -1 }, nowState: -1, note: '21起下坡 23起家里蹲 现焦虑抑郁' },
  68: { weak: { 2020: -1 }, nowState: -1, note: '20行业不行 23起想跳槽' },
  69: { weak: { 2010: -1 }, note: '10年家道中落 (自述与#57雷同)' },
  70: { weak: { 2012: -1, 2013: -1 }, nowState: -1, note: '12-13摔伤脑炎 22后体好转 现迷茫' },
  72: { years: { 2017: 1 }, nowState: -1, note: '17高考超发 现求职迷茫 (亲妹盘)' },
  74: { years: { 2019: -1 }, weak: { 2023: -1 }, nowState: -1, note: '19岁运并临身体垮 23体制煎熬 今辞职考研' },
  76: { nowState: -1, note: '硕士在读 压力大拖延' },
  77: { years: { 2024: 1 }, nowState: -1, note: '24运气进重点高中 现休学' },
  79: { years: { 2020: 1, 2024: -1 }, note: '20自学提分 24辞职状态差' },
  80: { years: { 2024: 1, 2025: 1 }, note: '24考上研 25挣钱旅游' },
  81: { years: { 2016: 1 }, note: '16高考985 (转写模糊)' },
  83: { years: { 2024: -1 }, nowState: -1, note: '24中考失利 大考必砸' },
  84: { weak: { 2022: -1, 2023: -1 }, note: '22父病 23体检异常 (转写模糊)' },
  85: { years: { 2018: 1, 2021: 1 }, weak: { 2015: -1 }, note: '15父逝 18贵人助业 21婚顺' },
  86: { years: { 2025: -1 }, note: '25犯事判刑 (孩子盘)' },
  87: { years: { 2020: 1 }, weak: { 2016: -1, 2017: -1 }, note: '16-17蛰居 20开心 (转写模糊)' },
  88: { years: { 2020: 1 }, nowState: -1, note: '20初中夺魁 长期觉不顺' },
  89: { years: { 2020: 1, 2023: -1, 2024: -1 }, note: '20提前录取 23-24处分不顺 (盘设2015)' },
  90: { nowState: -1, note: '早年学业顺 现茫然压力' },
  91: { years: { 2019: 1, 2021: -1, 2022: -1 }, weak: { 2016: 1 }, note: '19上重点 21状态崩 22高考砸' },
  92: { years: { 2021: 1, 2022: -1, 2025: 1 }, note: '21上重点 22抑郁休学 25复学好转 自证木差火好' },
  93: { years: { 2020: 1, 2022: 1, 2024: -1, 2025: -1 }, note: '20/22学业升 24降 25高考仅二本' },
  94: { years: { 2024: 1 }, note: '24高考一本 现焦虑' },
  95: { years: { 2024: -1 }, weak: { 2025: 1 }, note: '24诸事不顺 25靠运略好转' },
  96: { years: { 2014: 1, 2015: 1, 2016: 1 }, weak: { 2019: -1, 2020: -1 }, note: '自证喜木火 14-16舒 19下-20上糟' },
  97: { years: { 2016: 1, 2018: 1, 2022: 1, 2025: 1 }, nowState: 1, note: '16/18/22/25节节高 贵人多' },
  98: { weak: { 2013: -1 }, note: '13母逝 现佛系兼职' },
  99: { weak: { 2023: -1 }, note: '23受挫 24-25有贵人 (转写模糊)' },
  100: { weak: { 2020: -1 }, note: '20父生意出事 现自家公司单身' },
  101: { weak: { 2023: 1 }, nowState: -1, note: '23结婚 现国企降薪郁闷 (与#16同盘异人)' },
  102: { years: { 2025: -1 }, nowState: -1, note: '25身心压力大' },
  103: { years: { 2024: -1 }, nowState: -1, note: '24起破财误判 现紧张' },
  104: { weak: { 2015: -1, 2022: -1 }, nowState: -1, note: '15情绪高考平 22焦虑 现离职备考' },
  105: { nowState: -1, note: '这几年糟 烂桃花 现拧巴' },
  107: { years: { 2013: 1, 2017: 1, 2018: -1 }, weak: { 2019: -1 }, note: '13/17学业升 18师冲突 19末起下滑' },
  108: { years: { 2013: -1, 2020: -1, 2021: -1, 2022: -1, 2024: -1 }, note: '13骨折 20-22考研败 24破财折腾 (23换运压力减)' },
  109: { years: { 2014: -1 }, weak: { 2013: -1 }, nowState: -1, note: '13家暴创伤 14高考败 现自由职业平平' },
  110: { years: { 2023: 1, 2025: 1 }, weak: { 2017: 1, 2020: 1 }, nowState: -1, note: '23专升本 25国企 甲辰运体弱 贵人多' },
  111: { years: { 2024: -1 }, weak: { 2021: -1, 2022: -1, 2023: -1 }, note: '21中考平 22-24贪玩 24高考专科' },
  112: { years: { 2024: -1, 2025: -1 }, weak: { 2023: -1 }, nowState: -1, note: '23上研但23-25至暗 现迷茫' },
  113: { nowState: -1, note: '现纪检岗压力大眠差' },
  114: { years: { 2021: -1, 2022: -1, 2023: -1, 2024: -1, 2025: -1 }, weak: { 2016: 1, 2017: 1, 2018: 1, 2019: 1, 2020: 1 }, nowState: -1, note: '16-20全校前几 21压力 22高考挫 23孤立 24-25神衰' },
  115: { years: { 2017: 1, 2020: -1 }, note: '17上重点 20高考惜败 后保研' },
  116: { weak: { 2020: 1 }, note: '20专升本 (盘设2015)' },
  117: { years: { 2023: 1 }, note: '23入国企神仙岗 一路平顺 (盘设2004)' },
  118: { years: { 2020: 1, 2025: 1 }, weak: { 2022: -1, 2023: -1, 2024: -1 }, note: '20央企 22-24低谷 25上岸' },
  119: { years: { 2022: 1, 2025: 1 }, note: '22入实验班 25超常上人大' },
  120: { years: { 2023: 1 }, weak: { 2019: -1, 2020: -1, 2021: -1, 2022: -1 }, nowState: 1, note: '19-23留学压力大 23工作转好' },
  121: { years: { 2014: 1, 2022: 1, 2023: 1 }, nowState: -1, note: '14上重点 22-23双丰收 24读博后受压' },
  122: { years: { 2020: -1 }, note: '20考运欠佳 985本硕' },
  123: { years: { 2014: 1, 2016: -1, 2017: -1, 2024: -1, 2025: -1 }, nowState: -1, note: '14好 16-17挫 24-25连败离职' },
  124: { years: { 2017: 1, 2021: 1, 2023: -1, 2024: -1 }, note: '17/21顺 23-24考研惜败 24父病' },
  125: { years: { 2001: 1, 2010: 1 }, note: '01入央企 10调省级 (中年案例)' },
  126: { weak: { 2023: 1 }, nowState: 1, note: '23入丙戌运转好 现备考公' },
  127: { years: { 2020: -1, 2021: -1, 2023: -1 }, weak: { 2018: 1 }, note: '20-21抑郁 23工伤 18后逢凶化吉' },
  128: { years: { 2017: -1, 2019: -1, 2022: 1 }, weak: { 2020: -1, 2021: -1 }, note: '17起厌学 19术败重创 22转好' },
  129: { years: { 2022: -1, 2024: 1 }, nowState: 1, note: '22延毕皮肤病 24入央企顺' },
  130: { years: { 2022: -1 }, weak: { 2020: 1, 2021: 1, 2025: 1 }, note: '20-21家暴富 22病休学 25复学' },
  131: { nowState: -1, note: '22婚后孕难 现失业太背' },
  132: { years: { 2022: -1 }, note: '22失恋失业谷底 现平稳但内耗' },
  133: { years: { 2019: 1, 2020: 1 }, weak: { 2021: -1, 2022: -1, 2023: -1, 2024: -1, 2025: -1 }, nowState: -1, note: '丙申运差 唯19/20亥子年好' },
  134: { years: { 2023: -1 }, note: '23轻生边缘 自感忌水' },
};

for (const id of Object.keys(LABELS)) {
  if (!rows.has(Number(id))) throw new Error(`LABELS #${id} 不在 CSV 中`);
}

// 反推出的生日+大运序列 (npx tsx scripts/deriveDayun.ts 生成)。
const DERIVED = new Map<number, { birth: string; dayun: { gz: string; year: number }[] }>();
for (const e of JSON.parse(readFileSync(new URL('../docs/命理分析-dayun.json', import.meta.url), 'utf8'))) {
  if (e.dayun) DERIVED.set(e.id, { birth: e.birth, dayun: e.dayun });
}

// 司令: days from the governing 节 to the (derived) birth day — same chain as
// baziService. Unmatched cases (#43 #47 #68 #127) stay without 司令.
const rulingOf = (birth: string | undefined, monthBranch: string): string | undefined => {
  if (!birth) return undefined;
  const [Y, M, D] = birth.slice(0, 10).split('-').map(Number);
  const [h, mi] = birth.slice(11).split(':').map(Number);
  const birthDay = SolarTime.fromYmdHms(Y, M, D, h, mi, 0).getSolarDay();
  let term = birthDay.getTerm();
  while (!term.isJie()) term = term.next(-1);
  return getRulingStem(monthBranch, birthDay.subtract(term.getSolarDay()))?.stem;
};

const CN: Record<ElementType, string> = {
  [ElementType.WOOD]: '木', [ElementType.FIRE]: '火', [ElementType.EARTH]: '土',
  [ElementType.METAL]: '金', [ElementType.WATER]: '水',
};
const clamp1 = (n: number) => Math.max(-1, Math.min(1, n));

// Deterministic TRAIN/TEST split for honest generalization. Hashed on the 四柱
// string (FNV-1a), so: (a) same-chart duplicates — #16/#101, #73/#75 — always
// land on the same side (no leakage); (b) the split is stable as new cases are
// appended (existing assignments never move). ~30% test. THE TEST SET IS SACRED:
// develop/tune against TRAIN only; the 测试 column is the honest number.
const fnv = (s: string): number => {
  let hsh = 2166136261;
  for (let i = 0; i < s.length; i++) {
    hsh ^= s.charCodeAt(i);
    hsh = Math.imul(hsh, 16777619);
  }
  return hsh >>> 0;
};
const isTest = (baziStr: string): boolean => fnv(baziStr) % 100 >= 70;
// 5-fold CV over TRAIN only (test stays untouched). Salted hash → folds are
// decorrelated from the train/test split. CV is for paired before/after
// comparison during development, and to quantify the noise floor.
const CV_FOLDS = 5;
const foldOf = (baziStr: string): number => fnv(baziStr + '|cv') % CV_FOLDS;

// [trainHit, trainMiss, testHit, testMiss]
const T = { strong: [0, 0, 0, 0], weak: [0, 0, 0, 0], now: [0, 0, 0, 0] };   // 年+大运 合成
const TY = { strong: [0, 0, 0, 0], weak: [0, 0, 0, 0] };                      // 仅流年（旧口径）
const TB = { strong: [0, 0, 0, 0], weak: [0, 0, 0, 0] };                      // 流年主导，大运仅在死区补位（探索）
const split = {
  train: { cases: [] as number[], cats: {} as Record<string, number> },
  test: { cases: [] as number[], cats: {} as Record<string, number> },
};
// per-fold [hit, miss] on TRAIN, strong labels only (the headline signal)
const cvY = Array.from({ length: CV_FOLDS }, () => [0, 0]); // 仅流年
const cvB = Array.from({ length: CV_FOLDS }, () => [0, 0]); // 探索

for (const [id, row] of rows) {
  const lab = LABELS[id] ?? {};
  const [y, m, d, h] = row.bazi;
  const pY = pillar(y, 'Year'), pM = pillar(m, 'Month'), pD = pillar(d, 'Day'), pH = pillar(h, 'Hour');
  const strength = calculateStrength(pY, pM, pD, pH, rulingOf(DERIVED.get(id)?.birth, m.charAt(1)));
  const ys = selectYongshen(strength, m.charAt(1), d.charAt(0));
  const chartLike = { yearPillar: pY, monthPillar: pM, dayPillar: pD, hourPillar: pH, dayMaster: pD.stem } as unknown as BaziChart;
  const bucket = isTest(row.bazi.join('')) ? 'test' : 'train';
  const base = bucket === 'test' ? 2 : 0;
  const fold = bucket === 'train' ? foldOf(row.bazi.join('')) : -1;
  split[bucket].cases.push(id);
  split[bucket].cats[strength.category] = (split[bucket].cats[strength.category] ?? 0) + 1;

  const favorOf = (gz: string): number => {
    const p = pillar(gz, 'Yr');
    return clamp1(pillarFavor(ys.favor, p) + structuralFavor(p, chartLike, ys.favor).delta);
  };

  const fmt = (Object.keys(ys.favor) as ElementType[])
    .filter((e) => ys.favor[e] !== 'neutral')
    .map((e) => `${CN[e]}${ys.favor[e] === 'favorable' ? '喜' : '忌'}`).join(' ');
  console.log(`\n#${id} [${row.bazi.join(' ')}] ${strength.category} · ${fmt}${lab.note ? ` · ${lab.note}` : ''}`);

  const dySeq = DERIVED.get(id)?.dayun;
  const score = (years: Record<number, 1 | -1>, key: 'strong' | 'weak') => {
    for (const [yrS, expected] of Object.entries(years)) {
      const yr = Number(yrS);
      const yf = favorOf(yearGz(yr));
      const dy = dySeq?.filter((e) => yr >= e.year && yr < e.year + 10).pop();
      const df = dy ? favorOf(dy.gz) : 0;
      const f = dy ? clamp1(yf + df) : yf;
      const ok = expected > 0 ? f > 0.1 : f < -0.1;
      const okY = expected > 0 ? yf > 0.1 : yf < -0.1;
      const fb = Math.abs(yf) > 0.1 ? yf : dy ? df : yf;   // 流年非中性→流年定夺；中性→大运补位
      const okB = expected > 0 ? fb > 0.1 : fb < -0.1;
      T[key][base + (ok ? 0 : 1)]++;
      TY[key][base + (okY ? 0 : 1)]++;
      TB[key][base + (okB ? 0 : 1)]++;
      if (key === 'strong' && fold >= 0) {
        cvY[fold][okY ? 0 : 1]++;
        cvB[fold][okB ? 0 : 1]++;
      }
      const diff = ok === okY ? '' : okY ? '(年✓)' : '(年✗)';
      console.log(`   ${yr} ${yearGz(yr)} 预期${expected > 0 ? '好' : '差'} → 年${yf.toFixed(2)} 运${dy ? `${dy.gz}${df >= 0 ? '+' : ''}${df.toFixed(2)}` : '——'} 合${f.toFixed(2)} ${ok ? '✓' : '✗'}${diff}${key === 'weak' ? ' (weak)' : ''}`);
    }
  };
  if (lab.years) score(lab.years, 'strong');
  if (lab.weak) score(lab.weak, 'weak');

  if (lab.nowState !== undefined) {
    const f = clamp1(pillarFavor(ys.favor, pillar(row.dayun, 'DY')) + structuralFavor(pillar(row.dayun, 'DY'), chartLike, ys.favor).delta);
    const ok = lab.nowState > 0 ? f > 0.1 : f < -0.1;
    T.now[base + (ok ? 0 : 1)]++;
    console.log(`   当前大运 ${row.dayun} 预期${lab.nowState > 0 ? '好' : '差'} → ${f.toFixed(2)} ${ok ? '✓' : '✗'}`);
  }
}

const seg = (h: number, ms: number) => (h + ms ? `${h}/${h + ms} (${((h / (h + ms)) * 100).toFixed(0)}%)` : 'n/a');
// t = [trainHit, trainMiss, testHit, testMiss]
const line = (t: number[]) => `训练 ${seg(t[0], t[1])} · 测试 ${seg(t[2], t[3])} · 合计 ${seg(t[0] + t[2], t[1] + t[3])}`;

const catStr = (c: Record<string, number>) =>
  Object.entries(c).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join(' ');
console.log(`\n════ 训练/测试划分 (四柱哈希, 测试集不可用于调参) ════`);
console.log(`训练集 ${split.train.cases.length} 例 · ${catStr(split.train.cats)}`);
console.log(`测试集 ${split.test.cases.length} 例 · ${catStr(split.test.cats)}`);
console.log(`测试集序号: ${split.test.cases.join(' ')}`);

console.log(`\n════ 结果 (测试列=诚实泛化数) ════`);
console.log(`强标注流年(年+大运): ${line(T.strong)}  · 随机基线≈50%（三分类下更低）`);
console.log(`  ├ 仅流年(旧口径):  ${line(TY.strong)}`);
console.log(`  └ 流年主导+死区大运补位(探索): ${line(TB.strong)}`);
console.log(`弱标注流年(年+大运): ${line(T.weak)}`);
console.log(`  ├ 仅流年(旧口径):  ${line(TY.weak)}`);
console.log(`  └ 流年主导+死区大运补位(探索): ${line(TB.weak)}`);
console.log(`当前大运 vs 现状: ${line(T.now)}`);

// ── 训练集 K 折交叉验证 (强标注) ──────────────────────────────────────────────
// Purpose: quantify the noise floor and enable PAIRED before/after comparison.
// When a change lands, re-run and compare per-fold rates — the paired mean diff
// is far more sensitive to small gains than either the pooled or test number.
const rate = (t: number[]) => (t[0] + t[1] ? (t[0] / (t[0] + t[1])) * 100 : NaN);
const cvReport = (folds: number[][], label: string) => {
  const rates = folds.map(rate).filter((r) => !Number.isNaN(r));
  const mean = rates.reduce((a, b) => a + b, 0) / rates.length;
  const sd = rates.length > 1
    ? Math.sqrt(rates.reduce((a, b) => a + (b - mean) ** 2, 0) / (rates.length - 1))
    : 0;
  const se = sd / Math.sqrt(rates.length);
  const pooled = folds.reduce((a, f) => [a[0] + f[0], a[1] + f[1]], [0, 0]);
  console.log(`${label}: ${folds.map((f, i) => `f${i} ${seg(f[0], f[1])}`).join(' · ')}`);
  console.log(`  均值 ${mean.toFixed(1)}% ± ${sd.toFixed(1)}%(折间SD) · SE ${se.toFixed(1)}% · 合并 ${seg(pooled[0], pooled[1])}`);
};
console.log(`\n════ 训练集 ${CV_FOLDS} 折交叉验证 · 强标注 (改进前后做配对比较) ════`);
cvReport(cvY, '仅流年');
cvReport(cvB, '探索  ');
