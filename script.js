// ===== ФОРМА: ҲАНГОМИ ФИРИСТОДАН =====
// Барои чӣ: саҳифа нав нашавад ва муштарӣ паёми ташаккур бинад
document.getElementById('form').addEventListener('submit', function (e) {
  e.preventDefault();                 // манъи нав шудани саҳифа
  alert('Ташаккур! Мо ба наздикӣ занг мезанем.');  // паём (матнро иваз кунед)
  this.reset();                       // тоза кардани майдонҳо
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