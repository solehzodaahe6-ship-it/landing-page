/* =====================================================
   ТАНЗИМОТИ САЙТ (ҳамаро инҷо иваз кунед)
   Холӣ гузоред = линк дар footer пинҳон мешавад
   ===================================================== */
const SITE = {
  name: 'Номи шумо',        // номи шумо дар footer
  telegram: '',             // username-и Telegram (бе @)
  instagram: '',            // username-и Instagram (бе @)
  email: ''                 // почтаи электронӣ
};

/* =====================================================
   КУМАКӢ: ёфтани унсурҳо ва санҷиши имкониятҳо
   ===================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const hasGSAP = typeof gsap !== 'undefined';                                  // GSAP боргирӣ шуд?
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;        // корбар аниматсияро хомӯш кардааст?
const fine = matchMedia('(pointer: fine)').matches;                           // муш ҳаст (на ангушт)?

/* ===== FOOTER: пур кардани ном ва линкҳо аз SITE ===== */
$$('[data-site="name"]').forEach(el => { el.textContent = SITE.name; });
$$('[data-site-link]').forEach(el => {
  const k = el.dataset.siteLink;
  const href = { telegram: SITE.telegram && 'https://t.me/' + SITE.telegram, instagram: SITE.instagram && 'https://instagram.com/' + SITE.instagram, email: SITE.email && 'mailto:' + SITE.email }[k];
  if (href) el.href = href; else el.style.display = 'none';
});

/* =====================================================
   КУМАКӢ: ҷудо кардани матн ба калима ва ҳарф
   Барои чӣ: ҳар ҳарфро алоҳида аниматсия кардан мумкин мешавад
   ===================================================== */
function split(el) {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const words = text.split(' ');
  let n = 0;
  words.forEach((w, wi) => {
    const word = document.createElement('span');
    word.className = 'word';
    [...w].forEach(ch => {
      const c = document.createElement('span');
      c.className = 'char';
      c.style.setProperty('--i', n++);       // индекс барои ранги ҳарфҳо
      c.textContent = ch;
      c.setAttribute('aria-hidden', 'true');
      word.appendChild(c);
    });
    el.appendChild(word);
    if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
  });
  return { words: $$('.word', el), chars: $$('.char', el) };
}

/* =====================================================
   00 · ЭКРАНИ ОҒОЗ (loader)
   Барои чӣ: шумориш 0 то 100, баъд парда боло меравад ва hero оғоз мешавад
   ===================================================== */
function runLoader(onReveal) {
  const loader = $('#loader');
  if (!hasGSAP || reduce) {                 // GSAP нест: фавран нест кунем
    loader.classList.add('hide');
    onReveal();
    return;
  }
  const num = $('#loaderNum'), bar = $('#loaderBar');
  const o = { v: 0 };
  gsap.timeline()
    .to(o, {
      v: 100, duration: 1.5, ease: 'power2.inOut',
      onUpdate() { const v = Math.round(o.v); num.textContent = v; bar.style.width = v + '%'; }
    })
    .to('.loader-inner', { opacity: 0, y: -20, duration: 0.4 })
    .to(loader, {
      yPercent: -100, duration: 0.9, ease: 'power4.inOut',
      onStart: onReveal,                    // hero ҳангоми боло рафтани парда оғоз мешавад
      onComplete() { loader.classList.add('hide'); }
    });
}

/* =====================================================
   HERO: ҳолати аввал ва оғози аниматсия
   ===================================================== */
const heroChars = [];
$$('[data-split]').forEach(el => { heroChars.push(...split(el).chars); });

if (hasGSAP && !reduce) {
  // Пинҳон мекунем, то loader пардаро боло барад
  gsap.set(heroChars, { yPercent: 120, opacity: 0 });
  gsap.set('.eyebrow, .hero-sub, .hero-actions, .scroll-hint', { opacity: 0, y: 30 });
  gsap.set('#heroCanvas', { opacity: 0 });
  gsap.set('.header', { yPercent: -100 });
}

function heroIntro() {
  if (!hasGSAP || reduce) return;
  gsap.to(heroChars, { yPercent: 0, opacity: 1, duration: 1, ease: 'power4.out', stagger: 0.035 });
  gsap.to('.eyebrow, .hero-sub, .hero-actions, .scroll-hint', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.5, clearProps: 'transform' });
  gsap.to('#heroCanvas', { opacity: 1, duration: 2, delay: 0.3 });
  gsap.to('.header', { yPercent: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 });
}

