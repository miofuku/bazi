import { ElementType, Favor, StrengthReading, YongshenReading, YongshenMethod } from '../types';
import { STEMS } from './constants';
import { TIAOHOU } from './tiaohouTable';

// 用神选取 (Phase 2) — favorable/unfavorable elements, built on the strength
// reading. Baseline is 扶抑 (support a weak day master, drain a strong one);
// 中和 falls to 病药 (the most-excessive element is the 病, its controller the
// 药); 从格 follows the dominant camp. The full 调候用神表 (穷通宝鉴, see
// tiaohouTable.ts) supplements on top: a 调候 element that 扶抑 left 闲 is
// promoted to 喜, but one 扶抑 rejects is NOT flipped — it is recorded as a
// tension (旺衰 wins for 顺涩; 调候 is a livability/格局 axis).

const { WOOD, FIRE, EARTH, METAL, WATER } = ElementType;

// x 生 GENERATES[x];  x 克 CONTROLS[x].
const GENERATES: Record<ElementType, ElementType> = {
  [WOOD]: FIRE, [FIRE]: EARTH, [EARTH]: METAL, [METAL]: WATER, [WATER]: WOOD,
};
const CONTROLS: Record<ElementType, ElementType> = {
  [WOOD]: EARTH, [EARTH]: WATER, [WATER]: FIRE, [FIRE]: METAL, [METAL]: WOOD,
};

const generatedBy = (el: ElementType) =>
  (Object.keys(GENERATES) as ElementType[]).find((k) => GENERATES[k] === el)!;
const controlledBy = (el: ElementType) =>
  (Object.keys(CONTROLS) as ElementType[]).find((k) => CONTROLS[k] === el)!;

// 十神 groups as elements, relative to the day master.
export interface TenGods {
  self: ElementType;      // 比劫
  resource: ElementType;  // 印
  output: ElementType;    // 食伤
  wealth: ElementType;    // 财
  authority: ElementType; // 官杀
}
export const tenGods = (day: ElementType): TenGods => ({
  self: day,
  resource: generatedBy(day),
  output: GENERATES[day],
  wealth: CONTROLS[day],
  authority: controlledBy(day),
});

const ALL = [WOOD, FIRE, EARTH, METAL, WATER];

const heaviest = (power: Record<ElementType, number>, among: ElementType[]) =>
  among.reduce((a, b) => (power[b] > power[a] ? b : a));

const NOUN: Record<ElementType, string> = {
  [WOOD]: '木', [FIRE]: '火', [EARTH]: '土', [METAL]: '金', [WATER]: '水',
};

