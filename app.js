/* =====================================================
   app.js: ИДОРАКУНИИ САЙТСОЗ
   Форма -> маълумот (S) -> buildSite(S) -> пешнамоиш / зеркашӣ
   (buildSite дар generator.js аст)
   ===================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const KEY = 'sitesoz_v1';          // калиди захираи браузер

/* =====================================================
   ҲОЛАТ (S): ҳамаи маълумоти сайт дар як ҷо
   ===================================================== */
// Маълумотро бо шакли дуруст пур мекунад (агар файл кӯҳна ё нопурра бошад)
function normalize(d) {
  const b = defaultData(d && d.type);
  const o = Object.assign({}, b, d);
  o.show = Object.assign({}, b.show, (d && d.show) || {});
  o.images = Object.assign({ hero: '', about: '', gallery: [] }, (d && d.images) || {});
  if (!Array.isArray(o.images.gallery)) o.images.gallery = [];
  ['services', 'advantages', 'reviews', 'faq'].forEach(k => { if (!Array.isArray(o[k])) o[k] = b[k]; });
  return o;
}
function loadState() {
  try { const r = localStorage.getItem(KEY); if (r) return normalize(JSON.parse(r)); } catch (e) { /* ҳолати аввала */ }
  return defaultData('cakes');
}
let S = loadState();

/* ===== Хондан ва навиштани қимат бо роҳ: get('show.form') ===== */
function get(path) { return path.split('.').reduce((o, k) => o && o[k], S); }
function set(path, val) {
  const ks = path.split('.');
  let o = S;
  while (ks.length > 1) o = o[ks.shift()];
  o[ks[0]] = val;
}

/* ===== Паёми кӯтоҳ (toast) ===== */
let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('on'), 3600);
}

/* =====================================================
   ЗАХИРА ВА ПЕШНАМОИШ
   ===================================================== */
let saveT, viewT;
// Ҳар тағйирот: пешнамоиш пас аз 0.3с, захира пас аз 0.6с
function changed() {
  clearTimeout(viewT); viewT = setTimeout(renderPreview, 300);
  clearTimeout(saveT); saveT = setTimeout(saveState, 600);
}
function saveState() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch (e) {
    // Аксҳо хеле калонанд: бе акс захира мекунем
    try {
      const c = JSON.parse(JSON.stringify(S));
      c.images = { hero: '', about: '', gallery: [] };
      localStorage.setItem(KEY, JSON.stringify(c));
      toast('Аксҳо дар браузер захира нашуданд (ҳаҷм калон). Лоиҳаро бо «Захира (файл)» нигоҳ доред.');
    } catch (e2) { /* захира имконнопазир */ }
  }
}
// Пешнамоиш: ҷойгиршавии скроллро нигоҳ медорем, то ҳангоми навишт ба боло напарад
function renderPreview() {
  const f = $('#preview');
  let y = 0;
  try { y = f.contentWindow.scrollY || 0; } catch (e) { /* аввалин бор */ }
  f.onload = () => { try { f.contentWindow.scrollTo({ top: y, behavior: 'instant' }); } catch (e) { /* бе скролл */ } };
  f.srcdoc = buildSite(S);
}

/* =====================================================
   БАСТАНИ МАЙДОНҲО (data-k="name" ва data-k="show.form")
   ===================================================== */
