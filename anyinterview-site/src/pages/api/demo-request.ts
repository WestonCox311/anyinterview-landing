export const prerender = false;

import type { APIRoute } from 'astro';

const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;

export const POST: APIRoute = async ({ request }) => {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (entry && now < entry.resetAt) {
    if (entry.count >= RATE_LIMIT) {
      return new Response(JSON.stringify({ ok: false, error: 'rate_limited' }), { status: 429 });
    }
    entry.count++;
  } else {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
  }

  // Body size check
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 4096) {
    return new Response(JSON.stringify({ ok: false, error: 'payload_too_large' }), { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), { status: 400 });
  }

  // Honeypot
  if (body['hp_company2']) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  // Validation
  const email = String(body['email'] ?? '');
  const name = String(body['name'] ?? '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_email' }), { status: 400 });
  }
  if (!name || name.length > 80) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_name' }), { status: 400 });
  }

  // Log to console for now (Supabase integration requires env vars set up separately)
  console.log('Demo request:', { email, name, company: body['company'], useCase: body['useCase'], ts: body['ts'] });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
