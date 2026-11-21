/* =====================================================
   app.js: ИДОРАКУНИИ SARMOYA CREATE
   Қисмҳо: 1 кумакӣ, 2 анбор, 3 саҳифаи асосӣ, 4 таҳриргар,
           5 пешнамоиш (iPhone), 6 деплой
   (мотори сайт: generator.js, функсияи деплой: netlify/functions/deploy.js)
   ===================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

let P = null;   // лоиҳаи ҳозира: { id, title, data, siteId, siteName, url, ... }
let S = null;   // маълумоти сайти ҳозира (P.data)

/* =====================================================
   1 · КУМАКӢ
   ===================================================== */
function uid() { return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('on'), 3600);
}

// Номи тоҷикӣ/русиро ба ҳарфҳои лотинӣ мегардонад (барои номи сайт)
const TL = { а: 'a', б: 'b', в: 'v', г: 'g', ғ: 'gh', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', ӣ: 'i', й: 'y', к: 'k', қ: 'q', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ӯ: 'u', ф: 'f', х: 'kh', ҳ: 'h', ц: 'ts', ч: 'ch', ҷ: 'j', ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
function slugify(s) {
  let x = String(s || '').toLowerCase().split('').map(c => TL[c] !== undefined ? TL[c] : c).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40).replace(/-+$/g, '');
  if (x.length < 3) x = (x ? x + '-' : '') + 'sayt';
  return x;
}
const NAME_RE = /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/;

function saveBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

// Маълумотро ба шакли дуруст меорад (агар кӯҳна ё нопурра бошад)
function normalizeData(d) {
  const b = defaultData(d && d.type);
  const o = Object.assign({}, b, d);
  o.show = Object.assign({}, b.show, (d && d.show) || {});
  o.images = Object.assign({ hero: '', about: '', gallery: [] }, (d && d.images) || {});
  if (!Array.isArray(o.images.gallery)) o.images.gallery = [];
  ['services', 'advantages', 'reviews', 'stats', 'faq'].forEach(k => { if (!Array.isArray(o[k])) o[k] = b[k]; });
  if (!THEMES[o.theme]) o.theme = 'gold';
  if (!FONTS[o.font]) o.font = 'elegant';
  if (!LAYOUTS[o.layout]) o.layout = 'arch';
  return o;
}

/* =====================================================
   2 · АНБОР (IndexedDB): лоиҳаҳо дар браузери шумо нигоҳ дошта мешаванд
   Барои чӣ: файл зеркашӣ кардан лозим нест, сайт дар худи барнома мемонад
   ===================================================== */
