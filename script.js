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
  el.style.transitionDelay = (i % 3) * 0.12 + 's';   // таъхири навбатӣ
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
  const steps = 60;
  let i = 0;
  const timer = setInterval(function () {
    i++;
    el.textContent = Math.round(end * i / steps) + suffix;
    if (i >= steps) clearInterval(timer);
  }, 25);
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

// ===== РАВШАНИИ ПАЙРАВИ МУШ ДАР КОРТҲО (spotlight) =====
// Барои чӣ: дар зери муш дар корт нури тиллоӣ ҳаракат мекунад
document.querySelectorAll('.card').forEach(function (card) {
  card.addEventListener('mousemove', function (e) {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

// ===== ПАРАЛЛАКС: ШАКЛҲОИ ҚАФО БО МУШ ҲАРАКАТ МЕКУНАНД =====
// Барои чӣ: чуқурии ҳисс. data-speed = суръат ва самт
const blobs = document.querySelectorAll('.blob');

window.addEventListener('mousemove', function (e) {
  const x = (e.clientX / window.innerWidth - 0.5);
  const y = (e.clientY / window.innerHeight - 0.5);
  blobs.forEach(function (b) {
    const s = +b.dataset.speed;
    b.style.transform = 'translate(' + (x * s) + 'px,' + (y * s) + 'px)';
  });
});

// ===== ФОРМА: ФИРИСТОДАН БА NETLIFY =====
// Барои чӣ: маълумоти муштарӣ ба Netlify меравад ва дар «Forms» намоён мешавад
const form = document.getElementById('form');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const data = new URLSearchParams(new FormData(form)).toString();

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data
  })
    .then(function () {
      alert('Ташаккур! Мо ба наздикӣ занг мезанем.');
      form.reset();
    })
    .catch(function () {
      alert('Хато шуд. Лутфан баъдтар кӯшиш кунед.');
    });
});