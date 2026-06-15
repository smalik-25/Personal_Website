/* SAM·MALIK — shared interactions: mobile nav + active link */
(function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      toggle.textContent = links.classList.contains('open') ? '✕ CLOSE' : '≡ MENU';
    });
  }

  // Mark active nav link by current filename
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here || (here === 'index.html' && href === './') || (here === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Page-rise transition on the main element
  var main = document.querySelector('main');
  if (main) main.classList.add('page-rise');
})();
