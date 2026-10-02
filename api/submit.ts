import type { IncomingMessage, ServerResponse } from 'node:http';

const MAX_BODY_BYTES = 28 * 1024 * 1024;

type Submission = {
  type?: 'contact' | 'order';
  fields?: Record<string, string>;
  attachment?: { name?: string; type?: string; content?: string };
};

function sendJson(response: ServerResponse, status: number, body: object) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(body));
}

async function readJson(request: IncomingMessage): Promise<Submission> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BODY_BYTES) throw new Error('The uploaded file is too large.');
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Submission;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  })[character] ?? character);
}

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  if (request.method !== 'POST') return sendJson(response, 405, { error: 'Method not allowed.' });
  if (!process.env.RESEND_API_KEY) {
    return sendJson(response, 503, { error: 'Email delivery is not configured yet. Please use WhatsApp for now.' });
  }

  const contactToEmail = process.env.CONTACT_TO_EMAIL || 'mateendocumentation@gmail.com';

  try {
    const submission = await readJson(request);
    if (!submission.type || !submission.fields?.['Full Name'] || !submission.fields.Phone) {
      return sendJson(response, 400, { error: 'Please complete all required fields.' });
    }

    const rows = Object.entries(submission.fields)
      .map(([label, value]) => `<tr><th align="left" style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(label)}</th><td style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(value || '—')}</td></tr>`)
      .join('');
    const attachment = submission.attachment?.content ? [{
      filename: submission.attachment.name || 'attachment',
      content: submission.attachment.content,
      content_type: submission.attachment.type || 'application/octet-stream',
    }] : undefined;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'Mateen Documentation Website <contact@mateendocumentation.com>',
        to: [contactToEmail],
        reply_to: submission.fields.Email || undefined,
        subject: `${submission.type === 'order' ? 'Online order' : 'Contact message'} from ${submission.fields['Full Name']}`,
        html: `<h1>Mateen Documentation website submission</h1><table style="border-collapse:collapse">${rows}</table>`,
        attachments: attachment,
      }),
    });

    if (!resendResponse.ok) throw new Error('Email delivery failed.');
    return sendJson(response, 200, { ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Submission failed.';
    return sendJson(response, 500, { error: message });
  }
}
