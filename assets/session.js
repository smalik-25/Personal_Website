/* SAM·MALIK — live "session replay" readout for the hero.
   Logs your real cursor + scroll like a session-replay tool, with personal flavor lines mixed in.
   Purely decorative; nothing is sent anywhere. */
(function () {
  var body = document.getElementById('sl-body'),
      xEl = document.getElementById('sl-x'),
      yEl = document.getElementById('sl-y'),
      cEl = document.getElementById('sl-count');
  if (!body) return;

  var start = Date.now(), log = [], n = 0, MAX = 7, sinceFlavor = 0;

  var FLAVOR = [
    'currently: warped rap, colder metal',
    'rick owens > everything',
    'front-row death grips or bust',
    'matcha levels: critical',
    'down 100 lbs, the slow way',
    'apollonian by day, dionysian by night',
    'thrifting in my head again',
    'this site is the territory, not the map'
  ];

  function pad(v) { v = String(v); return ('000' + v).slice(-Math.max(3, v.length)); }
  function ts() {
    var s = Math.floor((Date.now() - start) / 1000);
    return ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + (s % 60)).slice(-2);
  }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  function push(tag, text, cls) {
    n++;
    log.push({ t: ts(), tag: tag, text: text, cls: cls || 'p' });
    if (log.length > MAX) log.shift();
    render();
  }
  function render() {
    body.innerHTML = log.map(function (e) {
      return '<div class="sl-row"><span class="sl-t">' + e.t + '</span> '
        + '<span class="sl-tag ' + e.cls + '">(' + e.tag + ')</span> '
        + '<span class="sl-msg">' + esc(e.text) + '</span></div>';
    }).join('');
    if (cEl) cEl.textContent = n + ' events';
  }
  function maybeFlavor() {
    if (++sinceFlavor >= 4) { sinceFlavor = 0; push('NOTE', FLAVOR[Math.floor(Math.random() * FLAVOR.length)], 'o'); }
  }

  push('INIT', 'session://sam.malik — online', 'p');
  push('TRACK', 'tracking taste, not telemetry', 'p');
  window.addEventListener('load', function () { push('LOAD', 'page fully loaded', 'p'); });

  var lastMove = 0, lastLog = 0, lx = 0, ly = 0;
  document.addEventListener('mousemove', function (e) {
    lx = e.clientX; ly = e.clientY;
    var now = Date.now();
    if (now - lastMove > 40) { if (xEl) xEl.textContent = pad(lx); if (yEl) yEl.textContent = pad(ly); lastMove = now; }
    if (now - lastLog > 1900) { push('MOUSE', 'cursor at (' + lx + ', ' + ly + ')', 'p'); lastLog = now; maybeFlavor(); }
  });

  var lastScroll = 0;
  window.addEventListener('scroll', function () {
    var now = Date.now();
    if (now - lastScroll > 1000) { push('SCROLL', 'offset ' + Math.round(window.scrollY) + 'px', 'w'); lastScroll = now; }
  }, { passive: true });

  document.addEventListener('click', function (e) { push('CLICK', 'click (' + e.clientX + ', ' + e.clientY + ')', 'p'); });
})();
