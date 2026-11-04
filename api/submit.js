// Optional serverless endpoint: POST /api/submit  -> appends a row to Google Sheets.
// Secrets are read from environment variables only (never from the browser).
const { google } = require('googleapis');

const clean = (v, max = 2000) => {
  let s = String(v || '').slice(0, max).trim();
  if (/^[=+\-@]/.test(s)) s = "'" + s; // block spreadsheet formula injection
  return s;
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot for bots

  const type = b.type === 'chat' ? 'Chat' : 'Quotes';
  const name = clean(b.name, 80);
  const contact = clean(b.contact || b.email, 120);
  const message = clean(b.message);
  if (name.length < 2 || contact.length < 5 || message.length < 10) {
    return res.status(400).json({ ok: false, error: 'Missing fields' });
  }

  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${type}!A:H`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          new Date().toISOString(), name, clean(b.company, 100), contact,
          clean(b.phone, 25), clean(b.service, 100), clean(b.budget, 100), message,
        ]],
      },
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false });
  }
};
