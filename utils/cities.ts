// City → longitude + IANA timezone, so users pick a birthplace instead of typing
// longitude/UTC by hand. The offset (incl. historical DST / 战时 / 夏令时) is then
// resolved from the IANA zone at the exact birth datetime via Intl — verified
// against docs/名人AA级八字验证集_1.csv (war-time −7, 1942 Louisville Central −6,
// London BST +1 all reproduced).

export interface City { name: string; lon: number; tz: string; region: string }

export const CITIES: City[] = [
  // China — English name with the Chinese kept in parentheses.
  { name: 'Beijing (北京)', lon: 116.4, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Shanghai (上海)', lon: 121.5, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Guangzhou (广州)', lon: 113.3, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Shenzhen (深圳)', lon: 114.1, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Chengdu (成都)', lon: 104.1, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Chongqing (重庆)', lon: 106.5, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Hangzhou (杭州)', lon: 120.2, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Nanjing (南京)', lon: 118.8, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Wuhan (武汉)', lon: 114.3, tz: 'Asia/Shanghai', region: 'China' },
  { name: "Xi'an (西安)", lon: 108.9, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Shenyang (沈阳)', lon: 123.4, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Harbin (哈尔滨)', lon: 126.6, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Tianjin (天津)', lon: 117.2, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Zhengzhou (郑州)', lon: 113.6, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Changsha (长沙)', lon: 113.0, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Kunming (昆明)', lon: 102.7, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Ürümqi (乌鲁木齐)', lon: 87.6, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Lhasa (拉萨)', lon: 91.1, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Lanzhou (兰州)', lon: 103.8, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Yinchuan (银川)', lon: 106.2, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Xining (西宁)', lon: 101.8, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Hohhot (呼和浩特)', lon: 111.7, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Taiyuan (太原)', lon: 112.5, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Shijiazhuang (石家庄)', lon: 114.5, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Jinan (济南)', lon: 117.0, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Qingdao (青岛)', lon: 120.4, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Hefei (合肥)', lon: 117.3, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Nanchang (南昌)', lon: 115.9, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Fuzhou (福州)', lon: 119.3, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Xiamen (厦门)', lon: 118.1, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Guiyang (贵阳)', lon: 106.7, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Nanning (南宁)', lon: 108.4, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Haikou (海口)', lon: 110.3, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Changchun (长春)', lon: 125.3, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Dalian (大连)', lon: 121.6, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Suzhou (苏州)', lon: 120.6, tz: 'Asia/Shanghai', region: 'China' },
  { name: 'Hong Kong (香港)', lon: 114.2, tz: 'Asia/Hong_Kong', region: 'China' },
  { name: 'Macau (澳门)', lon: 113.5, tz: 'Asia/Macau', region: 'China' },
  { name: 'Taipei (台北)', lon: 121.6, tz: 'Asia/Taipei', region: 'China' },
  { name: 'Kaohsiung (高雄)', lon: 120.3, tz: 'Asia/Taipei', region: 'China' },
  // Asia
  { name: 'Tokyo', lon: 139.7, tz: 'Asia/Tokyo', region: 'Asia' },
  { name: 'Seoul', lon: 127.0, tz: 'Asia/Seoul', region: 'Asia' },
  { name: 'Singapore', lon: 103.8, tz: 'Asia/Singapore', region: 'Asia' },
  { name: 'Bangkok', lon: 100.5, tz: 'Asia/Bangkok', region: 'Asia' },
  { name: 'Kuala Lumpur', lon: 101.7, tz: 'Asia/Kuala_Lumpur', region: 'Asia' },
  { name: 'Jakarta', lon: 106.8, tz: 'Asia/Jakarta', region: 'Asia' },
  { name: 'Mumbai', lon: 72.9, tz: 'Asia/Kolkata', region: 'Asia' },
  { name: 'New Delhi', lon: 77.2, tz: 'Asia/Kolkata', region: 'Asia' },
  { name: 'Dubai', lon: 55.3, tz: 'Asia/Dubai', region: 'Asia' },
  { name: 'Osaka', lon: 135.5, tz: 'Asia/Tokyo', region: 'Asia' },
  { name: 'Manila', lon: 121.0, tz: 'Asia/Manila', region: 'Asia' },
  { name: 'Ho Chi Minh City', lon: 106.7, tz: 'Asia/Ho_Chi_Minh', region: 'Asia' },
  { name: 'Istanbul', lon: 29.0, tz: 'Europe/Istanbul', region: 'Asia' },
  // Europe
  { name: 'London', lon: -0.13, tz: 'Europe/London', region: 'Europe' },
  { name: 'Paris', lon: 2.35, tz: 'Europe/Paris', region: 'Europe' },
  { name: 'Berlin', lon: 13.4, tz: 'Europe/Berlin', region: 'Europe' },
  { name: 'Rome', lon: 12.5, tz: 'Europe/Rome', region: 'Europe' },
  { name: 'Madrid', lon: -3.7, tz: 'Europe/Madrid', region: 'Europe' },
  { name: 'Moscow', lon: 37.6, tz: 'Europe/Moscow', region: 'Europe' },
  { name: 'Amsterdam', lon: 4.9, tz: 'Europe/Amsterdam', region: 'Europe' },
  { name: 'Zurich', lon: 8.5, tz: 'Europe/Zurich', region: 'Europe' },
  { name: 'Stockholm', lon: 18.1, tz: 'Europe/Stockholm', region: 'Europe' },
  { name: 'Athens', lon: 23.7, tz: 'Europe/Athens', region: 'Europe' },
  // Americas
  { name: 'New York', lon: -74.0, tz: 'America/New_York', region: 'Americas' },
  { name: 'Los Angeles', lon: -118.2, tz: 'America/Los_Angeles', region: 'Americas' },
  { name: 'San Francisco', lon: -122.4, tz: 'America/Los_Angeles', region: 'Americas' },
  { name: 'Chicago', lon: -87.6, tz: 'America/Chicago', region: 'Americas' },
  { name: 'Toronto', lon: -79.4, tz: 'America/Toronto', region: 'Americas' },
  { name: 'Vancouver', lon: -123.1, tz: 'America/Vancouver', region: 'Americas' },
  { name: 'Honolulu', lon: -157.9, tz: 'Pacific/Honolulu', region: 'Americas' },
  { name: 'São Paulo', lon: -46.6, tz: 'America/Sao_Paulo', region: 'Americas' },
  { name: 'Boston', lon: -71.1, tz: 'America/New_York', region: 'Americas' },
  { name: 'Washington DC', lon: -77.0, tz: 'America/New_York', region: 'Americas' },
  { name: 'Seattle', lon: -122.3, tz: 'America/Los_Angeles', region: 'Americas' },
  { name: 'Houston', lon: -95.4, tz: 'America/Chicago', region: 'Americas' },
  { name: 'Mexico City', lon: -99.1, tz: 'America/Mexico_City', region: 'Americas' },
  // Oceania
  { name: 'Sydney', lon: 151.2, tz: 'Australia/Sydney', region: 'Oceania' },
  { name: 'Melbourne', lon: 144.9, tz: 'Australia/Melbourne', region: 'Oceania' },
  { name: 'Auckland', lon: 174.8, tz: 'Pacific/Auckland', region: 'Oceania' },
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
