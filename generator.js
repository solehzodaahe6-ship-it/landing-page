/* =====================================================
   generator.js: МОТОРИ САЙТСОЗ
   Ин файл аз маълумоти шумо (data) як сайти пурраи
   ягон-файла (index.html) месозад. Ҳам барои пешнамоиш,
   ҳам барои зеркашӣ ҳамин як функсия (buildSite) кор мекунад.
   ===================================================== */

/* ===== ШРИФТҲО =====
   Ҳамаи шрифтҳо ҳарфҳои тоҷикиро (ҳ, қ, ғ, ӣ, ӯ, ҷ) дастгирӣ мекунанд */
const FONTS = {
  elegant: { label: 'Олиҷаноб', head: "'Cormorant Garamond',Georgia,serif", body: "'Montserrat','Segoe UI',Arial,sans-serif", weight: 700,
             url: 'family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Montserrat:wght@400;500;600' },
  modern:  { label: 'Муосир', head: "'Montserrat','Segoe UI',Arial,sans-serif", body: "'Inter','Segoe UI',Arial,sans-serif", weight: 800,
             url: 'family=Montserrat:wght@600;800&family=Inter:wght@400;500;600' },
  soft:    { label: 'Нарм', head: "'Inter','Segoe UI',Arial,sans-serif", body: "'Inter','Segoe UI',Arial,sans-serif", weight: 700,
             url: 'family=Inter:wght@400;500;600;700' }
};

/* ===== МАВЗӮЪҲО (рангҳо) ===== */
const THEMES = {
  gold:  { label: 'Зарин',     bg: '#fbf8f2', ink: '#2a2118', muted: '#7a6c5c', accent: '#b8923f', soft: '#f3ecde', card: '#ffffff', line: '#e9dfcb', on: '#ffffff' },
  night: { label: 'Шаби тира', bg: '#0e0e12', ink: '#f4f1ea', muted: '#a39d90', accent: '#d4b06a', soft: '#17171d', card: '#1a1a21', line: '#2a2a33', on: '#15120c' },
  teal:  { label: 'Фирӯза',    bg: '#f4fbfa', ink: '#0d2b2e', muted: '#557174', accent: '#0e8c8c', soft: '#dff3f1', card: '#ffffff', line: '#cfe6e3', on: '#ffffff' },
  rose:  { label: 'Гулобӣ',    bg: '#fff8f8', ink: '#3a2025', muted: '#85666b', accent: '#d4687f', soft: '#fde8ec', card: '#ffffff', line: '#f3d6dc', on: '#ffffff' }
};