const mem = new Map();                       // захираи вақтӣ, агар IndexedDB кор накунад
let dbp = null;
function getDB() {
  if (!window.indexedDB) return Promise.reject(new Error('no-idb'));
  if (!dbp) dbp = new Promise((res, rej) => {
    const r = indexedDB.open('sarmoya-create', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('projects', { keyPath: 'id' });
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  return dbp;
}
async function dbReq(mode, fn, fallback) {
  try {
    const db = await getDB();
    return await new Promise((res, rej) => {
      const t = db.transaction('projects', mode);
      const req = fn(t.objectStore('projects'));
      t.oncomplete = () => res(req && req.result);
      t.onerror = () => rej(t.error);
    });
  } catch (e) { return fallback(); }
}
const DB = {
  all: () => dbReq('readonly', s => s.getAll(), () => [...mem.values()]),
  get: id => dbReq('readonly', s => s.get(id), () => mem.get(id)),
  put: p => { mem.set(p.id, p); return dbReq('readwrite', s => s.put(p), () => p); },
  del: id => { mem.delete(id); return dbReq('readwrite', s => s.delete(id), () => null); }
};

/* =====================================================
   3 · САҲИФАИ АСОСӢ
   ===================================================== */
let selType = 'cakes';

function renderStartTypes() {
  const box = $('#startTypes');
  box.innerHTML = '';
  Object.keys(PRESETS).forEach(k => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = PRESETS[k].icon + '  ' + PRESETS[k].label;
    b.className = selType === k ? 'on' : '';
    b.addEventListener('click', () => { selType = k; renderStartTypes(); });
    box.appendChild(b);
  });
}

// Намоиши хурди сайт дар корт: iframe-ро бо scale мутобиқ мекунем
function fitThumbs() {
  $$('.tshot').forEach(box => {
    const f = box.querySelector('iframe');
    if (f && box.clientWidth) f.style.transform = 'scale(' + (box.clientWidth / 390) + ')';
  });
}
const thumbObs = 'IntersectionObserver' in window ? new IntersectionObserver(en => {
  en.forEach(x => {
    if (!x.isIntersecting) return;
    const f = x.target.querySelector('iframe');
    if (f && x.target._html && !f.srcdoc) f.srcdoc = x.target._html();
    thumbObs.unobserve(x.target);
  });
}, { rootMargin: '200px' }) : null;

function addThumb(shot, htmlFn) {
  shot._html = htmlFn;
  if (thumbObs) thumbObs.observe(shot); else shot.querySelector('iframe').srcdoc = htmlFn();
}

function renderTemplates() {
  const g = $('#tplGrid');
  g.innerHTML = '';
  TEMPLATES.forEach(t => {
    const card = document.createElement('div');
    card.className = 'tcard';
    card.innerHTML = '<div class="tshot"><iframe title="" tabindex="-1"></iframe></div><div class="tinfo"><div><b></b><br><small></small></div></div>';
    $('b', card).textContent = t.title;
    $('small', card).textContent = PRESETS[t.type].label + ' · ' + THEMES[t.theme].label;
    addThumb($('.tshot', card), () => buildSite(fromTemplate(t.id)));
    card.addEventListener('click', () => createProject(t.id, $('#startName').value.trim()));
    g.appendChild(card);
  });
  fitThumbs();
}

async function renderProjects() {
  const list = (await DB.all() || []).sort((a, b) => b.updatedAt - a.updatedAt);
  $('#projSec').hidden = list.length === 0;
  const g = $('#projGrid');
  g.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'tcard';
    card.innerHTML = '<button class="del" type="button" title="Нест кардан">✕</button><div class="tshot"><iframe title="" tabindex="-1"></iframe></div><div class="tinfo"><div><b></b><br><small></small></div><span class="badge"></span></div>';
    $('b', card).textContent = p.title || 'Лоиҳа';
    $('small', card).textContent = p.url ? p.url.replace(/^https?:\/\//, '') : 'Нашр нашудааст';
    const bd = $('.badge', card);
    bd.textContent = p.url ? 'Дар интернет' : 'Қолаб';
    if (p.url) bd.classList.add('live');
    addThumb($('.tshot', card), () => buildSite(normalizeData(p.data)));
    card.addEventListener('click', () => { location.hash = '#/p/' + p.id; });
    $('.del', card).addEventListener('click', async e => {
      e.stopPropagation();
      if (!confirm('«' + (p.title || 'Лоиҳа') + '» нест карда шавад?' + (p.url ? '\n(Сайт дар интернет мемонад, танҳо дар ин ҷо нест мешавад.)' : ''))) return;
      await DB.del(p.id);
      renderProjects();
    });
    g.appendChild(card);
  });
  fitThumbs();
}

async function createProject(tplId, name) {
  const data = fromTemplate(tplId, name || 'Номи бизнес');
  const p = { id: uid(), title: data.name, data, siteId: '', siteName: '', url: '', deployedAt: 0, updatedAt: Date.now() };
  await DB.put(p);
  location.hash = '#/p/' + p.id;
}

$('#startForm').addEventListener('submit', e => {
  e.preventDefault();
  const t = TEMPLATES.find(x => x.type === selType) || TEMPLATES[0];
  createProject(t.id, $('#startName').value.trim());
});
$('#navProjects').addEventListener('click', e => { e.preventDefault(); $('#projSec').scrollIntoView({ behavior: 'smooth' }); });

function showHome() {
  closeModal();
  $('#editor').hidden = true;
  $('#home').hidden = false;
  renderStartTypes();
  renderTemplates();
  renderProjects();
  requestAnimationFrame(fitThumbs);
  document.title = 'Sarmoya Create: сайти зебо дар 5 дақиқа';
}

/* =====================================================
   4 · ТАҲРИРГАР
   ===================================================== */
function get(path) { return path.split('.').reduce((o, k) => o && o[k], S); }
function set(path, val) {
  const ks = path.split('.');
  let o = S;
  while (ks.length > 1) o = o[ks.shift()];
  o[ks[0]] = val;
}

/* ----- Захира (худкор) ва пешнамоиш ----- */
let saveT, viewT;
function changed() {
  $('#saveState').textContent = 'Захира мешавад...';
  clearTimeout(viewT); viewT = setTimeout(renderPreview, 300);
  clearTimeout(saveT); saveT = setTimeout(saveProject, 700);
  $('#projTitle').textContent = S.name || 'Лоиҳа';
}
async function saveProject() {
  if (!P) return;
  P.title = S.name || 'Лоиҳа';
  P.data = S;
  P.updatedAt = Date.now();
  try { await DB.put(P); $('#saveState').textContent = 'Захира шуд'; }
  catch (e) { $('#saveState').textContent = 'Захира нашуд'; toast('Захира нашуд (ҷой кам аст). Аксҳоро хурдтар кунед.'); }
}

/* ----- Бастани майдонҳо (data-k="name", data-k="show.form") ----- */
function bindFields() {
  $$('#side [data-k]').forEach(el => {
    const v = get(el.dataset.k);
    if (el.type === 'checkbox') el.checked = !!v;
    else if (el.type === 'color') el.value = v || THEMES[S.theme].accent;
    else el.value = v || '';
    if (!el.dataset.bound) {
      el.dataset.bound = '1';
      el.addEventListener('input', () => {
        set(el.dataset.k, el.type === 'checkbox' ? el.checked : el.value);
        changed();
      });
    }
  });
}

/* ----- Намуди бизнес: матнҳои намунавиро иваз мекунад ----- */
function renderTypes() {
  const box = $('#types');
  box.innerHTML = '';
  Object.keys(PRESETS).forEach(k => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = PRESETS[k].icon + '  ' + PRESETS[k].label;
    b.className = S.type === k ? 'on' : '';
    b.addEventListener('click', () => {
      const base = defaultData(k);
      ['type', 'eyebrow', 'headline', 'sub', 'about', 'cta', 'services', 'advantages'].forEach(x => { S[x] = base[x]; });
      refreshAll();
      toast('Матнҳои намунавӣ пур шуданд. Онҳоро ба бизнеси худ мувофиқ кунед.');
    });
    box.appendChild(b);
  });
}

