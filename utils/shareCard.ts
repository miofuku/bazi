import { Atmosphere } from '../content/xiangfa/atmosphere';

// Renders a 1080×1350 share card on a canvas: the reading's own medallion SVG
// (serialized from the DOM — no duplicate artwork) over the element's hero
// gradient, with the nature name and thriving line in the site's fonts.

const W = 1080;
const H = 1350;

const hexA = (hex: string, alpha: number): string => {
  const n = hex.replace('#', '');
  return `rgba(${parseInt(n.slice(0, 2), 16)}, ${parseInt(n.slice(2, 4), 16)}, ${parseInt(n.slice(4, 6), 16)}, ${alpha})`;
};

// Serialize an in-page SVG and load it as a drawable image.
const svgToImage = (svg: SVGSVGElement, size: number): Promise<HTMLImageElement> => {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('width', String(size));
  clone.setAttribute('height', String(size));
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }));
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('medallion failed to render')); };
    img.src = url;
  });
};

// Word-wrap a line to a max width, returning the drawn lines.
const wrap = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const probe = line ? `${line} ${w}` : w;
    if (ctx.measureText(probe).width > maxWidth && line) { lines.push(line); line = w; }
    else line = probe;
  }
  if (line) lines.push(line);
  return lines;
};

export async function buildShareCard(opts: {
  medallion: SVGSVGElement;
  natureName: string;   // "The Tree"
  imageTitle: string;   // "A great tree reaching for the sky"
  thrivingLine: string;
  atmo: Atmosphere;
}): Promise<Blob> {
  const { medallion, natureName, imageTitle, thrivingLine, atmo } = opts;

  // Make sure the site fonts are usable on the canvas before drawing.
  await Promise.all([
    document.fonts.load('600 92px Fraunces'),
    document.fonts.load('italic 44px Fraunces'),
    document.fonts.load('400 36px Inter'),
    document.fonts.load('600 30px Inter'),
  ]).catch(() => { /* fall back to system fonts */ });

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Background: the element's deep gradient with the season glow up top.
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, atmo.deepTop);
  bg.addColorStop(1, atmo.deepBottom);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, 90, 0, W / 2, 90, 900);
  glow.addColorStop(0, hexA(atmo.accent, 0.4));
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Medallion, centered in the upper half.
  const img = await svgToImage(medallion, 520);
  ctx.drawImage(img, (W - 520) / 2, 150, 520, 520);

  // Text block.
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F4F0E8';
  ctx.font = '600 92px Fraunces, serif';
  ctx.fillText(`You are ${natureName}.`, W / 2, 810);

  ctx.fillStyle = 'rgba(244, 240, 232, 0.72)';
  ctx.font = 'italic 44px Fraunces, serif';
  ctx.fillText(imageTitle, W / 2, 886);

  ctx.font = '400 36px Inter, sans-serif';
  let y = 1000;
  for (const line of wrap(ctx, thrivingLine, 820)) {
    ctx.fillText(line, W / 2, y);
    y += 54;
  }

  // Wordmark footer.
  ctx.fillStyle = atmo.accent;
  ctx.font = '600 30px Inter, sans-serif';
  const tagline = 'R O O T W I S E · Y O U R  N A T U R E ,  B Y  S E A S O N';
  ctx.fillText(tagline, W / 2, H - 90);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('card export failed'))), 'image/png'),
  );
}