/* ===== ШАБЛОНҲОИ БИЗНЕС (матни намунавӣ: ҳатман иваз кунед!) ===== */
const ADV_DEFAULT = [
  { title: 'Сифат', desc: 'Ҳар кор бодиққат ва бо сифати баланд анҷом дода мешавад.' },
  { title: 'Нархи дастрас', desc: 'Нархи аниқро пешакӣ мегӯем, бе ҳисобҳои пинҳонӣ.' },
  { title: 'Вақти қулай', desc: 'Вақти мувофиқро худатон интихоб мекунед.' }
];
const FAQ_DEFAULT = [
  { q: 'Чӣ тавр фармоиш диҳам?', a: 'Занг занед, дар WhatsApp нависед ё дар форма рақамро гузоред. Мо зуд тамос мегирем.' },
  { q: 'Нарх чанд пул аст?', a: 'Нарх аз навъи хизмат вобаста аст. Барои нархи аниқ занг занед.' },
  { q: 'Вақти кор кай аст?', a: 'Вақти кор дар қисми «Тамос» навишта шудааст.' }
];
const PRESETS = {
  cakes: {
    label: 'Тортҳо', icon: '🎂', eyebrow: 'Тортҳои фармоишӣ',
    headline: 'Торте, ки лаҳзаро ид мекунад', sub: 'Тортҳои зебо ва болаззат барои зодрӯз, тӯй ва ҳар ид. Таъм ва ороишро худатон интихоб мекунед.',
    about: 'Мо тортҳоро тибқи хоҳиши шумо месозем: таъм, ранг, ороиш ва навиштаҷот. Фармоишро пешакӣ қабул мекунем.',
    cta: 'Фармоиш додан',
    services: [
      { title: 'Торти зодрӯз', desc: 'Бо ороиш ва навиштаҷоти дилхоҳ.', price: 'Нарх: бо занг' },
      { title: 'Торти тӯй', desc: 'Торти сатҳдор барои рӯзи махсус.', price: 'Нарх: бо занг' },
      { title: 'Торти кӯдакона', desc: 'Рангин ва шод барои хурдсолон.', price: 'Нарх: бо занг' },
      { title: 'Десертҳо', desc: 'Капкейк, чизкейк ва шириниҳои хурд.', price: 'Нарх: бо занг' }
    ],
    advantages: [
      { title: 'Инфиродӣ', desc: 'Ҳар торт тибқи хоҳиши шумо сохта мешавад.' },
      { title: 'Таъми дилхоҳ', desc: 'Бисквит ва кремро худатон интихоб мекунед.' },
      { title: 'Вақти муайян', desc: 'Санаи гирифтанро шумо нишон медиҳед.' }
    ]
  },
  clinic: {
    label: 'Клиника', icon: '🦷', eyebrow: 'Клиникаи стоматологӣ',
    headline: 'Табассуми комил аз ин ҷо оғоз мешавад', sub: 'Табобати бодиққат, нархи дастрас ва вақти дилхоҳ.',
    about: 'Мо дандонҳои шуморо бодиққат табобат мекунем ва ҳар марҳиларо пешакӣ мефаҳмонем.',
    cta: 'Навбат гирифтан',
    services: [
      { title: 'Ташхис ва машварат', desc: 'Дандонҳоро аз назар мегузаронем ва нақша медиҳем.', price: 'Нарх: бо занг' },
      { title: 'Табобати дандон', desc: 'Табобати кариес ва пулпит.', price: 'Нарх: бо занг' },
      { title: 'Сафед кардан', desc: 'Табассуми дурахшон.', price: 'Нарх: бо занг' },
      { title: 'Протез ва виниҳо', desc: 'Барқарор кардани дандонҳо.', price: 'Нарх: бо занг' }
    ]
  },
  beauty: {
    label: 'Салони зебоӣ', icon: '💅', eyebrow: 'Салони зебоӣ',
    headline: 'Зебоӣ дар тафсилот аст', sub: 'Мӯй, нохун ва макияж бо дастҳои моҳир ва муҳити ором.',
    about: 'Дар салони мо шумо истироҳат мекунед ва бо намуди нав мераванд.',
    cta: 'Навбат гирифтан',
    services: [
      { title: 'Мӯй', desc: 'Буридан, ранг кардан ва муҳофизат.', price: 'Нарх: бо занг' },
      { title: 'Нохунҳо', desc: 'Манкюр ва педикюр.', price: 'Нарх: бо занг' },
      { title: 'Пӯст ва чеҳра', desc: 'Тозакунӣ ва нигоҳубин.', price: 'Нарх: бо занг' },
      { title: 'Макияж', desc: 'Барои ҳар ид ва ҳар рӯз.', price: 'Нарх: бо занг' }
    ]
  },
  cafe: {
    label: 'Қаҳвахона', icon: '☕', eyebrow: 'Қаҳвахона',
    headline: 'Таъми хуб, лаҳзаҳои хуш', sub: 'Қаҳва, нонушта ва десертҳо дар муҳити гарм.',
    about: 'Мо кӯшиш мекунем, ки ҳар меҳмон худро дар хона ҳис кунад.',
    cta: 'Ҷой банд кардан',
    services: [
      { title: 'Нонушта', desc: 'Субҳона бо маводи тару тоза.', price: 'Нарх: бо занг' },
      { title: 'Нисфирӯзӣ', desc: 'Хӯрокҳои асосӣ ва салатҳо.', price: 'Нарх: бо занг' },
      { title: 'Нӯшокиҳо', desc: 'Қаҳва, чой ва нӯшокиҳои хунук.', price: 'Нарх: бо занг' },
      { title: 'Десертҳо', desc: 'Шириниҳои тару тоза.', price: 'Нарх: бо занг' }
    ]
  },
  repair: {
    label: 'Таъмир ва хизмат', icon: '🛠', eyebrow: 'Хизматҳои таъмир',
    headline: 'Мушкилии шумо, кори мо', sub: 'Зуд меоем, бодиққат кор мекунем ва ба кор кафолат медиҳем.',
    about: 'Мо мушкилиро ташхис мекунем, нархро пешакӣ мегӯем ва кор анҷом медиҳем.',
    cta: 'Даъват кардан',
    services: [
      { title: 'Таъмир ва насб', desc: 'Кори хурд ва калон дар хона.', price: 'Нарх: бо занг' },
      { title: 'Ташхис', desc: 'Сабаби мушкилиро муайян мекунем.', price: 'Нарх: бо занг' },
      { title: 'Омадан ба хона', desc: 'Ба суроғаи шумо меоем.', price: 'Нарх: бо занг' },
      { title: 'Кафолат', desc: 'Ба кор кафолат медиҳем.', price: 'Нарх: бо занг' }
    ]
  },
  education: {
    label: 'Курс / омӯзгор', icon: '📚', eyebrow: 'Омӯзиш',
    headline: 'Донишро бо боварӣ омӯзед', sub: 'Дарсҳои инфиродӣ ва гурӯҳӣ бо нақшаи равшан ва натиҷаи намоён.',
    about: 'Мо ба ҳар хонанда мувофиқи сатҳи ӯ дарс медиҳем ва пешрафтро якҷоя пайгирӣ мекунем.',
    cta: 'Ба дарс навис шудан',
    services: [
      { title: 'Дарси инфиродӣ', desc: 'Танҳо бо шумо, бо суръати худатон.', price: 'Нарх: бо занг' },
      { title: 'Дарси гурӯҳӣ', desc: 'Бо дигарон омӯхтан ва рақобат.', price: 'Нарх: бо занг' },
      { title: 'Тайёрӣ ба имтиҳон', desc: 'Нақша ва машқҳо барои имтиҳон.', price: 'Нарх: бо занг' },
      { title: 'Дарси онлайн', desc: 'Аз ҳар ҷо ва ҳар вақт.', price: 'Нарх: бо занг' }
    ]
  }
};