/* ----- Рӯйхатҳо (хизмат, афзалият, шарҳ, савол, рақам) ----- */
const REPS = {
  services:   { max: 12, add: { title: '', price: '', desc: '' }, fields: [['title', 'Ном', 'text'], ['price', 'Нарх', 'text'], ['desc', 'Тавсифи кӯтоҳ', 'text']] },
  advantages: { max: 4,  add: { title: '', desc: '' },            fields: [['title', 'Сарлавҳа', 'text'], ['desc', 'Тавсиф', 'text']] },
  reviews:    { max: 6,  add: { name: '', text: '' },             fields: [['name', 'Номи мизоҷ', 'text'], ['text', 'Шарҳ', 'area']] },
  stats:      { max: 4,  add: { value: '', label: '' },           fields: [['value', 'Рақам (масалан 5+)', 'text'], ['label', 'Матн (масалан: сол таҷриба)', 'text']] },
  faq:        { max: 8,  add: { q: '', a: '' },                   fields: [['q', 'Савол', 'text'], ['a', 'Ҷавоб', 'area']] }
};
function renderRep(key) {
  const cfg = REPS[key], box = $('#rep-' + key);
  box.innerHTML = '';
  S[key].forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'item';
    cfg.fields.forEach(([f, label, type]) => {
      const w = document.createElement('label');
      w.className = 'f';
      const sp = document.createElement('span');
      sp.textContent = label;
      const inp = document.createElement(type === 'area' ? 'textarea' : 'input');
      if (type === 'area') inp.rows = 2; else inp.type = 'text';
      inp.value = item[f] || '';
      inp.addEventListener('input', () => { item[f] = inp.value; changed(); });
      w.appendChild(sp); w.appendChild(inp);
      row.appendChild(w);
    });
    const rm = document.createElement('button');
    rm.type = 'button'; rm.className = 'rm'; rm.textContent = '✕'; rm.title = 'Нест кардан';
    rm.addEventListener('click', () => { S[key].splice(i, 1); renderRep(key); changed(); });
    row.appendChild(rm);
    box.appendChild(row);
  });
  $('#add-' + key).disabled = S[key].length >= cfg.max;
}
Object.keys(REPS).forEach(key => {
  $('#add-' + key).addEventListener('click', () => {
    if (S[key].length >= REPS[key].max) return;
    S[key].push(Object.assign({}, REPS[key].add));
    renderRep(key); changed();
  });
});

