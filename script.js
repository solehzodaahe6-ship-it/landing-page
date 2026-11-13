// ===== ЭКРАНИ ОҒОЗ =====
// Барои чӣ: пас аз боргирии саҳифа экрани оғоз нарм нест мешавад
const preloader = document.getElementById('preloader');
window.addEventListener('load', function () {
  setTimeout(function () {
    if (preloader) preloader.classList.add('hide');
  }, 500);
});

// ===== МЕНЮИ ТЕЛЕФОН =====
// Барои чӣ: тугмаи ☰ менюро мекушояд ва мепӯшонад
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', function () {
  nav.classList.toggle('open');
});
nav.querySelectorAll('a').forEach(function (a) {
  a.addEventListener('click', function () { nav.classList.remove('open'); });
});

// ===== ПАЙДОШАВИИ НАРМ ҲАНГОМИ СКРОЛЛ =====
// Барои чӣ: унсурҳо яке пас аз дигаре (бо таъхир) нарм пайдо мешаванд
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

// ===== ШУМОРИШИ РАҚАМҲО =====
// Барои чӣ: рақамҳо аз 0 то рақами ниҳоӣ нарм мешуморанд
function countUp(el) {
  const end = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  const steps = 40;
  let i = 0;
  const timer = setInterval(function () {
    i++;
    el.textContent = Math.round(end * i / steps) + suffix;
    if (i >= steps) clearInterval(timer);
  }, 30);
}

const countObserver = new IntersectionObserver(function (items) {
  items.forEach(function (item) {
    if (item.isIntersecting) {
      countUp(item.target);
      countObserver.unobserve(item.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(function (el) { countObserver.observe(el); });

// ===== HEADER ВА ХАТТИ ПЕШРАФТ ҲАНГОМИ СКРОЛЛ =====
// Барои чӣ: header соя мегирад ва хатти тиллоӣ дарозии скроллро нишон медиҳад
const headerEl = document.querySelector('.header');
const progress = document.getElementById('progress');

window.addEventListener('scroll', function () {
  headerEl.classList.toggle('scrolled', window.scrollY > 20);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (window.scrollY / max * 100) + '%';
});

// ===== ЭФФЕКТҲОИ МУШ (танҳо дар компютер) =====
const hasMouse = window.matchMedia('(pointer: fine)').matches;

if (hasMouse) {

  // --- Нури тиллоӣ, ки аз паси муш меравад ---
  const glow = document.getElementById('glow');
  window.addEventListener('mousemove', function (e) {
    glow.style.opacity = 1;
    glow.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
  });

  // --- Шаклҳои қафо бо муш ҳаракат мекунанд (параллакс) ---
  const blobs = document.querySelectorAll('.blob');
  window.addEventListener('mousemove', function (e) {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    blobs.forEach(function (b) {
      const s = +b.dataset.speed;
      b.style.transform = 'translate(' + (x * s) + 'px,' + (y * s) + 'px)';
    });
  });

  // --- Камони hero каме моил мешавад (3D) ---
  const visual = document.querySelector('.hero-visual');
  visual.addEventListener('mousemove', function (e) {
    const r = visual.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    visual.style.setProperty('--ry', (x * 10) + 'deg');
    visual.style.setProperty('--rx', (-y * 10) + 'deg');
  });
  visual.addEventListener('mouseleave', function () {
    visual.style.setProperty('--ry', '0deg');
    visual.style.setProperty('--rx', '0deg');
  });

  // --- Тугмаҳои «магнитӣ»: ба муш каме мекашанд ---
  document.querySelectorAll('.magnetic').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = 'translate(' + (x * 0.25) + 'px,' + (y * 0.35) + 'px)';
    });
    btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
  });
}

// ===== РАВШАНИИ ПАЙРАВИ МУШ ДАР КОРТҲО (spotlight) =====
// Барои чӣ: дар зери муш дар корт нури тиллоӣ ҳаракат мекунад
document.querySelectorAll('.card').forEach(function (card) {
  card.addEventListener('mousemove', function (e) {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

// ===== СЛАЙДЕРИ «ПЕШ / БАЪД» =====
// Барои чӣ: слайдерро кашед, дандонҳо аз зардтоб ба сафед мегузаранд
const ba = document.getElementById('ba');
const baRange = document.getElementById('baRange');

function setBA(v) {
  baRange.value = v;
  ba.style.setProperty('--pos', v + '%');
}

baRange.addEventListener('input', function () { setBA(baRange.value); });

// Намоиши худкор: ҳангоми намоён шудан слайдер як бор ҳаракат мекунад
const baObserver = new IntersectionObserver(function (items) {
  items.forEach(function (item) {
    if (!item.isIntersecting) return;
    baObserver.unobserve(item.target);
    let t = 0;
    const id = setInterval(function () {
      t += 0.06;
      setBA(50 + Math.sin(t * 2) * 28 * (1 - t / 6));
      if (t >= 6) { clearInterval(id); setBA(50); }
    }, 16);
  });
}, { threshold: 0.6 });
baObserver.observe(ba);

// ===== ФОРМА: ФИРИСТОДАН БА NETLIFY =====
// Барои чӣ: маълумоти муштарӣ ба Netlify меравад ва дар «Forms» намоён мешавад
const form = document.getElementById('form');
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
      form.classList.add('sent');   // майдонҳо пинҳон мешаванд
      formOk.hidden = false;        // паёми ташаккур намоён мешавад
      form.reset();
    })
    .catch(function () {
      alert('Хато шуд. Лутфан занг занед: +992 000 018 802');
      btn.disabled = false;
      btn.textContent = 'Фиристодан';
    });
});