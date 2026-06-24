/* SAM·MALIK — live "session replay" readout for the hero.
   Logs your real cursor, hover, scroll and clicks like a session-replay tool.
   Purely decorative; nothing is sent anywhere. */
(function () {
  var body = document.getElementById('sl-body'),
      xEl = document.getElementById('sl-x'),
      yEl = document.getElementById('sl-y'),
      cEl = document.getElementById('sl-count');
  if (!body) return;

  var start = Date.now(), log = [], n = 0, MAX = 7;

  function p2(v) { return ('0' + v).slice(-2); }
  function ts() {
    var ms = Date.now() - start;
    var m = Math.floor(ms / 60000);
    var s = Math.floor(ms / 1000) % 60;
    var c = Math.floor((ms % 1000) / 10);
    return p2(m) + ':' + p2(s) + ':' + p2(c);
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function push(tag, text, cls) {
    n++;
    log.push({ t: ts(), tag: tag, text: text, cls: cls || 'g' });
    if (log.length > MAX) log.shift();
    render();
  }
  function render() {
    body.innerHTML = log.map(function (e) {
      return '<div class="sl-row"><span class="sl-t">' + e.t + '</span>'
        + '<span class="sl-tag ' + e.cls + '">(' + e.tag + ')</span>'
        + '<span class="sl-msg">' + esc(e.text) + '</span></div>';
    }).join('');
    if (cEl) cEl.textContent = n + ' events';
  }

  push('INIT', 'session replay initialized…', 'g');
  push('TRACK', 'mouse tracking enabled', 'g');
  window.addEventListener('load', function () { push('LOAD', 'page fully loaded', 'g'); });

  var lastMove = 0, lastLog = 0, lx = 0, ly = 0;
  document.addEventListener('mousemove', function (e) {
    lx = e.clientX; ly = e.clientY;
    var now = Date.now();
    if (now - lastMove > 40) { if (xEl) xEl.textContent = lx; if (yEl) yEl.textContent = ly; lastMove = now; }
    if (now - lastLog > 1900) { push('MOUSE', 'cursor at (' + lx + ', ' + ly + ')', 'g'); lastLog = now; }
  });

  var lastScroll = 0;
  window.addEventListener('scroll', function () {
    var now = Date.now();
    if (now - lastScroll > 1000) { push('SCROLL', 'scroll offset ' + Math.round(window.scrollY) + 'px', 'w'); lastScroll = now; }
  }, { passive: true });

  document.addEventListener('click', function (e) { push('CLICK', 'click at (' + e.clientX + ', ' + e.clientY + ')', 'g'); });

  // Hover events on interactive elements
  var lastHover = 0;
  function label(el) {
    var t = (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim();
    if (t.length > 22) t = t.slice(0, 22) + '…';
    return t;
  }
  document.querySelectorAll('a, button').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      var now = Date.now();
      if (now - lastHover < 650) return;
      var l = label(el);
      if (!l) return;
      lastHover = now;
      push('HOVER', 'hovering "' + l + '"', 'b');
    });
  });
})();