/* ----- Аксҳо (хурд карда мешаванд, то сайт сабук бошад) ----- */
function readImage(file, maxSide, quality) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      const im = new Image();
      im.onerror = reject;
      im.onload = () => {
        const k = Math.min(1, maxSide / Math.max(im.width, im.height));
        const c = document.createElement('canvas');
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
function renderSlot(key, title) {
  const el = $('#slot-' + key);
  el.innerHTML = '';
  const th = document.createElement('div');
  th.className = 'thumb';
  if (S.images[key]) th.style.backgroundImage = "url('" + S.images[key] + "')"; else th.textContent = 'Акс нест';
  const b = document.createElement('b');
  b.textContent = title;
  const file = document.createElement('input');
  file.type = 'file'; file.accept = 'image/*'; file.hidden = true;
  file.addEventListener('change', () => {
    if (!file.files[0]) return;
    readImage(file.files[0], 1100, 0.78).then(url => { S.images[key] = url; renderImages(); changed(); }).catch(() => toast('Акс кушода нашуд. Акси дигарро кӯшиш кунед.'));
  });
  const pick = document.createElement('button');
  pick.type = 'button'; pick.className = 'ghost'; pick.textContent = S.images[key] ? 'Иваз' : 'Интихоб';
  pick.addEventListener('click', () => file.click());
  el.append(th, b, pick, file);
  if (S.images[key]) {
    const rm = document.createElement('button');
    rm.type = 'button'; rm.className = 'ghost'; rm.textContent = 'Нест'; rm.style.marginLeft = '6px';
    rm.addEventListener('click', () => { S.images[key] = ''; renderImages(); changed(); });
    el.appendChild(rm);
  }
}
function renderGallery() {
  const box = $('#galEdit');
  box.innerHTML = '';
  S.images.gallery.forEach((url, i) => {
    const g = document.createElement('div');
    g.className = 'g';
    g.style.backgroundImage = "url('" + url + "')";
    const rm = document.createElement('button');
    rm.type = 'button'; rm.textContent = '✕';
    rm.addEventListener('click', () => { S.images.gallery.splice(i, 1); renderGallery(); changed(); });
    g.appendChild(rm);
    box.appendChild(g);
  });
  $('#galAdd').disabled = S.images.gallery.length >= 6;
}
function renderImages() {
  renderSlot('hero', 'Акси асосӣ');
  renderSlot('about', 'Акс «Дар бораи мо»');
  renderGallery();
}
$('#galAdd').addEventListener('click', () => $('#galInput').click());
$('#galInput').addEventListener('change', e => {
  const room = 6 - S.images.gallery.length;
  const files = [...e.target.files].slice(0, room);
  Promise.all(files.map(f => readImage(f, 900, 0.76)))
    .then(urls => { S.images.gallery.push(...urls); renderGallery(); changed(); })
    .catch(() => toast('Як акс кушода нашуд.'));
  e.target.value = '';
});

/* ----- Дизайн: шакл, мавзӯъ, шрифт ----- */
function renderDesign() {
  const lb = $('#layouts');
  lb.innerHTML = '';
  Object.keys(LAYOUTS).forEach(k => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = LAYOUTS[k]; b.className = S.layout === k ? 'on' : '';
    b.addEventListener('click', () => { S.layout = k; renderDesign(); changed(); });
    lb.appendChild(b);
  });
  const box = $('#themes');
  box.innerHTML = '';
  Object.keys(THEMES).forEach(k => {
    const t = THEMES[k];
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'theme' + (S.theme === k ? ' on' : '');
    b.innerHTML = '<div class="dots"><i style="background:' + t.bg + '"></i><i style="background:' + t.accent + '"></i><i style="background:' + t.ink + '"></i></div><b>' + t.label + '</b>';
    b.addEventListener('click', () => { S.theme = k; renderDesign(); bindFields(); changed(); });
    box.appendChild(b);
  });
  const fb = $('#fonts');
  fb.innerHTML = '';
  Object.keys(FONTS).forEach(k => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = FONTS[k].label; b.className = S.font === k ? 'on' : '';
    b.addEventListener('click', () => { S.font = k; renderDesign(); changed(); });
    fb.appendChild(b);
  });
}
$('#accentReset').addEventListener('click', () => { S.accent = ''; bindFields(); changed(); });