function bindFields() {
  $$('[data-k]').forEach(el => {
    const v = get(el.dataset.k);
    if (el.type === 'checkbox') el.checked = !!v;
    else if (el.type === 'color') el.value = v || THEMES[S.theme].accent;   // ранги мавзӯъ, агар ранги худӣ набошад
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

/* =====================================================
   1 · НАМУДИ БИЗНЕС
   ===================================================== */
function renderTypes() {
  const box = $('#types');
  box.innerHTML = '';
  Object.keys(PRESETS).forEach(k => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = PRESETS[k].icon + '  ' + PRESETS[k].label;
    b.className = S.type === k ? 'on' : '';
    b.addEventListener('click', () => applyPreset(k));
    box.appendChild(b);
  });
}
// Матнҳои асосиро иваз мекунад, вале тамос, аксҳо ва намудро нигоҳ медорад
function applyPreset(type) {
  const base = defaultData(type);
  ['type', 'eyebrow', 'headline', 'sub', 'about', 'cta', 'services', 'advantages'].forEach(k => { S[k] = base[k]; });
  if (!S.name || S.name === 'Номи бизнес') S.name = base.name;
  refreshAll();
  toast('Матнҳои намунавӣ пур шуданд. Онҳоро ба бизнеси худ мувофиқ кунед.');
}

/* =====================================================
   4 · РӮЙХАТҲО (хизмат, афзалият, шарҳ, савол)
   ===================================================== */
const REPS = {
  services:   { max: 12, add: { title: '', price: '', desc: '' }, fields: [['title', 'Ном', 'text'], ['price', 'Нарх', 'text'], ['desc', 'Тавсифи кӯтоҳ', 'text']] },
  advantages: { max: 4,  add: { title: '', desc: '' },            fields: [['title', 'Сарлавҳа', 'text'], ['desc', 'Тавсиф', 'text']] },
  reviews:    { max: 6,  add: { name: '', text: '' },             fields: [['name', 'Номи мизоҷ', 'text'], ['text', 'Шарҳ', 'area']] },
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

/* =====================================================
   5 · АКСҲО (хурд карда мешаванд, то сайт сабук бошад)
   ===================================================== */
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
  pick.type = 'button'; pick.className = 'btn ghost'; pick.textContent = S.images[key] ? 'Иваз' : 'Интихоб';
  pick.addEventListener('click', () => file.click());
  el.append(th, b, pick, file);
  if (S.images[key]) {
    const rm = document.createElement('button');
    rm.type = 'button'; rm.className = 'btn ghost danger'; rm.textContent = 'Нест';
    rm.style.marginLeft = '6px';
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
  renderSlot('hero', 'Акси асосӣ (бо камон)');
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

/* =====================================================
   6 · МАВЗӮЪ ВА ШРИФТ
   ===================================================== */
function renderThemes() {
  const box = $('#themes');
  box.innerHTML = '';
  Object.keys(THEMES).forEach(k => {
    const t = THEMES[k];
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'theme' + (S.theme === k ? ' on' : '');
    b.innerHTML = '<div class="dots"><i style="background:' + t.bg + '"></i><i style="background:' + t.accent + '"></i><i style="background:' + t.ink + '"></i></div><b>' + t.label + '</b>';
    b.addEventListener('click', () => { S.theme = k; renderThemes(); bindFields(); changed(); });
    box.appendChild(b);
  });
  const fb = $('#fonts');
  fb.innerHTML = '';
  Object.keys(FONTS).forEach(k => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = FONTS[k].label;
    b.className = S.font === k ? 'on' : '';
    b.addEventListener('click', () => { S.font = k; renderThemes(); changed(); });
    fb.appendChild(b);
  });
}
$('#accentReset').addEventListener('click', () => { S.accent = ''; bindFields(); changed(); });

/* =====================================================
   ҲАМАРО НАВ КАРДАН
   ===================================================== */
function refreshAll() {
  bindFields();
  renderTypes();
  Object.keys(REPS).forEach(renderRep);
  renderImages();
  renderThemes();
  changed();
}

/* =====================================================
   САНҶИШ ВА ЗЕРКАШӢ
   ===================================================== */
// Хатоҳои эҳтимолӣ пеш аз зеркашӣ
function check() {
  const w = [];
  if (!S.name || S.name === 'Номи бизнес') w.push('Номи бизнес навишта нашудааст.');
  if (!phoneE164(S.phone)) w.push('Рақами телефон нест: тугмаи занг пайдо намешавад.');
  if (!S.address) w.push('Суроға навишта нашудааст.');
  if (!S.images.hero) w.push('Акси асосӣ нест (сайт бе акс ҳам кор мекунад).');
  if (S.show.reviews && S.reviews.some(r => r.text)) w.push('Шарҳҳо бояд воқеӣ ва бо розигии мизоҷ бошанд.');
  return w;
}
function saveBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
$('#btnDownload').addEventListener('click', () => {
  const w = check();
  if (w.length && !confirm('Пеш аз зеркашӣ диққат кунед:\n\n• ' + w.join('\n• ') + '\n\nБа ҳар ҳол зеркашӣ кунем?')) return;
  saveBlob(new Blob([buildSite(S)], { type: 'text/html' }), 'index.html');
  toast('Тайёр! Файли index.html зеркашӣ шуд. Ҳоло ба Netlify Drop баред.');
});
$('#btnFull').addEventListener('click', () => {
  window.open(URL.createObjectURL(new Blob([buildSite(S)], { type: 'text/html' })), '_blank');
});

/* ===== Лоиҳаро ҳамчун файл захира / боз кардан ===== */
$('#btnSave').addEventListener('click', () => {
  saveBlob(new Blob([JSON.stringify(S)], { type: 'application/json' }), 'loiha-' + new Date().toISOString().slice(0, 10) + '.json');
  toast('Лоиҳа захира шуд. Онро баъдтар бо «Боз кардан» кушоед.');
});
$('#btnLoad').addEventListener('click', () => $('#loadInput').click());
$('#loadInput').addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  const fr = new FileReader();
  fr.onload = () => {
    try { S = normalize(JSON.parse(fr.result)); refreshAll(); toast('Лоиҳа кушода шуд.'); }
    catch (err) { toast('Файл дуруст нест.'); }
  };
  fr.readAsText(f);
  e.target.value = '';
});
$('#btnReset').addEventListener('click', () => {
  if (!confirm('Ҳамаи маълумотро нест карда, аз нав оғоз кунем? (Пеш аз ин лоиҳаро захира кунед.)')) return;
  S = defaultData('cakes');
  refreshAll();
});

/* =====================================================
   НАМОИШ: телефон / компютер ва варақаҳо (дар телефон)
   ===================================================== */
$$('#seg button').forEach(b => b.addEventListener('click', () => {
  $$('#seg button').forEach(x => x.classList.toggle('on', x === b));
  $('#frame').classList.toggle('phone', b.dataset.dev === 'phone');
}));
$$('#tabs button').forEach(b => b.addEventListener('click', () => {
  $$('#tabs button').forEach(x => x.classList.toggle('on', x === b));
  $('.layout').classList.toggle('show-view', b.dataset.tab === 'view');
  if (b.dataset.tab === 'view') renderPreview();
}));

/* =====================================================
   ОҒОЗ
   ===================================================== */
refreshAll();
renderPreview();