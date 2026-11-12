// ===== МЕНЮИ ТЕЛЕФОН =====
// Барои чӣ: тугмаи ☰ менюро мекушояд ва мепӯшонад
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', function () {
  nav.classList.toggle('open');
});

// Пас аз пахши линк меню мепӯшад
nav.querySelectorAll('a').forEach(function (a) {
  a.addEventListener('click', function () {
    nav.classList.remove('open');
  });
});

// ===== ПАЙДОШАВИИ НАРМ ҲАНГОМИ СКРОЛЛ =====
// Барои чӣ: ҳар унсури .reveal ҳангоми намоён шудан нарм пайдо мешавад
const observer = new IntersectionObserver(function (items) {
  items.forEach(function (item) {
    if (item.isIntersecting) {
      item.target.classList.add('show');
      observer.unobserve(item.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(function (el) {
  observer.observe(el);
});

// ===== ФОРМА: ФИРИСТОДАН БА NETLIFY =====
// Барои чӣ: маълумоти муштарӣ ба Netlify меравад ва дар «Forms» намоён мешавад
const form = document.getElementById('form');

form.addEventListener('submit', function (e) {
  e.preventDefault();  // саҳифа нав нашавад

  const data = new URLSearchParams(new FormData(form)).toString();

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data
  })
    .then(function () {
      alert('Ташаккур! Мо ба наздикӣ занг мезанем.');  // паёми муваффақият
      form.reset();                                     // тоза кардани майдонҳо
    })
    .catch(function () {
      alert('Хато шуд. Лутфан баъдтар кӯшиш кунед.');   // паёми хато
    });
});

// ===== ШУМОРИШИ РАҚАМҲО =====
// Барои чӣ: рақамҳо аз 0 то рақами ниҳоӣ нарм мешуморанд
function countUp(el) {
  const end = +el.dataset.count;            // рақами ниҳоӣ
  const suffix = el.dataset.suffix || '';   // аломат (+ ё %)
  const steps = 60;                         // шумораи қадамҳо
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

document.querySelectorAll('[data-count]').forEach(function (el) {
  countObserver.observe(el);
});

// ===== СОЯИ HEADER ҲАНГОМИ СКРОЛЛ =====
// Барои чӣ: пас аз 20px скролл header соя мегирад
const headerEl = document.querySelector('.header');

window.addEventListener('scroll', function () {
  headerEl.classList.toggle('scrolled', window.scrollY > 20);
});