/* ----- Ҳамаро аз нав кашидан ----- */
function refreshAll() {
  bindFields();
  renderTypes();
  Object.keys(REPS).forEach(renderRep);
  renderImages();
  renderDesign();
  changed();
}

/* ----- Аккордеон: ҳамеша як қисм кушода ----- */
$$('.side > .acc').forEach(d => d.addEventListener('toggle', () => {
  if (d.open) $$('.side > .acc').forEach(o => { if (o !== d) o.open = false; });
}));

/* ----- Кушодан ва баромадан ----- */
async function openEditor(id) {
  const p = await DB.get(id);
  if (!p) { location.hash = '#/'; return; }
  P = p;
  S = P.data = normalizeData(P.data);
  $('#home').hidden = true;
  $('#editor').hidden = false;
  window.scrollTo(0, 0);
  $('#elayout').classList.remove('show-view');
  $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === 'form'));
  $('#saveState').textContent = 'Захира шуд';
  refreshAll();
  renderPreview();
  requestAnimationFrame(fit);
  document.title = (S.name || 'Лоиҳа') + ' · Sarmoya Create';
}
$('#btnBack').addEventListener('click', async () => {
  clearTimeout(saveT);
  await saveProject();
  P = null; S = null;
  location.hash = '#/';
});

/* =====================================================
   5 · ПЕШНАМОИШ: iPhone 16 Pro Max / Компютер
   ===================================================== */
function renderPreview() {
  if (!S) return;
  const f = $('#preview');
  let y = 0;
  try { y = f.contentWindow.scrollY || 0; } catch (e) { /* аввалин бор */ }
  f.onload = () => { try { f.contentWindow.scrollTo({ top: y, behavior: 'instant' }); } catch (e) { /* бе скролл */ } };
  f.srcdoc = buildSite(S);

  // Ранги сатри ҳолат ба ранги header-и сайт мувофиқ мешавад
  const th = THEMES[S.theme] || THEMES.gold;
  const sc = $('#screen');
  sc.style.setProperty('--sbg', th.bg);
  sc.style.setProperty('--sfg', isLight(th.bg) ? '#000' : '#fff');
  $('#chromeUrl').textContent = ((P && P.siteName) || slugify(S.name)) + '.netlify.app';
}

// Андозаи телефон/браузерро ба ҷойи мавҷуда мутобиқ мекунад
function fit() {
  const stage = $('#stage'), dev = $('#device'), wrap = $('#deviceWrap');
  if (!stage || !stage.clientWidth) return;
  const desk = dev.classList.contains('desk');
  const W = desk ? 1280 : 464, H = desk ? 840 : 980;
  const cs = getComputedStyle(stage);
  const aw = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const ah = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const s = Math.max(0.2, Math.min(aw / W, ah / H, 1));
  dev.style.transform = 'scale(' + s + ')';
  wrap.style.width = (W * s) + 'px';
  wrap.style.height = (H * s) + 'px';
}
addEventListener('resize', () => { fit(); fitThumbs(); });
if ('ResizeObserver' in window) new ResizeObserver(fit).observe($('#stage'));

