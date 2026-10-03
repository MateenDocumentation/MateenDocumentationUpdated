/**
 * api/publish.ts — Vercel Serverless Function
 *
 * Secure publish/unpublish endpoint for the Mateen Documentation CMS.
 * Called from the admin frontend with a Supabase JWT in the Authorization header.
 * Validates the JWT, checks the user's CMS role, updates page status in Supabase,
 * records an audit log entry, and triggers the Vercel Deploy Hook.
 *
 * Environment variables (set in Vercel → Settings → Environment Variables):
 *   VITE_SUPABASE_URL           — public, also available here as process.env
 *   SUPABASE_SERVICE_ROLE_KEY   — server-side ONLY, never exposed to browser
 *   VERCEL_DEPLOY_HOOK_URL      — secret hook URL, never exposed to browser
 */

import type { IncomingMessage, ServerResponse } from 'node:http';

// ─── Supabase REST helpers (no SDK dependency in Node.js runtime) ──────────

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const DEPLOY_HOOK_URL = process.env.VERCEL_DEPLOY_HOOK_URL ?? '';

function supabaseHeaders(useServiceRole = false) {
  return {
    apikey: useServiceRole ? SERVICE_ROLE_KEY : SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };
}

async function supabaseGet(path: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: supabaseHeaders(true),
  });
  return res.json() as Promise<unknown[]>;
}

async function supabasePost(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'POST',
    headers: supabaseHeaders(true),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase POST ${path}: ${text}`);
  }
  return res;
}

async function supabasePatch(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'PATCH',
    headers: { ...supabaseHeaders(true), Prefer: 'return=minimal' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase PATCH ${path}: ${text}`);
  }
}

