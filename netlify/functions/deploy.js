/* =====================================================
   deploy.js: ФУНКСИЯИ ДЕПЛОЙ (Netlify Function, дар сервер кор мекунад)
   Барои чӣ: сайти сохташударо ба Netlify мефиристад ва линк бармегардонад.
   Токен дар браузер НАМЕОЯД: он танҳо дар Netlify (Environment variables) нигоҳ дошта мешавад.

   Ду тағйирёбандаи ҳатмӣ дар Netlify (Site configuration → Environment variables):
     NETLIFY_AUTH_TOKEN = токени шахсии шумо (User settings → Applications → Personal access tokens)
     ACCESS_CODE        = рамзи дастрасӣ, ки шумо худатон мебаред (барои муҳофизат аз дигарон)
   ===================================================== */
const crypto = require('crypto');
const API = 'https://api.netlify.com/api/v1';

/* ===== Ҷавоби JSON ===== */
function reply(status, obj) {
  return { statusCode: status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, body: JSON.stringify(obj) };
}

/* ===== Муқоисаи бехатари рамз (бе фарқи вақт) ===== */
function sameCode(a, b) {
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

/* ===== Дархост ба Netlify API ===== */
async function api(token, method, path, body, raw) {
  const headers = { Authorization: 'Bearer ' + token };
  let payload;
  if (raw !== undefined) { headers['Content-Type'] = 'application/octet-stream'; payload = raw; }
  else if (body !== undefined) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
  const res = await fetch(API + path, { method, headers, body: payload });
  let json = null;
  const text = await res.text();
  try { json = text ? JSON.parse(text) : null; } catch (e) { json = { raw: text }; }
  return { ok: res.ok, status: res.status, json };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return reply(405, { error: 'method' });

  const token = process.env.NETLIFY_AUTH_TOKEN;
  const code = process.env.ACCESS_CODE;
  if (!token || !code) return reply(500, { error: 'not_configured' });

  /* 1. Рамзи дастрасӣ */
  const sent = event.headers['x-access-code'] || event.headers['X-Access-Code'] || '';
  if (!sameCode(sent, code)) return reply(401, { error: 'bad_code' });

  /* 2. Маълумоти воридшуда */
  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return reply(400, { error: 'bad_json' }); }
  const { name, siteId, html } = body;
  if (typeof html !== 'string' || html.length < 100) return reply(400, { error: 'no_html' });
  if (Buffer.byteLength(html) > 4500000) return reply(413, { error: 'too_big' });

  try {
    /* 3. Сайт: ё нав месозем, ё мавҷударо нав мекунем */
    let site;
    if (siteId) {
      const g = await api(token, 'GET', '/sites/' + encodeURIComponent(siteId));
      if (!g.ok) return reply(404, { error: 'site_not_found' });
      site = g.json;
    } else {
      if (!/^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/.test(String(name || ''))) return reply(400, { error: 'bad_name' });
      const c = await api(token, 'POST', '/sites', { name });
      if (!c.ok) {
        const msg = JSON.stringify(c.json || '').toLowerCase();
        if (c.status === 422 || msg.includes('subdomain') || msg.includes('already')) return reply(409, { error: 'name_taken' });
        return reply(502, { error: 'netlify', status: c.status });
      }
      site = c.json;
    }

    /* 4. Деплой: файли index.html (бо usuli SHA1) */
    const sha = crypto.createHash('sha1').update(html, 'utf8').digest('hex');
    const d = await api(token, 'POST', '/sites/' + site.id + '/deploys', { files: { '/index.html': sha } });
    if (!d.ok) return reply(502, { error: 'netlify_deploy', status: d.status });
    const deploy = d.json;

    const needed = Array.isArray(deploy.required) ? deploy.required : [];
    if (needed.length === 0 || needed.includes(sha)) {
      const up = await api(token, 'PUT', '/deploys/' + deploy.id + '/files/index.html', undefined, Buffer.from(html, 'utf8'));
      if (!up.ok) return reply(502, { error: 'netlify_upload', status: up.status });
    }

    /* 5. Интизор мешавем, то деплой тайёр шавад (то 8 сония) */
    let state = deploy.state;
    for (let i = 0; i < 16 && state !== 'ready' && state !== 'error'; i++) {
      await new Promise(r => setTimeout(r, 500));
      const s = await api(token, 'GET', '/deploys/' + deploy.id);
      if (s.ok && s.json) state = s.json.state;
    }
    if (state === 'error') return reply(502, { error: 'deploy_failed' });

    const url = site.ssl_url || site.url || ('https://' + site.name + '.netlify.app');
    return reply(200, { ok: true, siteId: site.id, name: site.name, url, adminUrl: site.admin_url || '', state });
  } catch (e) {
    return reply(500, { error: 'server', detail: String(e && e.message || e).slice(0, 200) });
  }
};