$$('#seg button').forEach(b => b.addEventListener('click', () => {
  $$('#seg button').forEach(x => x.classList.toggle('on', x === b));
  $('#device').classList.toggle('desk', b.dataset.dev === 'desk');
  fit();
}));
$$('#tabs button').forEach(b => b.addEventListener('click', () => {
  $$('#tabs button').forEach(x => x.classList.toggle('on', x === b));
  $('#elayout').classList.toggle('show-view', b.dataset.tab === 'view');
  if (b.dataset.tab === 'view') { renderPreview(); requestAnimationFrame(fit); }
}));

/* =====================================================
   6 · ДЕПЛОЙ (ба Netlify бо як тугма)
   Барои чӣ: файли сайт ба функсияи /.netlify/functions/deploy фиристода мешавад,
   ва он онро ба Netlify мефиристад. Токен дар браузер нест.
   ===================================================== */
const CODE_KEY = 'sc_access_code';

function openModal(html) { $('#modalBox').innerHTML = html; $('#modal').hidden = false; }
function closeModal() { $('#modal').hidden = true; }
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal' && !$('#modal').dataset.busy) closeModal(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').dataset.busy) closeModal(); });

// Хатоҳои эҳтимолӣ пеш аз деплой
function check() {
  const w = [];
  if (!S.name || S.name === 'Номи бизнес') w.push('Номи бизнес навишта нашудааст.');
  if (!phoneE164(S.phone)) w.push('Рақами телефон нест: тугмаи занг пайдо намешавад.');
  if (!S.address) w.push('Суроға навишта нашудааст.');
  if (S.show.reviews && S.reviews.some(r => r.text)) w.push('Шарҳҳо бояд воқеӣ ва бо розигии мизоҷ бошанд.');
  return w;
}

// Шакли аввал: номи сайт ва рамзи дастрасӣ
function showDeployForm(msg) {
  $('#modal').dataset.busy = '';
  delete $('#modal').dataset.busy;
  const first = !P.siteId;
  const code = localStorage.getItem(CODE_KEY) || '';
  const sug = P.siteName || slugify(S.name);
  openModal(
    '<h3>' + (first ? 'Нашр дар интернет' : 'Навсозии сайт') + '</h3>' +
    '<p>' + (first ? 'Номи сайтро интихоб кунед. Линки сайти шумо ҳамин тавр мешавад:' : 'Тағйиротро ба сайти мавҷуда мефиристем:') + '</p>' +
    '<div class="name-row' + (first ? '' : ' ro') + '"><input id="dName" value="' + esc(sug) + '" maxlength="40" placeholder="nomi-sayt"' + (first ? '' : ' readonly') + '><span>.netlify.app</span></div>' +
    (code ? '' : '<label class="f" style="margin-top:14px"><span>Рамзи дастрасӣ</span><input type="password" id="dCode" placeholder="Рамзе, ки дар Netlify гузоштаед" autocomplete="off"></label>') +
    '<div class="err" id="dErr">' + esc(msg || '') + '</div>' +
    '<div class="mact"><button class="ghost" id="dCancel" type="button">Бекор</button><button class="go sm" id="dGo" type="button">🚀 ' + (first ? 'Деплой' : 'Навсозӣ') + '</button></div>' +
    '<button class="small-link" id="dDl" type="button">Файли index.html-ро зеркашӣ кардан</button>'
  );
  const nameEl = $('#dName');
  nameEl.addEventListener('input', () => { nameEl.value = nameEl.value.toLowerCase().replace(/[^a-z0-9-]/g, ''); });
  $('#dCancel').addEventListener('click', closeModal);
  $('#dDl').addEventListener('click', () => saveBlob(new Blob([buildSite(S)], { type: 'text/html' }), 'index.html'));
  $('#dGo').addEventListener('click', doDeploy);
  nameEl.addEventListener('keydown', e => { if (e.key === 'Enter') doDeploy(); });
  if (first) nameEl.focus();
}

