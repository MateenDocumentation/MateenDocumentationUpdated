/**
 * api/deploy.ts — Global CMS deploy endpoint
 *
 * Authenticated CMS users can trigger a Vercel rebuild after saving changes
 * anywhere in the admin panel. This endpoint does not change any page status.
 */

import type { IncomingMessage, ServerResponse } from 'node:http';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const DEPLOY_HOOK_URL = process.env.VERCEL_DEPLOY_HOOK_URL ?? '';

function serviceHeaders(prefer = 'return=representation') {
  return {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: prefer,
  };
}

function send(res: ServerResponse, status: number, body: object) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(body));
}

async function getAuthUser(jwt: string): Promise<{ id: string; email: string } | null> {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) return null;

    const data = await response.json() as { id?: string; email?: string };
    if (!data.id) return null;

    return { id: data.id, email: data.email ?? '' };
  } catch {
    return null;
  }
}

async function getUserRole(userId: string): Promise<string | null> {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=role&limit=1`,
    { headers: serviceHeaders() }
  );

  if (!response.ok) return null;

  const rows = await response.json() as Array<{ role?: string }>;
  return rows[0]?.role ?? null;
}

async function createDeploymentLog(userId: string): Promise<string | null> {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/deployment_logs`, {
      method: 'POST',
      headers: serviceHeaders(),
      body: JSON.stringify({
        triggered_by: userId,
        status: 'pending',
        action: 'global_deploy',
      }),
    });

    if (!response.ok) return null;

    const rows = await response.json() as Array<{ id?: string }>;
    return rows[0]?.id ?? null;
  } catch {
    return null;
  }
}

async function updateDeploymentLog(
  id: string,
  body: Record<string, unknown>
): Promise<void> {
  await fetch(
    `${SUPABASE_URL}/rest/v1/deployment_logs?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: serviceHeaders('return=minimal'),
      body: JSON.stringify(body),
    }
  ).catch(() => undefined);
}

async function createAuditLog(user: { id: string; email: string }) {
  await fetch(`${SUPABASE_URL}/rest/v1/audit_logs`, {
    method: 'POST',
    headers: serviceHeaders(),
    body: JSON.stringify({
      user_id: user.id,
      user_email: user.email,
      action: 'global_deploy',
      table_name: 'deployment_logs',
      details: { source: 'cms_global_deploy_button' },
    }),
  }).catch(() => undefined);
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
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

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !DEPLOY_HOOK_URL) {
    console.error('[deploy] Missing required server environment variables');
    return send(res, 500, {
      error: 'Server configuration error',
      message: 'Supabase or Vercel deploy hook configuration is missing.',
    });
  }

  const authHeader = req.headers.authorization ?? '';
  const jwt = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!jwt) {
    return send(res, 401, { error: 'Missing Authorization header' });
  }

  const user = await getAuthUser(jwt);
  if (!user) {
    return send(res, 401, { error: 'Invalid or expired token' });
  }

  const role = await getUserRole(user.id);
  if (!role || !['SUPER_ADMIN', 'EDITOR'].includes(role)) {
    return send(res, 403, { error: 'Insufficient CMS permissions' });
  }

  const deployLogId = await createDeploymentLog(user.id);

  try {
    const hookResponse = await fetch(DEPLOY_HOOK_URL, { method: 'POST' });

    if (!hookResponse.ok) {
      throw new Error(`Vercel deploy hook responded with ${hookResponse.status}`);
    }

    const hookData = await hookResponse.json() as { job?: { id?: string } };
    const deployId = hookData?.job?.id ?? null;

    if (deployLogId) {
      await updateDeploymentLog(deployLogId, {
        status: 'triggered',
        deploy_id: deployId,
      });
    }

    await createAuditLog(user);

    return send(res, 200, {
      success: true,
      deploy: 'triggered',
      deploy_id: deployId,
      message: 'Vercel build triggered. Your latest saved CMS changes are being deployed.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown deploy error';
    console.error('[deploy] Trigger failed:', message);

    if (deployLogId) {
      await updateDeploymentLog(deployLogId, {
        status: 'failed',
        error_message: message,
      });
    }

    return send(res, 500, {
      success: false,
      deploy: 'failed',
      error: message,
      message: 'Could not trigger the Vercel build.',
    });
  }
}