/* ===== МАЪЛУМОТИ АВВАЛА (аз шаблон) ===== */
function defaultData(type) {
  const p = PRESETS[type] || PRESETS.cakes;
  return {
    type: type in PRESETS ? type : 'cakes',
    name: 'Номи бизнес', eyebrow: p.eyebrow, headline: p.headline, sub: p.sub, about: p.about, cta: p.cta,
    phone: '', whatsapp: '', telegram: '', instagram: '', address: '', hours: '', maps: '',
    services: p.services.map(s => Object.assign({}, s)),
    advantages: (p.advantages || ADV_DEFAULT).map(s => Object.assign({}, s)),
    reviews: [],
    faq: FAQ_DEFAULT.map(s => Object.assign({}, s)),
    images: { hero: '', about: '', gallery: [] },
    theme: 'gold', accent: '', font: 'elegant',
    show: { advantages: true, gallery: true, reviews: true, faq: true, form: true, float: true }
  };
}

/* =====================================================
   КУМАКӢ
   ===================================================== */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function digits(s) { return String(s || '').replace(/\D/g, ''); }

// Рақами телефонро ба шакли +992XXXXXXXXX меорад
function phoneE164(s) {
  const d = digits(s);
  if (!d) return '';
  if (d.startsWith('992') && d.length >= 12) return '+' + d;
  if (d.length === 9) return '+992' + d;
  return '+' + d;
}
// Барои намоиш: +992 000 018 802
function phonePretty(s) {
  const p = phoneE164(s);
  if (p.startsWith('+992') && p.length === 13) { const l = p.slice(4); return '+992 ' + l.slice(0, 3) + ' ' + l.slice(3, 6) + ' ' + l.slice(6); }
  return p;
}
// username аз линк ё @ тоза мекунад
function handle(s) {
  return String(s || '').trim().replace(/^https?:\/\/(www\.)?(t\.me|instagram\.com)\//i, '').replace(/^@/, '').replace(/[/?].*$/, '');
}
function isLight(hex) {
  const n = parseInt(hex.slice(1), 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) > 160;
}
function safeUrl(u) { return /^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim() : ''; }
function jsonForScript(x) { return JSON.stringify(x).replace(/</g, '\\u003c'); }

/* =====================================================
   buildSite(d): САЙТРО МЕСОЗАД
   Натиҷа: сатри пурраи HTML (CSS ва JS дар дохили он)
   ===================================================== */
function buildSite(d) {
  const th = Object.assign({}, THEMES[d.theme] || THEMES.gold);
  if (/^#[0-9a-f]{6}$/i.test(d.accent || '')) { th.accent = d.accent; th.on = isLight(d.accent) ? '#15120c' : '#ffffff'; }
  const fo = FONTS[d.font] || FONTS.elegant;
  const pre = PRESETS[d.type] || PRESETS.cakes;
  const name = d.name || 'Номи бизнес';

  const tel = phoneE164(d.phone), telTxt = phonePretty(d.phone);
  const wa = digits(phoneE164(d.whatsapp));
  const tg = handle(d.telegram), ig = handle(d.instagram), maps = safeUrl(d.maps);
  const services = (d.services || []).filter(s => s.title);
  const advs = (d.advantages || []).filter(a => a.title);
  const reviews = (d.reviews || []).filter(r => r.text);
  const faq = (d.faq || []).filter(f => f.q && f.a);
  const gallery = ((d.images && d.images.gallery) || []).filter(Boolean);
  const heroImg = d.images && d.images.hero, aboutImg = d.images && d.images.about;
  const sh = d.show || {};

  const hasAdv = sh.advantages && advs.length, hasGal = sh.gallery && gallery.length;
  const hasRev = sh.reviews && reviews.length, hasFaq = sh.faq && faq.length;

  const nav = [
    services.length && ['xizmat', 'Хизматҳо'], d.about && ['about', 'Дар бораи мо'],
    hasGal && ['gallery', 'Галерея'], hasRev && ['reviews', 'Шарҳҳо'], hasFaq && ['faq', 'Саволҳо'], ['contact', 'Тамос']
  ].filter(Boolean);

  const desc = (d.sub || d.about || name).slice(0, 155);
  const mainBtn = '<a class="btn btn-p" href="#contact">' + esc(d.cta || 'Тамос') + '</a>';
  const callBtn = tel ? '<a class="btn btn-o" href="tel:' + tel + '">Занг задан</a>' : '<a class="btn btn-o" href="#xizmat">Хизматҳо</a>';

  /* ---------- CSS ---------- */
  const css = `
:root{--bg:${th.bg};--ink:${th.ink};--muted:${th.muted};--accent:${th.accent};--soft:${th.soft};--card:${th.card};--line:${th.line};--on:${th.on};--hf:${fo.head};--bf:${fo.body}}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--bf);background:var(--bg);color:var(--ink);line-height:1.7;overflow-x:hidden}
h1,h2,h3{font-family:var(--hf);line-height:1.12;font-weight:${fo.weight}}
a{color:inherit;text-decoration:none}
::selection{background:var(--accent);color:var(--on)}
.c{width:min(1100px,90%);margin:0 auto}
.btn{display:inline-block;padding:14px 30px;border-radius:50px;font-weight:600;font-size:.92rem;border:2px solid transparent;cursor:pointer;font-family:inherit;transition:transform .3s,box-shadow .3s,background .3s}
.btn:hover{transform:translateY(-3px)}
.btn-p{background:var(--accent);color:var(--on);box-shadow:0 10px 26px color-mix(in srgb,var(--accent) 38%,transparent)}
.btn-o{border-color:var(--ink);color:var(--ink)}
.btn:disabled{opacity:.6}
header{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.hd{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 0}
.logo{font-family:var(--hf);font-weight:${fo.weight};font-size:1.6rem;color:var(--ink)}
.nv a{margin:0 13px;font-size:.88rem;font-weight:500;position:relative}
.nv a::after{content:'';position:absolute;left:0;bottom:-4px;width:0;height:2px;background:var(--accent);transition:width .3s}
.nv a:hover::after{width:100%}
.hb{padding:10px 22px;font-size:.84rem}
#bg{display:none;background:none;border:0;font-size:1.7rem;color:var(--ink);cursor:pointer}
.hero{position:relative;padding:70px 0 80px;overflow:hidden}
.hero::before{content:'';position:absolute;width:520px;height:520px;right:-140px;top:-160px;border-radius:50%;background:color-mix(in srgb,var(--accent) 22%,transparent);filter:blur(80px)}
.hero-in{position:relative;display:grid;grid-template-columns:1.1fr .9fr;gap:50px;align-items:center}
.hero.center .hero-in{grid-template-columns:1fr;text-align:center;justify-items:center}
.eb{display:inline-block;font-size:.74rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin-bottom:18px}
.hero h1{font-size:clamp(2.4rem,6vw,4.4rem);margin-bottom:20px}
.hero p.sub{color:var(--muted);font-size:1.05rem;max-width:520px;margin-bottom:30px}
.acts{display:flex;gap:12px;flex-wrap:wrap}
.hero.center .acts{justify-content:center}
.ha{position:relative;isolation:isolate}
.ha::before{content:'';position:absolute;inset:22px -22px -22px 22px;z-index:-1;border:1.5px solid var(--accent);border-radius:260px 260px 26px 26px}
.arch{height:500px;border-radius:260px 260px 26px 26px;background:var(--soft) center/cover no-repeat;box-shadow:0 36px 70px color-mix(in srgb,var(--ink) 18%,transparent)}
.sec{padding:90px 0}
.sec.alt{background:var(--soft)}
.sh{text-align:center;margin-bottom:46px}
.sh span{display:block;font-size:.74rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);margin-bottom:10px}
.sh h2{font-size:clamp(1.9rem,4.4vw,3rem)}
.adv{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px}
.ai{padding:28px;border-radius:20px;background:var(--card);border:1px solid var(--line)}
.ai b{font-family:var(--hf);font-size:2.2rem;color:var(--accent);line-height:1}
.ai h3{font-size:1.4rem;margin:8px 0 4px}
.ai p{color:var(--muted);font-size:.9rem}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:22px}
.card{padding:30px;border-radius:22px;background:var(--card);border:1px solid var(--line);display:flex;flex-direction:column;gap:8px;transition:transform .4s,box-shadow .4s,border-color .4s}
.card:hover{transform:translateY(-8px);box-shadow:0 26px 50px color-mix(in srgb,var(--ink) 14%,transparent);border-color:var(--accent)}
.card h3{font-size:1.55rem}
.card p{color:var(--muted);font-size:.92rem;flex:1}
.pr{align-self:flex-start;margin-top:6px;padding:6px 14px;border-radius:30px;background:var(--soft);color:var(--accent);font-weight:600;font-size:.82rem}
.ab{display:grid;grid-template-columns:.85fr 1.15fr;gap:60px;align-items:center}
.ab.one{grid-template-columns:1fr;max-width:760px;margin:0 auto;text-align:center}
.ab .arch{height:420px}
.ab h2{font-size:clamp(1.9rem,4.4vw,3rem);margin-bottom:14px}
.ab p{color:var(--muted)}
.gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
.gal img{width:100%;height:240px;object-fit:cover;border-radius:18px;cursor:zoom-in;transition:transform .5s}
.gal img:hover{transform:scale(1.03)}
.lb{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.88);display:none;align-items:center;justify-content:center;padding:20px;cursor:zoom-out}
.lb.on{display:flex}
.lb img{max-width:100%;max-height:100%;border-radius:12px}
.rv-c{padding:30px;border-radius:22px;background:var(--card);border:1px solid var(--line)}
.st{color:var(--accent);letter-spacing:4px;margin-bottom:10px}
.rv-c p{font-style:italic;color:var(--muted);margin-bottom:12px}
.fq{max-width:800px;margin:0 auto}
details{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px 24px;margin-bottom:12px}
details[open]{border-color:var(--accent)}
summary{cursor:pointer;font-weight:600;list-style:none;position:relative;padding-right:30px}
summary::-webkit-details-marker{display:none}
summary::after{content:'+';position:absolute;right:0;top:-3px;font-size:1.6rem;color:var(--accent)}
details[open] summary::after{content:'−'}
details p{margin-top:12px;color:var(--muted)}
.ct{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:start}
.ct.one{grid-template-columns:1fr;max-width:640px;margin:0 auto}
.ct h2{font-size:clamp(1.9rem,4.4vw,3rem);margin-bottom:12px}
.ct>div>p{color:var(--muted);margin-bottom:22px}
.ci{list-style:none}
.ci li{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--line);font-size:.95rem}
.ci b{min-width:92px;color:var(--accent);font-weight:600}
.ci a{font-weight:600}
form{background:var(--card);border:1px solid var(--line);padding:30px;border-radius:24px;display:flex;flex-direction:column;gap:14px}
form input,form textarea{width:100%;padding:15px 16px;border:1.5px solid var(--line);border-radius:14px;font-size:1rem;font-family:inherit;background:var(--bg);color:var(--ink)}
form input:focus,form textarea:focus{outline:none;border-color:var(--accent)}
.hp{position:absolute;left:-9999px}
.ok{text-align:center;padding:30px 10px}
.ok i{display:grid;place-items:center;width:64px;height:64px;margin:0 auto 14px;border-radius:50%;background:var(--accent);color:var(--on);font-style:normal;font-size:1.8rem}
footer{padding:26px 0;text-align:center;border-top:1px solid var(--line);color:var(--muted);font-size:.85rem}
.fl{position:fixed;right:18px;bottom:20px;z-index:60;display:flex;flex-direction:column;gap:10px}
.fl a{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;box-shadow:0 8px 22px rgba(0,0,0,.25);transition:transform .3s}
.fl a:hover{transform:scale(1.1)}
.fl svg{width:24px;height:24px;fill:none;stroke:#fff;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.fl .w{background:#25d366}.fl .t{background:#29a9eb}.fl .p{background:var(--accent)}
.fl .p svg{stroke:var(--on)}
.rv{opacity:0;transform:translateY(34px);transition:opacity .8s ease,transform .8s ease;animation:rvf .8s ease 1.8s forwards}
.rv.in{opacity:1;transform:none}
@keyframes rvf{to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
@media(max-width:860px){
 .nv{display:none;position:absolute;top:100%;left:0;right:0;flex-direction:column;background:var(--bg);padding:14px 6%;border-bottom:1px solid var(--line)}
 .nv.open{display:flex}.nv a{margin:9px 0}
 #bg{display:block}.hb{display:none}
 .hero{padding:30px 0 50px}
 .hero-in{grid-template-columns:1.2fr .8fr;gap:12px}
 .hero.center .hero-in{grid-template-columns:1fr}
 .eb{font-size:.58rem;margin-bottom:10px}
 .hero h1{font-size:clamp(1.55rem,7vw,2.3rem);margin-bottom:12px}
 .hero p.sub{font-size:.8rem;line-height:1.55;margin-bottom:16px}
 .acts{flex-direction:column;gap:8px}.hero.center .acts{flex-direction:row}
 .acts .btn{padding:11px 12px;font-size:.78rem;text-align:center}
 .arch{height:260px;border-radius:120px 120px 16px 16px}
 .ha::before{inset:10px -8px -10px 8px;border-radius:120px 120px 16px 16px}
 .sec{padding:56px 0}.sh{margin-bottom:28px}
 .adv,.grid{grid-template-columns:1fr 1fr;gap:12px}
 .ai,.card{padding:18px 16px;border-radius:16px}
 .ai b{font-size:1.6rem}.ai h3,.card h3{font-size:1.15rem}.ai p,.card p{font-size:.76rem;line-height:1.5}
 .pr{font-size:.72rem;padding:4px 10px}
 .ab{grid-template-columns:.8fr 1.2fr;gap:14px;align-items:start}
 .ab.one{grid-template-columns:1fr}
 .ab .arch{height:250px}
 .ab h2{font-size:1.5rem}.ab p{font-size:.82rem}
 .gal{grid-template-columns:1fr 1fr;gap:8px}.gal img{height:150px;border-radius:12px}
 .ct{grid-template-columns:1fr;gap:26px}
 form{padding:20px;border-radius:18px}
 .fl{right:auto;left:12px;bottom:14px}.fl .w,.fl .t{display:none}.fl a{width:46px;height:46px}
}`;

  /* ---------- ҚИСМҲОИ HTML ---------- */
  const head = `<header><div class="c hd"><a href="#top" class="logo">${esc(name)}</a>
<nav class="nv" id="nv">${nav.map(n => '<a href="#' + n[0] + '">' + n[1] + '</a>').join('')}</nav>
${tel ? '<a class="btn btn-p hb" href="tel:' + tel + '">Занг задан</a>' : '<a class="btn btn-p hb" href="#contact">Тамос</a>'}
<button id="bg" aria-label="Меню">☰</button></div></header>`;

  const hero = `<section class="hero${heroImg ? '' : ' center'}" id="top"><div class="c hero-in">
<div><span class="eb">${esc(d.eyebrow || pre.eyebrow)}</span><h1>${esc(d.headline || name)}</h1><p class="sub">${esc(d.sub)}</p><div class="acts">${mainBtn}${callBtn}</div></div>
${heroImg ? '<div class="ha"><div class="arch" style="background-image:url(\'' + heroImg + '\')"></div></div>' : ''}
</div></section>`;

  const advHtml = hasAdv ? `<section class="sec alt"><div class="c"><div class="adv">${advs.map((a, i) =>
    '<div class="ai rv"><b>0' + (i + 1) + '</b><h3>' + esc(a.title) + '</h3><p>' + esc(a.desc) + '</p></div>').join('')}</div></div></section>` : '';

  const servHtml = services.length ? `<section class="sec" id="xizmat"><div class="c"><div class="sh rv"><span>Хизматҳо</span><h2>Мо чӣ мекунем</h2></div>
<div class="grid">${services.map(s => '<div class="card rv"><h3>' + esc(s.title) + '</h3><p>' + esc(s.desc) + '</p>' + (s.price ? '<span class="pr">' + esc(s.price) + '</span>' : '') + '</div>').join('')}</div></div></section>` : '';

  const aboutHtml = d.about ? `<section class="sec alt" id="about"><div class="c ab${aboutImg ? '' : ' one'} rv">
${aboutImg ? '<div class="arch" style="background-image:url(\'' + aboutImg + '\')"></div>' : ''}
<div><div class="sh" style="text-align:inherit;margin-bottom:14px"><span>Дар бораи мо</span></div><h2>${esc(name)}</h2><p>${esc(d.about)}</p></div></div></section>` : '';

  const galHtml = hasGal ? `<section class="sec" id="gallery"><div class="c"><div class="sh rv"><span>Галерея</span><h2>Корҳои мо</h2></div>
<div class="gal rv">${gallery.map(g => '<img src="' + g + '" alt="">').join('')}</div></div></section>` : '';

  const revHtml = hasRev ? `<section class="sec alt" id="reviews"><div class="c"><div class="sh rv"><span>Шарҳҳо</span><h2>Мизоҷон чӣ мегӯянд</h2></div>
<div class="grid">${reviews.map(r => '<div class="rv-c rv"><div class="st">★★★★★</div><p>' + esc(r.text) + '</p><b>' + esc(r.name) + '</b></div>').join('')}</div></div></section>` : '';

  const faqHtml = hasFaq ? `<section class="sec" id="faq"><div class="c fq"><div class="sh rv"><span>Саволҳо</span><h2>Саволҳои маъмул</h2></div>
${faq.map(f => '<details class="rv"><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>').join('')}</div></section>` : '';

  const info = [
    tel && ['Телефон', '<a href="tel:' + tel + '">' + esc(telTxt) + '</a>'],
    wa && ['WhatsApp', '<a href="https://wa.me/' + wa + '" target="_blank" rel="noopener">Паём нависед</a>'],
    tg && ['Telegram', '<a href="https://t.me/' + esc(tg) + '" target="_blank" rel="noopener">@' + esc(tg) + '</a>'],
    ig && ['Instagram', '<a href="https://instagram.com/' + esc(ig) + '" target="_blank" rel="noopener">@' + esc(ig) + '</a>'],
    d.address && ['Суроға', esc(d.address) + (maps ? ' · <a href="' + esc(maps) + '" target="_blank" rel="noopener">Харита</a>' : '')],
    d.hours && ['Вақти кор', esc(d.hours)]
  ].filter(Boolean);

  const formHtml = sh.form ? `<form id="f" name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" class="rv">
<input type="hidden" name="form-name" value="contact"><p class="hp"><label>Нагузоред: <input name="bot-field"></label></p>
<input type="text" name="name" placeholder="Номи шумо" required><input type="tel" name="phone" placeholder="Рақами телефон" required>
<textarea name="message" rows="3" placeholder="Паём (ихтиёрӣ)"></textarea><button type="submit" class="btn btn-p">Фиристодан</button></form>` : '';

  const contHtml = `<section class="sec${hasFaq ? ' alt' : ''}" id="contact"><div class="c ct${formHtml ? '' : ' one'}"><div class="rv">
<div class="sh" style="text-align:left;margin-bottom:14px"><span>Тамос</span></div><h2>Бо мо тамос гиред</h2><p>Занг занед ё нависед. Мо зуд ҷавоб медиҳем.</p>
<ul class="ci">${info.map(i => '<li><b>' + i[0] + '</b><span>' + i[1] + '</span></li>').join('')}</ul></div>${formHtml}</div></section>`;

  const foot = `<footer><div class="c">© ${new Date().getFullYear()} ${esc(name)}</div></footer>`;

  const float = sh.float && (tel || wa || tg) ? `<div class="fl">
${wa ? '<a class="w" href="https://wa.me/' + wa + '" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M3 21l1.6-4.9A8.5 8.5 0 1 1 8.2 19.5L3 21z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a3.5 3.5 0 0 1-1.8-1.8l.8-1-1-2L9 9.5z"/></svg></a>' : ''}
${tg ? '<a class="t" href="https://t.me/' + esc(tg) + '" target="_blank" rel="noopener" aria-label="Telegram"><svg viewBox="0 0 24 24"><path d="M21 3L3 10.5l6 2.5 2.5 6L21 3z"/><path d="M9 13l12-10"/></svg></a>' : ''}
${tel ? '<a class="p" href="tel:' + tel + '" aria-label="Занг"><svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg></a>' : ''}</div>` : '';

  /* ---------- JS (дар дохили сайт) ---------- */
  const js = `(function(){
var b=document.getElementById('bg'),n=document.getElementById('nv');
if(b)b.addEventListener('click',function(){n.classList.toggle('open')});
if(n)n.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){n.classList.remove('open')})});
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12});
document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
var lb=document.getElementById('lb');
if(lb){var li=lb.querySelector('img');document.querySelectorAll('.gal img').forEach(function(im){im.addEventListener('click',function(){li.src=im.src;lb.classList.add('on')})});lb.addEventListener('click',function(){lb.classList.remove('on')})}
var f=document.getElementById('f');
if(f)f.addEventListener('submit',function(e){e.preventDefault();var bt=f.querySelector('button');bt.disabled=true;bt.textContent='...';
fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(f)).toString()})
.then(function(){f.innerHTML='<div class="ok"><i>✓</i><h3>Ташаккур!</h3><p>Мо ба наздикӣ занг мезанем.</p></div>'})
.catch(function(){alert(${jsonForScript(tel ? 'Хато шуд. Лутфан занг занед: ' + telTxt : 'Хато шуд. Лутфан баъдтар кӯшиш кунед.')});bt.disabled=false;bt.textContent='Фиристодан'})});
})();`;

  const emoji = pre.icon || '✨';
  return `<!DOCTYPE html>
<html lang="tg">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="${th.accent}">
<title>${esc(name)}${d.eyebrow ? ' · ' + esc(d.eyebrow) : ''}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(name)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${fo.url}&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body>
${head}
${hero}
${advHtml}${servHtml}${aboutHtml}${galHtml}${revHtml}${faqHtml}${contHtml}
${foot}
${float}
${hasGal ? '<div class="lb" id="lb"><img alt=""></div>' : ''}
<script>${js}</script>
</body>
</html>`;
}