/* =====================================================
   СКРОЛЛИ НАРМ (Lenis) ва ҲАМАИ АНИМАТСИЯҲОИ СКРОЛЛ (GSAP ScrollTrigger)
   ===================================================== */
let lenis = null;

function initScroll() {
  // Сарлавҳа ҳангоми скролл фон мегирад (бе GSAP ҳам кор мекунад)
  const header = $('#header');
  addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 40), { passive: true });

  // Рақамҳо: агар GSAP набошад, рақами ниҳоиро нишон медиҳем
  if (!hasGSAP) {
    $$('[data-count]').forEach(el => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (typeof Draggable !== 'undefined') gsap.registerPlugin(Draggable);

  /* ----- Скролли нарм (Lenis) ва пайвастан бо ScrollTrigger ----- */
  if (typeof Lenis !== 'undefined' && !reduce) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ----- Линкҳои #... нарм скролл мекунанд ----- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = id.length > 1 ? $(id) : null;
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  if (reduce) return;     // корбар аниматсияро намехоҳад: боқӣ лозим нест

  /* ----- ХАТТИ ПЕШРАФТИ СКРОЛЛ (боло) ----- */
  gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

  /* ----- 03 · ПАЙДОШАВӢ ҲАНГОМИ СКРОЛЛ -----
     clearProps = пас аз тамом шудан inline-стилро тоза мекунад, то hover дар CSS кор кунад */
  $$('[data-reveal]').forEach(el => {
    gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  $$('[data-stagger]').forEach(box => {
    gsap.from(box.children, { y: 60, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, clearProps: 'transform,opacity', scrollTrigger: { trigger: box, start: 'top 85%' } });
  });

  /* ----- 03 · РАҚАМҲО МЕШУМОРАНД ----- */
  $$('[data-count]').forEach(el => {
    const end = +el.dataset.count, suf = el.dataset.suffix || '';
    const o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 1.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate() { el.textContent = Math.round(o.v) + suf; }
    });
  });

  /* ----- 04 · ПАРАЛЛАКС: ҳар шакл бо суръати худаш ҳаракат мекунад ----- */
  $$('[data-speed]').forEach(el => {
    const s = parseFloat(el.dataset.speed);
    const st = { trigger: el.closest('.px'), start: 'top bottom', end: 'bottom top', scrub: true };
    gsap.fromTo(el, { y: s * -150 }, { y: s * 150, ease: 'none', scrollTrigger: st });
    if (el.dataset.rot) gsap.to(el, { rotation: +el.dataset.rot, ease: 'none', scrollTrigger: st });
  });

  /* ----- 05 · МАТН: КАЛИМАҲО БО СКРОЛЛ РАВШАН МЕШАВАНД ----- */
  $$('[data-scrub]').forEach(p => {
    const { words } = split(p);
    gsap.fromTo(words, { opacity: 0.15 }, {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: p, start: 'top 85%', end: 'bottom 50%', scrub: true }
    });
  });

  /* ----- 06 · SVG: ХАТ БО СКРОЛЛ КАШИДА МЕШАВАД ----- */
  $$('.draw').forEach(path => {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    gsap.to(path, {
      strokeDashoffset: 0, ease: 'none',
      scrollTrigger: { trigger: path.closest('.svg-box'), start: 'top 80%', end: 'bottom 45%', scrub: true }
    });
  });

  /* ----- NАВОРИ ҲАРАКАТКУНАНДА: ҳангоми скролли тез каҷ мешавад ----- */
  ScrollTrigger.create({
    onUpdate(self) {
      const skew = gsap.utils.clamp(-10, 10, self.getVelocity() / -300);
      gsap.to('.marquee-skew', { skewX: skew, duration: 0.4, ease: 'power3.out', overwrite: true });
    }
  });

  /* ----- 10 · СКРОЛЛИ УФУҚӢ: саҳифа мемонад (pin), ҳикоя ба рост меравад ----- */
  const track = $('.h-track');
  const dist = () => track.scrollWidth - innerWidth;
  gsap.to(track, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: { trigger: '.h-scroll', start: 'top top', end: () => '+=' + dist(), scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true }
  });

  /* ----- 08 · DRAG: чипҳоро кашидан (GSAP Draggable) ----- */
  if (typeof Draggable !== 'undefined') {
    Draggable.create('.chip-d', {
      type: 'x,y', bounds: '.board',
      onPress() { gsap.to(this.target, { scale: 1.12, duration: 0.2 }); },
      onRelease() { gsap.to(this.target, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' }); }
    });
  }

  // Шрифтҳо боргирӣ шуда, ҷойгиршавӣ тағйир ёфт: ScrollTrigger аз нав ҳисоб мекунад
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
}

/* =====================================================
   КУРСОРИ МАХСУС (танҳо дар компютер)
   Барои чӣ: нуқта зуд, ҳалқа оҳиста аз паси муш меравад; болои тугмаҳо калон мешавад
   ===================================================== */
function initCursor() {
  if (!fine || !hasGSAP || reduce) return;
  document.documentElement.classList.add('cursor-on');
  const dot = $('#cursor'), ring = $('#cursorRing');
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 1 });
  const dx = gsap.quickTo(dot, 'x', { duration: 0.1 }), dy = gsap.quickTo(dot, 'y', { duration: 0.1 });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
  addEventListener('mousemove', e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
  $$('a, button, [data-hover], input[type="range"], .chip-d').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('big'));
    el.addEventListener('mouseleave', () => ring.classList.remove('big'));
  });
}

