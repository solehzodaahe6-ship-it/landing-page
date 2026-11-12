// ===== ФОРМА: ФИРИСТОДАН БА NETLIFY =====
// Барои чӣ: маълумоти муштарӣ ба Netlify меравад ва дар «Forms» намоён мешавад
const form = document.getElementById('form');

form.addEventListener('submit', function (e) {
  e.preventDefault();  // саҳифа нав нашавад

  // Маълумоти формаро ба матни фиристодан табдил медиҳем
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

// ===== СКРОЛЛИ ҲАМВОР =====
// Барои чӣ: ҳангоми пахши линки меню, саҳифа ҳамвор поён равад
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(link.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});