const ERR = {
  bad_code: 'Рамзи дастрасӣ нодуруст аст.',
  not_configured: 'Сервер ҳанӯз танзим нашудааст: дар Netlify NETLIFY_AUTH_TOKEN ва ACCESS_CODE гузоред.',
  name_taken: 'Ин ном банд аст. Номи дигар интихоб кунед.',
  bad_name: 'Ном: аз 3 то 40 ҳарфи лотинӣ, рақам ва «-» (на аввал ва охир).',
  too_big: 'Сайт хеле калон аст. Аксҳоро кам ё хурдтар кунед.',
  site_not_found: 'Сайти пештара дар Netlify ёфт нашуд (шояд нест шудааст).',
  deploy_failed: 'Netlify деплойро қабул накард. Дубора кӯшиш кунед.'
};

async function doDeploy() {
  const first = !P.siteId;
  const name = first ? $('#dName').value.trim() : P.siteName;
  const codeEl = $('#dCode');
  const code = codeEl ? codeEl.value.trim() : (localStorage.getItem(CODE_KEY) || '');
  if (first && !NAME_RE.test(name)) return showDeployForm(ERR.bad_name);
  if (!code) return showDeployForm('Рамзи дастрасӣ лозим аст.');

  const w = check();
  if (w.length && !confirm('Пеш аз деплой диққат кунед:\n\n• ' + w.join('\n• ') + '\n\nБа ҳар ҳол деплой кунем?')) return;

  // Интизорӣ
  $('#modal').dataset.busy = '1';
  $('#modalBox').innerHTML = '<div class="center"><h3>Сайтро мефиристем...</h3><div class="spin"></div><p>Ин якчанд сония мегирад.</p></div>';
  await saveProject();

  let res, data;
  try {
    res = await fetch('/.netlify/functions/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-access-code': code },
      body: JSON.stringify({ name, siteId: P.siteId || undefined, html: buildSite(S) })
    });
    data = await res.json().catch(() => ({}));
  } catch (e) {
    return showDeployForm('Пайвастшавӣ нашуд. Интернетро санҷед.');
  }

  if (res.status === 404 && !data.error) return showDeployForm('Деплой танҳо дар Sarmoya Create-и дар Netlify нашршуда кор мекунад (на дар Live Server).');
  if (!res.ok || !data.ok) {
    if (data.error === 'bad_code') localStorage.removeItem(CODE_KEY);
    return showDeployForm(ERR[data.error] || ('Хато: ' + (data.error || res.status)));
  }

  // Муваффақият: рамзро нигоҳ медорем ва маълумоти сайтро захира мекунем
  localStorage.setItem(CODE_KEY, code);
  P.siteId = data.siteId; P.siteName = data.name; P.url = data.url; P.deployedAt = Date.now();
  await saveProject();
  renderPreview();
  showDeployDone(data.url);
}

function showDeployDone(url) {
  delete $('#modal').dataset.busy;
  openModal(
    '<div class="center"><div class="okmark">✓</div><h3>Сайти шумо дар интернет аст!</h3><p>Линки сайт:</p>' +
    '<div class="linkbox">' + esc(url) + '</div></div>' +
    '<div class="mact" style="justify-content:center"><button class="ghost" id="dCopy" type="button">Нусха кардан</button>' +
    '<a class="go sm" id="dOpen" href="' + esc(url) + '" target="_blank" rel="noopener" style="text-decoration:none;display:inline-block">Кушодани сайт ↗</a></div>' +
    '<button class="small-link" id="dClose" type="button">Пӯшидан</button>'
  );
  $('#dCopy').addEventListener('click', () => { if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast('Линк нусха шуд.')); });
  $('#dClose').addEventListener('click', closeModal);
  // Кӯшиш мекунем, ки сайт худкор кушода шавад (браузер метавонад манъ кунад: тугмаи боло дар ин ҳолат кор мекунад)
  try { window.open(url, '_blank', 'noopener'); } catch (e) { /* тугма мемонад */ }
}

$('#btnDeploy').addEventListener('click', () => showDeployForm());

/* =====================================================
   ОҒОЗ: роутер аз рӯи #/ ва #/p/ID
   ===================================================== */
function route() {
  const m = location.hash.match(/^#\/p\/(.+)$/);
  if (m) openEditor(m[1]); else showHome();
}
addEventListener('hashchange', route);
route();
