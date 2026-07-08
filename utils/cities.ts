// City → longitude + IANA timezone, so users pick a birthplace instead of typing
// longitude/UTC by hand. The offset (incl. historical DST / 战时 / 夏令时) is then
// resolved from the IANA zone at the exact birth datetime via Intl — verified
// against docs/名人AA级八字验证集_1.csv (war-time −7, 1942 Louisville Central −6,
// London BST +1 all reproduced).

export interface City { name: string; lon: number; tz: string; region: string }

export const CITIES: City[] = [
  // 中国
  { name: '北京', lon: 116.4, tz: 'Asia/Shanghai', region: '中国' },
  { name: '上海', lon: 121.5, tz: 'Asia/Shanghai', region: '中国' },
  { name: '广州', lon: 113.3, tz: 'Asia/Shanghai', region: '中国' },
  { name: '深圳', lon: 114.1, tz: 'Asia/Shanghai', region: '中国' },
  { name: '成都', lon: 104.1, tz: 'Asia/Shanghai', region: '中国' },
  { name: '重庆', lon: 106.5, tz: 'Asia/Shanghai', region: '中国' },
  { name: '杭州', lon: 120.2, tz: 'Asia/Shanghai', region: '中国' },
  { name: '南京', lon: 118.8, tz: 'Asia/Shanghai', region: '中国' },
  { name: '武汉', lon: 114.3, tz: 'Asia/Shanghai', region: '中国' },
  { name: '西安', lon: 108.9, tz: 'Asia/Shanghai', region: '中国' },
  { name: '沈阳', lon: 123.4, tz: 'Asia/Shanghai', region: '中国' },
  { name: '哈尔滨', lon: 126.6, tz: 'Asia/Shanghai', region: '中国' },
  { name: '天津', lon: 117.2, tz: 'Asia/Shanghai', region: '中国' },
  { name: '郑州', lon: 113.6, tz: 'Asia/Shanghai', region: '中国' },
  { name: '长沙', lon: 113.0, tz: 'Asia/Shanghai', region: '中国' },
  { name: '昆明', lon: 102.7, tz: 'Asia/Shanghai', region: '中国' },
  { name: '乌鲁木齐', lon: 87.6, tz: 'Asia/Shanghai', region: '中国' },
  { name: '拉萨', lon: 91.1, tz: 'Asia/Shanghai', region: '中国' },
  { name: '兰州', lon: 103.8, tz: 'Asia/Shanghai', region: '中国' },
  { name: '银川', lon: 106.2, tz: 'Asia/Shanghai', region: '中国' },
  { name: '西宁', lon: 101.8, tz: 'Asia/Shanghai', region: '中国' },
  { name: '呼和浩特', lon: 111.7, tz: 'Asia/Shanghai', region: '中国' },
  { name: '太原', lon: 112.5, tz: 'Asia/Shanghai', region: '中国' },
  { name: '石家庄', lon: 114.5, tz: 'Asia/Shanghai', region: '中国' },
  { name: '济南', lon: 117.0, tz: 'Asia/Shanghai', region: '中国' },
  { name: '青岛', lon: 120.4, tz: 'Asia/Shanghai', region: '中国' },
  { name: '合肥', lon: 117.3, tz: 'Asia/Shanghai', region: '中国' },
  { name: '南昌', lon: 115.9, tz: 'Asia/Shanghai', region: '中国' },
  { name: '福州', lon: 119.3, tz: 'Asia/Shanghai', region: '中国' },
  { name: '厦门', lon: 118.1, tz: 'Asia/Shanghai', region: '中国' },
  { name: '贵阳', lon: 106.7, tz: 'Asia/Shanghai', region: '中国' },
  { name: '南宁', lon: 108.4, tz: 'Asia/Shanghai', region: '中国' },
  { name: '海口', lon: 110.3, tz: 'Asia/Shanghai', region: '中国' },
  { name: '长春', lon: 125.3, tz: 'Asia/Shanghai', region: '中国' },
  { name: '大连', lon: 121.6, tz: 'Asia/Shanghai', region: '中国' },
  { name: '苏州', lon: 120.6, tz: 'Asia/Shanghai', region: '中国' },
  { name: '香港', lon: 114.2, tz: 'Asia/Hong_Kong', region: '中国' },
  { name: '澳门', lon: 113.5, tz: 'Asia/Macau', region: '中国' },
  { name: '台北', lon: 121.6, tz: 'Asia/Taipei', region: '中国' },
  { name: '高雄', lon: 120.3, tz: 'Asia/Taipei', region: '中国' },
  // 亚洲其他
  { name: '东京 Tokyo', lon: 139.7, tz: 'Asia/Tokyo', region: '亚洲' },
  { name: '首尔 Seoul', lon: 127.0, tz: 'Asia/Seoul', region: '亚洲' },
  { name: '新加坡 Singapore', lon: 103.8, tz: 'Asia/Singapore', region: '亚洲' },
  { name: '曼谷 Bangkok', lon: 100.5, tz: 'Asia/Bangkok', region: '亚洲' },
  { name: '吉隆坡 Kuala Lumpur', lon: 101.7, tz: 'Asia/Kuala_Lumpur', region: '亚洲' },
  { name: '雅加达 Jakarta', lon: 106.8, tz: 'Asia/Jakarta', region: '亚洲' },
  { name: '孟买 Mumbai', lon: 72.9, tz: 'Asia/Kolkata', region: '亚洲' },
  { name: '新德里 New Delhi', lon: 77.2, tz: 'Asia/Kolkata', region: '亚洲' },
  { name: '迪拜 Dubai', lon: 55.3, tz: 'Asia/Dubai', region: '亚洲' },
  { name: '大阪 Osaka', lon: 135.5, tz: 'Asia/Tokyo', region: '亚洲' },
  { name: '马尼拉 Manila', lon: 121.0, tz: 'Asia/Manila', region: '亚洲' },
  { name: '胡志明市 Ho Chi Minh', lon: 106.7, tz: 'Asia/Ho_Chi_Minh', region: '亚洲' },
  { name: '伊斯坦布尔 Istanbul', lon: 29.0, tz: 'Europe/Istanbul', region: '亚洲' },
  // 欧洲
  { name: '伦敦 London', lon: -0.13, tz: 'Europe/London', region: '欧洲' },
  { name: '巴黎 Paris', lon: 2.35, tz: 'Europe/Paris', region: '欧洲' },
  { name: '柏林 Berlin', lon: 13.4, tz: 'Europe/Berlin', region: '欧洲' },
  { name: '罗马 Rome', lon: 12.5, tz: 'Europe/Rome', region: '欧洲' },
  { name: '马德里 Madrid', lon: -3.7, tz: 'Europe/Madrid', region: '欧洲' },
  { name: '莫斯科 Moscow', lon: 37.6, tz: 'Europe/Moscow', region: '欧洲' },
  { name: '阿姆斯特丹 Amsterdam', lon: 4.9, tz: 'Europe/Amsterdam', region: '欧洲' },
  { name: '苏黎世 Zurich', lon: 8.5, tz: 'Europe/Zurich', region: '欧洲' },
  { name: '斯德哥尔摩 Stockholm', lon: 18.1, tz: 'Europe/Stockholm', region: '欧洲' },
  { name: '雅典 Athens', lon: 23.7, tz: 'Europe/Athens', region: '欧洲' },
  // 美洲
  { name: '纽约 New York', lon: -74.0, tz: 'America/New_York', region: '美洲' },
  { name: '洛杉矶 Los Angeles', lon: -118.2, tz: 'America/Los_Angeles', region: '美洲' },
  { name: '旧金山 San Francisco', lon: -122.4, tz: 'America/Los_Angeles', region: '美洲' },
  { name: '芝加哥 Chicago', lon: -87.6, tz: 'America/Chicago', region: '美洲' },
  { name: '多伦多 Toronto', lon: -79.4, tz: 'America/Toronto', region: '美洲' },
  { name: '温哥华 Vancouver', lon: -123.1, tz: 'America/Vancouver', region: '美洲' },
  { name: '檀香山 Honolulu', lon: -157.9, tz: 'Pacific/Honolulu', region: '美洲' },
  { name: '圣保罗 São Paulo', lon: -46.6, tz: 'America/Sao_Paulo', region: '美洲' },
  { name: '波士顿 Boston', lon: -71.1, tz: 'America/New_York', region: '美洲' },
  { name: '华盛顿 Washington DC', lon: -77.0, tz: 'America/New_York', region: '美洲' },
  { name: '西雅图 Seattle', lon: -122.3, tz: 'America/Los_Angeles', region: '美洲' },
  { name: '休斯顿 Houston', lon: -95.4, tz: 'America/Chicago', region: '美洲' },
  { name: '墨西哥城 Mexico City', lon: -99.1, tz: 'America/Mexico_City', region: '美洲' },
  // 大洋洲
  { name: '悉尼 Sydney', lon: 151.2, tz: 'Australia/Sydney', region: '大洋洲' },
  { name: '墨尔本 Melbourne', lon: 144.9, tz: 'Australia/Melbourne', region: '大洋洲' },
  { name: '奥克兰 Auckland', lon: 174.8, tz: 'Pacific/Auckland', region: '大洋洲' },
];

