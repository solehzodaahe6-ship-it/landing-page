// ===== ТАНЗИМОТИ МАҒОЗА (ҲАМАРО ИНҶО ИВАЗ КУНЕД) =====
// Барои чӣ: телефон, Instagram ва ғайра дар як ҷо. Холӣ гузоред = тугма пинҳон мешавад.
const SHOP = {
  phone: '+992000000000',          // рақами телефон (бо +992, бе фосила)
  phoneText: '+992 000 000 000',   // чӣ тавр дар сайт навишта мешавад
  whatsapp: '',                    // масалан: '992000000000' (бе +)
  telegram: '',                    // username-и Telegram (бе @)
  instagram: '',                   // username-и Instagram (бе @)
  address: 'Душанбе (суроғаи аниқро ҳангоми занг мефаҳмонем)'
};

// ===== ПУР КАРДАНИ ЛИНКҲО АЗ SHOP =====
// Барои чӣ: ҳар унсури data-link ба линки дуруст пайваст мешавад, ё пинҳон мешавад
document.querySelectorAll('[data-link]').forEach(function (el) {
  const t = el.dataset.link;
  let href = '';
  if (t === 'tel' && SHOP.phone) href = 'tel:' + SHOP.phone;
  if (t === 'wa' && SHOP.whatsapp) href = 'https://wa.me/' + SHOP.whatsapp;
  if (t === 'tg' && SHOP.telegram) href = 'https://t.me/' + SHOP.telegram;
  if (t === 'ig' && SHOP.instagram) href = 'https://instagram.com/' + SHOP.instagram;
  if (href) el.href = href; else el.style.display = 'none';
});
document.querySelectorAll('[data-text]').forEach(function (el) {
  el.textContent = SHOP[el.dataset.text] || '';
});

// ===== ЭКРАНИ ОҒОЗ =====
const preloader = document.getElementById('preloader');
window.addEventListener('load', function () {
  setTimeout(function () { preloader.classList.add('hide'); }, 500);
});

// ===== МЕНЮИ ТЕЛЕФОН =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', function () { nav.classList.toggle('open'); });
nav.querySelectorAll('a').forEach(function (a) {
  a.addEventListener('click', function () { nav.classList.remove('open'); });
});