/** Validate a Supabase JWT and return the authenticated user. */
async function getAuthUser(jwt: string): Promise<{ id: string; email: string } | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${jwt}`,
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { id?: string; email?: string };
    if (!data.id) return null;
    return { id: data.id, email: data.email ?? '' };
  } catch {
    return null;
  }
}

// ─── Request body ──────────────────────────────────────────────────────────

interface PublishBody {
  page_id: string;
  page_slug: string;
  action: 'publish' | 'unpublish';
}

async function readBody(req: IncomingMessage): Promise<PublishBody> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as PublishBody;
}

// ─── Response helpers ──────────────────────────────────────────────────────

function send(res: ServerResponse, status: number, body: object) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(body));
}

// ─── Main handler ──────────────────────────────────────────────────────────

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    return send(res, 405, { error: 'Method not allowed' });
  }

  // ── 1. Validate configuration ────────────────────────────────────────────
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('[publish] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return send(res, 500, { error: 'Server configuration error' });
  }

  // ── 2. Authenticate the request ──────────────────────────────────────────
  const authHeader = req.headers.authorization ?? '';
  const jwt = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!jwt) {
    return send(res, 401, { error: 'Missing Authorization header' });
  }

  const user = await getAuthUser(jwt);
  if (!user) {
    return send(res, 401, { error: 'Invalid or expired token' });
  }

  // ── 3. Check CMS role ────────────────────────────────────────────────────
  const profiles = await supabaseGet(
    `profiles?id=eq.${encodeURIComponent(user.id)}&select=role&limit=1`
  ) as Array<{ role: string }>;

  const role = profiles[0]?.role;
  if (!role || !['SUPER_ADMIN', 'EDITOR'].includes(role)) {
    return send(res, 403, { error: 'Insufficient CMS permissions' });
  }

  // ── 4. Parse + validate body ─────────────────────────────────────────────
  let body: PublishBody;
  try {
    body = await readBody(req);
  } catch {
    return send(res, 400, { error: 'Invalid request body' });
  }

  const { page_id, page_slug, action } = body;
  if (!page_id || !['publish', 'unpublish'].includes(action)) {
    return send(res, 400, { error: 'page_id and action (publish|unpublish) are required' });
  }

  // ── 5. Read current page state (for version snapshot) ───────────────────
  const pages = await supabaseGet(
    `pages?id=eq.${encodeURIComponent(page_id)}&limit=1`
  ) as Array<Record<string, unknown>>;

  if (!pages.length) {
    return send(res, 404, { error: 'Page not found' });
  }
  const previousState = pages[0];

  // ── 6. Update page status ────────────────────────────────────────────────
  const newStatus = action === 'publish' ? 'published' : 'unpublished';
  const now = new Date().toISOString();

  try {
    await supabasePatch(
      `pages?id=eq.${encodeURIComponent(page_id)}`,
      {
        status: newStatus,
        last_edited_at: now,
        last_edited_by: user.id,
        ...(action === 'publish'
          ? { published_at: now, published_by: user.id }
          : {}),
        updated_at: now,
      }
    );
  } catch (err) {
    console.error('[publish] Failed to update page status:', err);
    return send(res, 500, { error: 'Failed to update page status' });
  }

  // ── 7. Record content version (previous state snapshot) ──────────────────
  try {
    await supabasePost('content_versions', {
      table_name: 'pages',
      record_id: page_id,
      snapshot: previousState,
      new_snapshot: { ...previousState, status: newStatus, updated_at: now },
      changed_by: user.id,
      action,
    });
  } catch (err) {
    console.warn('[publish] Failed to record content version:', err);
    // Non-fatal — continue
  }

  // ── 8. Record audit log ──────────────────────────────────────────────────
  try {
    await supabasePost('audit_logs', {
      user_id: user.id,
      user_email: user.email,
      action: `${action}_page`,
      table_name: 'pages',
      record_id: page_id,
      details: { page_slug, previous_status: previousState.status, new_status: newStatus },
    });
  } catch (err) {
    console.warn('[publish] Failed to record audit log:', err);
    // Non-fatal
  }

  // ── 9. Record deployment log ─────────────────────────────────────────────
  let deployLogId: string | null = null;
  try {
    const deployLogRes = await supabasePost('deployment_logs', {
      triggered_by: user.id,
      status: 'pending',
      page_id,
      page_slug,
      action,
    });
    const deployLog = (await deployLogRes.json()) as Array<{ id: string }>;
    deployLogId = deployLog[0]?.id ?? null;
  } catch (err) {
    console.warn('[publish] Failed to create deployment log:', err);
  }

  // ── 10. Trigger Vercel Deploy Hook ────────────────────────────────────────
  // Both publish AND unpublish trigger a redeploy so the public site reflects the new state.
  if (!DEPLOY_HOOK_URL) {
    console.warn('[publish] VERCEL_DEPLOY_HOOK_URL not configured — skipping deploy trigger');
    return send(res, 200, {
      success: true,
      new_status: newStatus,
      deploy: 'skipped',
      message: `Page ${action}ed in CMS. Configure VERCEL_DEPLOY_HOOK_URL to trigger automatic deploys.`,
    });
  }

  try {
    const hookRes = await fetch(DEPLOY_HOOK_URL, { method: 'POST' });

    if (!hookRes.ok) {
      throw new Error(`Hook responded with ${hookRes.status}`);
    }

    const hookData = (await hookRes.json()) as { job?: { id?: string } };
    const deployId = hookData?.job?.id ?? null;

    // Update deployment log with success
    if (deployLogId) {
      await supabasePatch(
        `deployment_logs?id=eq.${encodeURIComponent(deployLogId)}`,
        { status: 'triggered', deploy_id: deployId }
      ).catch(() => {}); // best-effort
    }

    return send(res, 200, {
      success: true,
      new_status: newStatus,
      deploy: 'triggered',
      deploy_id: deployId,
      message: `Page ${action}ed. Vercel build triggered — live in ~60 seconds.`,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[publish] Deploy hook failed:', errorMessage);

    // Update deployment log with failure
    if (deployLogId) {
      await supabasePatch(
        `deployment_logs?id=eq.${encodeURIComponent(deployLogId)}`,
        { status: 'failed', error_message: errorMessage }
      ).catch(() => {});
    }

    // Page status was already updated — the LAST successful build stays live (fallback preserved)
    return send(res, 200, {
      success: true,
      new_status: newStatus,
      deploy: 'failed',
      message: `Page marked as ${newStatus} in CMS, but the Vercel deploy trigger failed. The previous live build remains online. Retry or trigger a manual deploy from Vercel.`,
    });
  }
}
