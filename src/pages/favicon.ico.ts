/**
 * Build-time favicon.ico endpoint.
 * Rasterizes /public/favicon.svg to a 32×32 PNG and serves it as image/x-icon.
 * Browsers accept PNG-in-ICO natively (standard since IE 6 / Chrome / Firefox).
 */
import type { APIRoute } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const prerender = true;

export const GET: APIRoute = () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const svgPath = path.resolve(__dirname, '../../public/favicon.svg');
  const svg = readFileSync(svgPath, 'utf-8');

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 32 } });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: { 'Content-Type': 'image/x-icon' },
  });
};