// ===== ПАЙДОШАВИИ НАРМ ҲАНГОМИ СКРОЛЛ =====
document.querySelectorAll('.reveal').forEach(function (el, i) {
  el.style.transitionDelay = (i % 3) * 0.12 + 's';
});
const observer = new IntersectionObserver(function (items) {
  items.forEach(function (item) {
    if (item.isIntersecting) {
      item.target.classList.add('show');
      observer.unobserve(item.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });

// ===== HEADER ВА ХАТТИ ПЕШРАФТ ҲАНГОМИ СКРОЛЛ =====
const headerEl = document.querySelector('.header');
const progress = document.getElementById('progress');
window.addEventListener('scroll', function () {
  headerEl.classList.toggle('scrolled', window.scrollY > 20);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (window.scrollY / max * 100) + '%';
});

// ===== РАНГҲОЕ, КИ АЗ БОЛО МЕАФТАНД (sprinkles) =====
const sp = document.getElementById('sprinkles');
const spColors = ['#d4879a', '#c9a45c', '#f8dfe3', '#8fc7e8', '#ffffff'];
for (let i = 0; i < 22; i++) {
  const s = document.createElement('span');
  s.style.left = Math.random() * 100 + '%';
  s.style.background = spColors[i % spColors.length];
  s.style.animationDuration = (8 + Math.random() * 8) + 's';
  s.style.animationDelay = (-Math.random() * 14) + 's';
  sp.appendChild(s);
}

// ===== КАШИДАНИ ТОРТ (SVG) =====
// Барои чӣ: торт аз рӯи интихобҳо (қабат, бисквит, крем, ороиш, матн) кашида мешавад.
// Ин функсия ҳам дар hero, ҳам дар кортҳо, ҳам дар созанда истифода мешавад.
function esc(t) {
  return String(t).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function flower(cx, cy, r, color) {
  let p = '';
  for (let k = 0; k < 5; k++) {
    const a = k * 2 * Math.PI / 5;
    p += '<circle cx="' + (cx + Math.cos(a) * r * 0.85) + '" cy="' + (cy + Math.sin(a) * r * 0.85) + '" r="' + (r * 0.62) + '" fill="' + color + '"/>';
  }
  return p + '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.42) + '" fill="#c9a45c"/>';
}

function renderCake(s) {
  const tiers = Math.min(3, Math.max(1, +s.tiers || 2));
  const widths = [[240], [280, 190], [300, 222, 150]][tiers - 1];
  const H = [0, 130, 105, 84][tiers];             // баландии як қабат
  const cream = s.cream || '#f8dfe3';
  const sponge = s.sponge || '#5a3326';
  const deco = s.deco || 'berries';
  const bottom = 392;
  const tw = widths[tiers - 1];                    // бари қабати боло
  const ttop = bottom - H * tiers;                 // баландии қабати боло

  // Табақ
  let out = '<defs><linearGradient id="shade" x1="0" x2="1">' +
    '<stop offset="0" stop-color="#000" stop-opacity=".10"/>' +
    '<stop offset=".35" stop-color="#fff" stop-opacity=".14"/>' +
    '<stop offset=".7" stop-color="#000" stop-opacity="0"/>' +
    '<stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient></defs>';
  out += '<ellipse cx="200" cy="404" rx="178" ry="16" fill="#000" opacity=".12"/>';
  out += '<ellipse cx="200" cy="397" rx="176" ry="15" fill="#fff" stroke="#c9a45c" stroke-width="1.5"/>';

  // Қабатҳо (аз поён ба боло)
  for (let i = 0; i < tiers; i++) {
    const w = widths[i], x = 200 - w / 2, top = bottom - H * (i + 1);
    out += '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + H + '" rx="12" fill="' + cream + '"/>';
    out += '<rect x="' + x + '" y="' + (top + H * 0.36) + '" width="' + w + '" height="' + (H * 0.1) + '" fill="' + sponge + '" opacity=".92"/>';
    out += '<rect x="' + x + '" y="' + (top + H * 0.68) + '" width="' + w + '" height="' + (H * 0.1) + '" fill="' + sponge + '" opacity=".92"/>';
    out += '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + H + '" rx="12" fill="url(#shade)"/>';
    out += '<ellipse cx="200" cy="' + top + '" rx="' + (w / 2) + '" ry="9" fill="' + cream + '"/>';
    out += '<ellipse cx="200" cy="' + top + '" rx="' + (w / 2) + '" ry="9" fill="#fff" opacity=".4"/>';
  }

  // Ороиш болои қабати боло
  const span = Math.min(tw * 0.32, 70);
  if (deco === 'berries') {
    [-1, -0.5, 0, 0.5, 1].forEach(function (k, n) {
      const cx = 200 + k * span, cy = ttop - 5 - (n % 2) * 4;
      out += '<circle cx="' + cx + '" cy="' + cy + '" r="11" fill="#d8334a"/>';
      out += '<circle cx="' + (cx - 3) + '" cy="' + (cy - 3) + '" r="3" fill="#fff" opacity=".5"/>';
      out += '<path d="M' + (cx - 5) + ' ' + (cy - 10) + ' l5 -6 l5 6z" fill="#3f8f4e"/>';
    });
    [-0.75, -0.25, 0.25, 0.75].forEach(function (k) {
      out += '<circle cx="' + (200 + k * span) + '" cy="' + (ttop - 2) + '" r="6" fill="#3b4a8c"/>';
    });
  } else if (deco === 'choc') {
    const n = Math.max(4, Math.round(tw / 36)), seg = tw / n, x0 = 200 - tw / 2;
    out += '<rect x="' + x0 + '" y="' + (ttop - 4) + '" width="' + tw + '" height="14" rx="7" fill="#4a2a22"/>';
    for (let k = 0; k < n; k++) {
      const len = [14, 26, 18][k % 3];
      out += '<rect x="' + (x0 + seg * k + seg * 0.18) + '" y="' + (ttop + 4) + '" width="' + (seg * 0.64) + '" height="' + len + '" rx="' + (seg * 0.32) + '" fill="#4a2a22"/>';
    }
    out += '<rect x="' + (x0 + 12) + '" y="' + (ttop - 1) + '" width="' + (tw * 0.35) + '" height="3" rx="1.5" fill="#fff" opacity=".28"/>';
    [-0.6, 0, 0.6].forEach(function (k) {
      out += '<circle cx="' + (200 + k * span) + '" cy="' + (ttop - 10) + '" r="5" fill="#c9a45c"/>';
    });
  } else if (deco === 'flowers') {
    const cols = ['#e8a0b4', '#ffffff', '#f3c1cc', '#ffffff', '#e8a0b4'];
    [-1, -0.5, 0, 0.5, 1].forEach(function (k, n) {
      const cx = 200 + k * span, cy = ttop - 6 - (n % 2) * 5;
      out += '<ellipse cx="' + (cx - 14) + '" cy="' + (cy + 5) + '" rx="8" ry="4" fill="#4f9a5e" transform="rotate(-20 ' + (cx - 14) + ' ' + (cy + 5) + ')"/>';
      out += '<ellipse cx="' + (cx + 14) + '" cy="' + (cy + 5) + '" rx="8" ry="4" fill="#4f9a5e" transform="rotate(20 ' + (cx + 14) + ' ' + (cy + 5) + ')"/>';
      out += flower(cx, cy, 10, cols[n]);
    });
  } else if (deco === 'candles') {
    const cc = ['#f6c9d3', '#c9a45c', '#bfe0f1'];
    [-1, 0, 1].forEach(function (k, n) {
      const cx = 200 + k * 26;
      out += '<rect x="' + (cx - 3.5) + '" y="' + (ttop - 36) + '" width="7" height="36" rx="2" fill="' + cc[n] + '"/>';
      out += '<g class="flame"><ellipse cx="' + cx + '" cy="' + (ttop - 45) + '" rx="5" ry="8" fill="#ffb347"/><ellipse cx="' + cx + '" cy="' + (ttop - 43) + '" rx="2.4" ry="4.5" fill="#fff3b0"/></g>';
    });
  }

  // Навиштаҷот: дар лавҳаи сафед (то ҳамеша хонда шавад)
  if (s.text) {
    const len = s.text.length;
    const fs = Math.max(10, Math.min(22, (tw - 30) / (len * 0.5)));
    const pw = Math.min(tw - 16, len * fs * 0.5 + 24), ph = fs + 12;
    const py = ttop + H * 0.5;
    out += '<rect x="' + (200 - pw / 2) + '" y="' + (py - ph / 2) + '" width="' + pw + '" height="' + ph + '" rx="' + (ph / 2) + '" fill="#fff" opacity=".92" stroke="#c9a45c" stroke-width="1"/>';
    out += '<text x="200" y="' + (py + fs * 0.32) + '" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-style="italic" font-weight="700" font-size="' + fs + '" fill="#3a2220">' + esc(s.text) + '</text>';
  }

  // viewBox аз рӯи баландии торт: торт ҳамеша майдонро пур мекунад
  const minY = Math.max(0, ttop - 62);
  return '<svg viewBox="0 ' + minY + ' 400 ' + (432 - minY) + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Торт">' + out + '</svg>';
}

// ===== ТОРТ ДАР HERO =====
document.getElementById('heroCake').innerHTML = renderCake({
  tiers: 3, sponge: '#5a3326', cream: '#f8dfe3', deco: 'flowers', text: '555'
});

// ===== ТОРТҲО ДАР КОРТҲО (аз data-cake) =====
document.querySelectorAll('.card[data-cake]').forEach(function (card) {
  const s = JSON.parse(card.dataset.cake);
  card.querySelector('.cake-svg').innerHTML = renderCake(s);
  // Тугмаи «Фармоиш додан»: созандаро бо ҳамин торт пур мекунад
  card.querySelector('.link').addEventListener('click', function () { applyPreset(s); });
});

// ===== СОЗАНДА (BUILDER) =====
const form = document.getElementById('orderForm');
const stage = document.getElementById('cakePreview');
const sumEl = document.getElementById('sum');
const sumField = document.getElementById('summaryField');
const textInput = document.getElementById('cakeText');

function pick(name) { return form.querySelector('input[name="' + name + '"]:checked'); }

// Хондани интихобҳо ва кашидани торт
function updateBuilder() {
  const size = pick('size'), fl = pick('flavor'), cr = pick('cream'), dc = pick('deco');
  const s = {
    tiers: +size.dataset.tiers,
    sponge: fl.dataset.sponge,
    cream: cr.dataset.color,
    deco: dc.dataset.deco,
    text: textInput.value.trim()
  };
  stage.innerHTML = renderCake(s);

  // Тавсифи кӯтоҳи фармоиш (ва майдони пинҳонӣ барои Netlify)
  const sum = size.dataset.label + ' · ' + fl.dataset.label + ' · крем: ' + cr.dataset.label + ' · ороиш: ' + dc.dataset.label + (s.text ? ' · «' + s.text + '»' : '');
  sumEl.textContent = sum;
  sumField.value = sum;
}
form.addEventListener('input', updateBuilder);

// Пур кардани созанда аз корт
function applyPreset(p) {
  form.querySelectorAll('input[name="size"]').forEach(function (r) { r.checked = (+r.dataset.tiers === p.tiers); });
  form.querySelectorAll('input[name="flavor"]').forEach(function (r) { r.checked = (r.dataset.sponge === p.sponge); });
  form.querySelectorAll('input[name="cream"]').forEach(function (r) { r.checked = (r.dataset.color === p.cream); });
  form.querySelectorAll('input[name="deco"]').forEach(function (r) { r.checked = (r.dataset.deco === p.deco); });
  textInput.value = p.text || '';
  updateBuilder();
}
updateBuilder();

// ===== ФОРМА: ФИРИСТОДАН БА NETLIFY =====
// Барои чӣ: фармоиш ба Netlify меравад ва дар «Forms» намоён мешавад
const formOk = document.getElementById('formOk');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Фиристода истодааст...';

  const data = new URLSearchParams(new FormData(form)).toString();
  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data
  })
    .then(function () {
      form.classList.add('sent');
      formOk.hidden = false;
      form.reset();
    })
    .catch(function () {
      alert('Хато шуд. Лутфан занг занед: ' + SHOP.phoneText);
      btn.disabled = false;
      btn.textContent = 'Фиристодани фармоиш';
    });
});