export const selectYongshen = (
  strength: StrengthReading,
  monthBranch: string,
  dayStem: string, // day master stem char, for 调候 lookup
): YongshenReading => {
  const power = strength.elementPower;
  const g = tenGods(strength.dayElement);

  const favor: Record<ElementType, Favor> = {
    [WOOD]: 'neutral', [FIRE]: 'neutral', [EARTH]: 'neutral',
    [METAL]: 'neutral', [WATER]: 'neutral',
  };
  const set = (els: ElementType[], f: Favor) => els.forEach((e) => (favor[e] = f));

  let method: YongshenMethod;
  let primaryYong: ElementType;
  let primaryJi: ElementType;
  let note: string;

  switch (strength.category) {
    case 'weak': {
      method = 'fuyi-weak';
      set([g.self, g.resource], 'favorable');
      set([g.output, g.wealth, g.authority], 'unfavorable');
      primaryJi = heaviest(power, [g.output, g.wealth, g.authority]);
      // 财旺 → 帮身(比劫); 官杀/食伤旺 → 化泄生身(印).
      primaryYong = primaryJi === g.wealth ? g.self : g.resource;
      note = `身弱，扶为主：喜${NOUN[g.self]}${NOUN[g.resource]}（比劫印绶）帮身，忌${NOUN[primaryJi]}耗泄。`;
      break;
    }
    case 'strong': {
      method = 'fuyi-strong';
      set([g.output, g.wealth, g.authority], 'favorable');
      set([g.self, g.resource], 'unfavorable');
      // 比劫过 → 官杀克之; 印过 → 财克之.
      const excess = power[g.self] >= power[g.resource] ? g.self : g.resource;
      primaryJi = excess;
      primaryYong = excess === g.self ? g.authority : g.wealth;
      note = `身强，抑为主：喜${NOUN[g.output]}${NOUN[g.wealth]}${NOUN[g.authority]}（食伤财官）泄耗克，忌${NOUN[excess]}助旺。`;
      break;
    }
    case 'follow-weak': {
      method = 'follow-weak';
      set([g.output, g.wealth, g.authority], 'favorable');
      set([g.self, g.resource], 'unfavorable');
      primaryYong = heaviest(power, [g.output, g.wealth, g.authority]);
      primaryJi = g.resource; // 印最破从
      // 犯旺者凶: whatever CONTROLS the followed god turns against the follow.
      // Concretely this bites 从杀 (食伤克官杀 must be 忌, not 喜) — for 从财/从儿
      // the controller is 比劫/印, already unfavorable. Found via docs/命理分析.csv
      // case #9, whose 从杀(土) map wrongly marked 木 (食伤) favorable.
      const offender = controlledBy(primaryYong);
      const flipped = favor[offender] === 'favorable';
      if (flipped) favor[offender] = 'unfavorable';
      note = `从弱，顺势：从旺${NOUN[primaryYong]}，喜财官食伤，忌${NOUN[g.resource]}${NOUN[g.self]}（印比破从）${flipped ? `，亦忌${NOUN[offender]}犯旺` : ''}。`;
      break;
    }
    case 'follow-strong': {
      method = 'follow-strong';
      set([g.self, g.resource, g.output], 'favorable');
      set([g.wealth, g.authority], 'unfavorable');
      primaryYong = heaviest(power, [g.self, g.resource]);
      primaryJi = g.authority;
      note = `从强，顺势：从旺${NOUN[primaryYong]}，喜印比食伤，忌${NOUN[g.wealth]}${NOUN[g.authority]}（财官逆势）。`;
      break;
    }
    default: {
      // 中和 → 病药: the single most-excessive element is the 病; its controller the 药.
      method = 'binyao';
      const bing = heaviest(power, ALL);
      const yao = controlledBy(bing);
      primaryYong = yao;
      primaryJi = bing;
      set([yao, generatedBy(yao)], 'favorable'); // 药 + 药之源
      set([bing, generatedBy(bing)], 'unfavorable'); // 病 + 助病
      note = `中和，病在${NOUN[bing]}偏重，药取${NOUN[yao]}制之；忌${NOUN[bing]}及生${NOUN[bing]}之${NOUN[generatedBy(bing)]}。`;
      break;
    }
  }

  // 调候 (穷通宝鉴): promote a climate 用神 that 扶抑 left 闲; record tension for
  // any the base rejects (旺衰 wins for 顺涩).
  const stems = TIAOHOU[dayStem]?.[monthBranch] ?? '';
  const tiaohou: ElementType[] = [];
  for (const ch of stems) {
    const el = STEMS[ch]?.element;
    if (el && !tiaohou.includes(el)) tiaohou.push(el);
  }
  const promoted: ElementType[] = [];
  const tension: ElementType[] = [];
  tiaohou.forEach((el) => {
    if (favor[el] === 'neutral') {
      favor[el] = 'favorable';
      promoted.push(el);
    } else if (favor[el] === 'unfavorable') {
      tension.push(el);
    }
  });
  if (tiaohou.length) {
    note += ` 调候宜${tiaohou.map((e) => NOUN[e]).join('')}`;
    if (promoted.length) note += `（喜${promoted.map((e) => NOUN[e]).join('')}）`;
    if (tension.length) note += `，惟${tension.map((e) => NOUN[e]).join('')}与旺衰相碍`;
    note += '。';
  }

  return { method, primaryYong, primaryJi, favor, tiaohou, note };
};