/* =====================================================
   07 · ТУГМАҲОИ МАГНИТӢ
   Барои чӣ: тугма ба муш каме мекашад ва баъд бо фанар бармегардад
   ===================================================== */
function initMagnetic() {
  if (!fine || !hasGSAP || reduce) return;
  $$('.magnetic').forEach(el => {
    const qx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const qy = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      qx((e.clientX - r.left - r.width / 2) * 0.35);
      qy((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('mouseleave', () => { qx(0); qy(0); });
  });
}

/* =====================================================
   07 · КОРТИ 3D (tilt) ва НУРИ ПАЙРАВИ МУШ (spotlight)
   ===================================================== */
function initTiltSpot() {
  $$('.tilt').forEach(card => {
    const inner = $('.tilt-in', card), glare = $('.glare', card);
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      inner.style.transform = 'rotateY(' + ((px - 0.5) * 22) + 'deg) rotateX(' + ((0.5 - py) * 22) + 'deg) scale(1.03)';
      glare.style.background = 'radial-gradient(circle at ' + (px * 100) + '% ' + (py * 100) + '%, rgba(255,255,255,.4), transparent 55%)';
    });
    card.addEventListener('mouseleave', () => { inner.style.transform = ''; glare.style.background = 'none'; });
  });

  $$('.spot').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
}

/* =====================================================
   07 · ЗАРРАҲО БО МУШ (canvas 2D)
   Барои чӣ: дар canvas бо муш ё ангушт зарраҳои рангин ҳосил мешаванд
   ===================================================== */
