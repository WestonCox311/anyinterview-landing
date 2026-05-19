import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const prerender = true;

// ── Font loading (local TTF files — Satori's opentype.js requires TTF/OTF) ──

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = path.resolve(__dirname, '../../src/fonts');

function loadLocalFont(filename: string): ArrayBuffer {
  const buf = readFileSync(path.join(FONTS_DIR, filename));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

// ── OG image design ───────────────────────────────────────────────────────────
// Rules for Satori:
//  - Every element with >1 child MUST have display: 'flex'
//  - Avoid empty children: [] — use children: '' or omit
//  - No position: absolute on interior elements (limited support)
//  - gap is supported in recent satori; use marginRight on children if needed

export const GET: APIRoute = async () => {
  const frauncesBuffer = loadLocalFont('fraunces-400.ttf');
  const interBuffer = loadLocalFont('inter-500.ttf');

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: '#f5f2ea',
          padding: '68px 80px 60px',
          boxSizing: 'border-box',
        },
        children: [
          // ── Brand row: logo mark + wordmark ──────────────────────────────
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: '52px',
              },
              children: [
                // Speech bubble mark as an inline SVG string rendered in a div
                // (Satori supports SVG elements directly inside JSX-like trees)
                {
                  type: 'svg',
                  props: {
                    xmlns: 'http://www.w3.org/2000/svg',
                    viewBox: '0 0 100 100',
                    width: '60',
                    height: '60',
                    children: [
                      {
                        type: 'path',
                        props: {
                          d: 'M44,22 L84,22 Q96,22 96,34 L96,70 Q96,82 84,82 L78,82 L72,95 L66,82 L44,82 Q32,82 32,70 L32,34 Q32,22 44,22 Z',
                          fill: '#c4d2e8',
                        },
                      },
                      {
                        type: 'path',
                        props: {
                          d: 'M16,4 L60,4 Q72,4 72,16 L72,54 Q72,66 60,66 L30,66 L12,80 L20,66 L16,66 Q4,66 4,54 L4,16 Q4,4 16,4 Z',
                          fill: '#2d3f55',
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontFamily: 'Fraunces',
                      fontWeight: 400,
                      fontSize: '36px',
                      color: '#1d2b3a',
                      letterSpacing: '-0.02em',
                      lineHeight: '1',
                      marginLeft: '16px',
                    },
                    children: 'AnyInterview',
                  },
                },
              ],
            },
          },

          // ── Main headline ────────────────────────────────────────────────
          {
            type: 'div',
            props: {
              style: {
                fontFamily: 'Fraunces',
                fontWeight: 400,
                fontSize: '78px',
                lineHeight: '1.06',
                letterSpacing: '-0.025em',
                color: '#1d2b3a',
                flex: '1',
              },
              children: 'Run 10× the interviews.\nZero extra hours.',
            },
          },

          // ── Subhead + footer row ─────────────────────────────────────────
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginTop: '32px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontFamily: 'Fraunces',
                      fontWeight: 400,
                      fontSize: '26px',
                      lineHeight: '1.4',
                      color: '#5a7a8a',
                      fontStyle: 'italic',
                      maxWidth: '680px',
                    },
                    children:
                      'Configure in chat. Send a link.\nGet back the transcript, recording, and analysis.',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontFamily: 'Inter',
                      fontWeight: 500,
                      fontSize: '20px',
                      color: '#8a9aaa',
                      letterSpacing: '0.01em',
                    },
                    children: 'anyinterview.to',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Fraunces', data: frauncesBuffer, weight: 400, style: 'normal' },
        { name: 'Inter', data: interBuffer, weight: 500, style: 'normal' },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
