import type { Inquiry, ChatMessage } from './validation';
const esc = (x: string) => x.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
export async function sendInquiry(d: Inquiry) {
  const key = process.env.RESEND_API_KEY, to = process.env.INQUIRY_TO, from = process.env.INQUIRY_FROM;
  if (!key || !to || !from) throw new Error('Mail environment variables are missing');
  const rows = [['Name', d.name], ['Company', d.company || '-'], ['Email', d.email], ['Phone', d.phone || '-'], ['Service', d.service], ['Budget', d.budget]];
  const html = `<table>${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`).join('')}</table><p>${esc(d.message).replace(/\n/g, '<br>')}</p>`;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], reply_to: d.email, subject: `New quote request: ${d.service} (${d.name})`.replace(/[\r\n]/g, ' '), html }),
  });
  if (!r.ok) throw new Error('Mail provider error ' + r.status);
}

export const mailConfigured = () => !!(process.env.RESEND_API_KEY && process.env.INQUIRY_TO && process.env.INQUIRY_FROM);
export async function sendChat(d: ChatMessage) {
  const key = process.env.RESEND_API_KEY, to = process.env.INQUIRY_TO, from = process.env.INQUIRY_FROM;
  if (!key || !to || !from) throw new Error('Mail environment variables are missing');
  const rows = [['Name', d.name], ['Company', d.company || '-'], ['Contact', d.contact]];
  const html = `<table>${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`).join('')}</table><p>${esc(d.message).replace(/\n/g, '<br>')}</p>`;
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.contact);
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], ...(isEmail ? { reply_to: d.contact } : {}), subject: `New chat message (${d.name})`.replace(/[\r\n]/g, ' '), html }),
  });
  if (!r.ok) throw new Error('Mail provider error ' + r.status);
}