export type GeoSpec =
  | { kind: 'city'; lon: number; tz: string }
  | { kind: 'manual'; lon: number; tzOffsetHours: number };

// UTC offset (hours) of an IANA zone at a given local datetime, via Intl — this
// is where DST / historical war-time is resolved automatically.
export const resolveOffsetHours = (
  tz: string, y: number, mo: number, d: number, h: number, mi: number,
): number => {
  const asUTC = Date.UTC(y, mo - 1, d, h, mi);
  const part = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' })
    .formatToParts(new Date(asUTC))
    .find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+0';
  const m = part.match(/GMT([+-])(\d+)(?::(\d+))?/);
  if (!m) return 0;
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) + (m[3] ? Number(m[3]) / 60 : 0));
};

export interface ResolvedGeo { longitude: number; tzOffsetHours: number }

// Turn a GeoSpec + birth datetime into the {longitude, tzOffsetHours} the engine
// wants. City specs resolve the offset from their zone at that moment.
export const resolveGeo = (
  spec: GeoSpec, y: number, mo: number, d: number, h: number, mi: number,
): ResolvedGeo =>
  spec.kind === 'manual'
    ? { longitude: spec.lon, tzOffsetHours: spec.tzOffsetHours }
    : { longitude: spec.lon, tzOffsetHours: resolveOffsetHours(spec.tz, y, mo, d, h, mi) };