function initFx() {
  const cv = $('#fxCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let w = 0, h = 0, ps = [], visible = false, running = false;

  function size() {
    const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    w = cv.width = r.width * d; h = cv.height = r.height * d;
  }
  size();
  addEventListener('resize', size);

  function add(e) {
    const r = cv.getBoundingClientRect(), t = e.touches ? e.touches[0] : e, d = w / r.width;
    for (let i = 0; i < 4; i++) {
      ps.push({ x: (t.clientX - r.left) * d, y: (t.clientY - r.top) * d, vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3, life: 1, r: Math.random() * 6 + 2, hue: Math.random() * 120 + 200 });
    }
  }
  cv.addEventListener('mousemove', add);
  cv.addEventListener('touchmove', add, { passive: true });

  function loop() {
    if (!visible) { running = false; return; }
    ctx.clearRect(0, 0, w, h);
    ps = ps.filter(p => p.life > 0);
    ps.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.life -= 0.02;
      ctx.beginPath();
      ctx.fillStyle = 'hsla(' + p.hue + ',90%,65%,' + p.life + ')';
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  // Танҳо вақте намоён аст, кор мекунад (барои сабукии телефон)
  new IntersectionObserver(en => {
    visible = en[0].isIntersecting;
    if (visible && !running) { running = true; loop(); }
  }).observe(cv);
}

/* =====================================================
   08 · СЛАЙДЕРИ «ПЕШ / БАЪД»
   ===================================================== */
function initCompare() {
  const cmp = $('#cmp'), range = $('#cmpRange');
  if (!cmp) return;
  range.addEventListener('input', () => cmp.style.setProperty('--pos', range.value + '%'));
}

/* =====================================================
   09 · МИКРО-ҲАМКОРӢ: like, ripple, success
   ===================================================== */
function initMicro() {
  // Like + таркиши дилчаҳо
  $$('.like').forEach(b => b.addEventListener('click', () => {
    b.classList.toggle('on');
    if (!b.classList.contains('on') || !hasGSAP || reduce) return;
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('i');
      p.className = 'burst';
      b.appendChild(p);
      const a = i / 10 * Math.PI * 2;
      gsap.fromTo(p, { x: 0, y: 0, opacity: 1, scale: 1 }, {
        x: Math.cos(a) * 48, y: Math.sin(a) * 48, opacity: 0, scale: 0.3, duration: 0.7, ease: 'power2.out',
        onComplete: () => p.remove()
      });
    }
  }));

  // Ripple: мавҷ аз ҷойи пахшкунӣ
  $$('.ripple-btn').forEach(b => b.addEventListener('click', e => {
    const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2;
    const sp = document.createElement('span');
    sp.className = 'ripple';
    sp.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
    b.appendChild(sp);
    setTimeout(() => sp.remove(), 700);
  }));

  // Success: тугма ба ✓ табдил мешавад ва баъд бармегардад
  $$('.check-btn').forEach(b => b.addEventListener('click', () => {
    if (b.classList.contains('done')) return;
    b.classList.add('done');
    setTimeout(() => b.classList.remove('done'), 2200);
  }));
}

/* =====================================================
   05 · МАТН: scramble ва rotator
   ===================================================== */
function initText() {
  // Scramble: ҳарфҳо омехта шуда, яктогӣ ба ҳолати аслӣ бармегарданд
  const pool = 'АБВГДЕЖЗИКЛМНОПРСТУФХЧШЯҒӢҚӮҲҶ';
  $$('.scramble').forEach(el => {
    const orig = el.dataset.text;
    let timer;
    el.addEventListener('mouseenter', () => {
      let f = 0;
      clearInterval(timer);
      timer = setInterval(() => {
        el.textContent = [...orig].map((c, i) => i < f ? c : pool[Math.floor(Math.random() * pool.length)]).join('');
        f += 0.4;
        if (f >= orig.length) { el.textContent = orig; clearInterval(timer); }
      }, 30);
    });
  });

  // Rotator: калимаҳо ҳар 2 сония иваз мешаванд
  const words = ['сайт', 'лендинг', 'барнома', '3D', 'аниматсия'];
  const rot = $('#rotator');
  let wi = 0;
  if (rot) {
    setInterval(() => {
      wi = (wi + 1) % words.length;
      if (!hasGSAP || reduce) { rot.textContent = words[wi]; return; }
      gsap.to(rot, {
        yPercent: -100, opacity: 0, duration: 0.3,
        onComplete() {
          rot.textContent = words[wi];
          gsap.fromTo(rot, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 });
        }
      });
    }, 2000);
  }
}

/* =====================================================
   12 · ТАҒЙИРИ САҲИФА (View Transitions API)
   Барои чӣ: мавзӯъ иваз мешавад ва саҳифа аз нуқтаи пахшкунӣ ҳамчун давра паҳн мешавад
   ===================================================== */
function setTheme(t) { document.documentElement.dataset.theme = t; }

function toggleTheme(e) {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  // Браузер View Transitions-ро намедонад ё корбар аниматсияро намехоҳад: фавран иваз мекунем
  if (!document.startViewTransition || reduce) { setTheme(next); return; }

  const x = e.clientX, y = e.clientY;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const t = document.startViewTransition(() => setTheme(next));
  t.ready.then(() => {
    document.documentElement.animate(
      { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
      { duration: 800, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
    );
  });
}
['themeBtn', 'themeBtn2'].forEach(id => { const b = document.getElementById(id); if (b) b.addEventListener('click', toggleTheme); });

/* =====================================================
   ОҒОЗ: ҳамаро бо тартиб кор мефармоем
   ===================================================== */
initCursor();
initMagnetic();
initTiltSpot();
initFx();
initCompare();
initMicro();
initText();
initScroll();
runLoader(heroIntro);