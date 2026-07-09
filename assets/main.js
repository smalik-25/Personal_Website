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

  // Graceful placeholders for concert photos not yet added
  document.querySelectorAll('.gallery .shot img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.display = 'none';
      var shot = img.closest('.shot');
      if (shot) shot.classList.add('shot--empty');
    });
  });

  // Lazy-load embedded live demos: iframe injected on scroll, skeleton until ready
  var demos = document.querySelectorAll('[data-embed]');
  if (demos.length) {
    // Mark bands as JS-active so the CSS shows the spinner + "waking" copy only when an
    // iframe will actually be injected; with JS off, a static fallback line shows instead.
    demos.forEach(function (el) { el.classList.add('demo--js'); });
    var loadDemo = function (el) {
      if (el.dataset.loaded) return;
      el.dataset.loaded = '1';
      var stage = el.querySelector('.demo__stage');
      if (!stage) return;
      var frame = document.createElement('iframe');
      frame.className = 'demo__frame';
      frame.src = el.dataset.src;
      frame.title = el.dataset.title || 'Live demo';
      frame.loading = 'lazy';
      frame.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      var t;
      var reveal = function () { clearTimeout(t); el.classList.add('is-ready'); };
      frame.addEventListener('load', reveal);
      // Safety net for a stalled or non-embeddable host. Do NOT reveal a possibly blank
      // frame over the dark page. Well past the copy's 60s ceiling, degrade the skeleton
      // in place (stop the spinner, update the status) but keep its new-tab link clickable.
      t = setTimeout(function () {
        if (el.classList.contains('is-ready')) return;
        var spin = el.querySelector('.demo__spinner');
        if (spin) spin.style.display = 'none';
        var status = el.querySelector('.demo__status');
        if (status) status.textContent = 'Still waking. The free-tier host is slow to cold-start; open it in a new tab if you would rather not wait.';
      }, 90000);
      stage.appendChild(frame);
    };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { loadDemo(entry.target); obs.unobserve(entry.target); }
        });
      }, { rootMargin: '400px 0px' });
      demos.forEach(function (el) { io.observe(el); });
    } else {
      demos.forEach(loadDemo);
    }
  }
})();
