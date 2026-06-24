/* SAM·MALIK — hero panel: passive "session replay" that becomes a playable terminal on click.
   Replay mode logs your real cursor / scroll / hover. Click in and it's a tiny REPL.
   Decorative; nothing is sent anywhere (except the optional Last.fm read for `nowplaying`). */
(function () {
  var panel = document.getElementById('sessionlog'),
      body = document.getElementById('sl-body'),
      input = document.getElementById('sl-input'),
      nameEl = document.getElementById('sl-name'),
      xEl = document.getElementById('sl-x'),
      yEl = document.getElementById('sl-y'),
      cEl = document.getElementById('sl-count');
  if (!panel || !body || !input) return;

  var start = Date.now(), log = [], n = 0, mode = 'replay';
  var MAX_REPLAY = 7, MAX_TERM = 40;

  function p2(v) { return ('0' + v).slice(-2); }
  function ts() {
    var ms = Date.now() - start;
    return p2(Math.floor(ms / 60000)) + ':' + p2(Math.floor(ms / 1000) % 60) + ':' + p2(Math.floor((ms % 1000) / 10));
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function push(tag, text, cls) {
    n++;
    log.push({ t: ts(), tag: tag, text: text, cls: cls || 'g' });
    var max = mode === 'term' ? MAX_TERM : MAX_REPLAY;
    while (log.length > max) log.shift();
    render();
  }
  function render() {
    body.innerHTML = log.map(function (e) {
      return '<div class="sl-row"><span class="sl-t">' + e.t + '</span>'
        + '<span class="sl-tag ' + e.cls + '">(' + e.tag + ')</span>'
        + '<span class="sl-msg">' + e.text + '</span></div>';
    }).join('');
    if (cEl) cEl.textContent = n + (mode === 'term' ? ' lines' : ' events');
    if (mode === 'term') body.scrollTop = body.scrollHeight;
  }

  /* ---------- replay mode (passive) ---------- */
  push('INIT', 'session replay initialized…', 'g');
  push('TRACK', 'mouse tracking enabled', 'g');
  window.addEventListener('load', function () { if (mode === 'replay') push('LOAD', 'page fully loaded', 'g'); });

  var lastMove = 0, lastLog = 0, lx = 0, ly = 0;
  document.addEventListener('mousemove', function (e) {
    lx = e.clientX; ly = e.clientY;
    var now = Date.now();
    if (now - lastMove > 40) { if (xEl) xEl.textContent = lx; if (yEl) yEl.textContent = ly; lastMove = now; }
    if (mode === 'replay' && now - lastLog > 1900) { push('MOUSE', 'cursor at (' + lx + ', ' + ly + ')', 'g'); lastLog = now; }
  });
  var lastScroll = 0;
  window.addEventListener('scroll', function () {
    var now = Date.now();
    if (mode === 'replay' && now - lastScroll > 1000) { push('SCROLL', 'scroll offset ' + Math.round(window.scrollY) + 'px', 'w'); lastScroll = now; }
  }, { passive: true });
  var lastHover = 0;
  function label(el) {
    var t = (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim();
    return t.length > 22 ? t.slice(0, 22) + '…' : t;
  }
  document.querySelectorAll('a, button').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      var now = Date.now();
      if (mode !== 'replay' || now - lastHover < 650) return;
      var l = label(el); if (!l) return;
      lastHover = now; push('HOVER', 'hovering "' + esc(l) + '"', 'b');
    });
  });

  /* ---------- terminal mode (interactive) ---------- */
  function enterTerm() {
    if (mode === 'term') return;
    mode = 'term';
    panel.classList.add('is-term');
    if (nameEl) nameEl.textContent = 'sam@malik — zsh';
    push('SYS', "interactive mode. type 'help'. esc to exit.", 's');
  }
  function exitTerm() {
    if (mode !== 'term') return;
    mode = 'replay';
    panel.classList.remove('is-term');
    if (nameEl) nameEl.textContent = 'SESSION_REPLAY.log';
    log = []; n = 0;
    push('INIT', 'session replay resumed…', 'g');
    input.blur();
  }

  var COMMANDS = {
    help: function () { return ["commands: whoami · ls · nowplaying · faves · reading · contact · clear · exit"]; },
    whoami: function () { return ["sam malik — data by trade, music & clothes by obsession.", "apollonian & dionysian. seattle-trained, loud-room-tested."]; },
    ls: function () { return ["ethos/   reading/   writing/   listening/", "doing/   building/   connect/"]; },
    faves: function () { return ["death grips · sematary · chief keef · playboi carti", "young thug · danny brown · gorgoroth · deathspell omega", "darkthrone · sunn o))) · emperor · carcass"]; },
    reading: function () { return ["past:    Anti-Oedipus — Deleuze & Guattari", "present: America — Jean Baudrillard", "future:  Flatline Constructs — Mark Fisher"]; },
    contact: function () { return ["email:    maliksam2500@gmail.com", "linkedin: /in/sam-malik", "github:   github.com/smalik-25"]; },
    sudo: function () { return ["nice try."]; },
    clear: function () { log = []; n = 0; render(); return null; },
    exit: function () { exitTerm(); return null; }
  };

  function nowplaying() {
    var key = (window.LASTFM_API_KEY || '').trim(), user = (window.LASTFM_USER || 'tequila_sunset');
    if (!key) { push('OUT', 'last.fm key not set.', 'g'); return; }
    push('OUT', 'querying last.fm…', 's');
    fetch('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + encodeURIComponent(user) + '&api_key=' + encodeURIComponent(key) + '&format=json&limit=1')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var t = d && d.recenttracks && d.recenttracks.track && d.recenttracks.track[0];
        if (!t) { push('OUT', 'nothing found.', 'g'); return; }
        var artist = (t.artist && (t.artist['#text'] || t.artist.name)) || '';
        var now = t['@attr'] && t['@attr'].nowplaying === 'true';
        push('OUT', (now ? '♪ now playing: ' : '♪ last played: ') + esc(artist) + ' — ' + esc(t.name || ''), 'b');
      })
      .catch(function () { push('OUT', 'could not reach last.fm.', 'g'); });
  }

  function run(raw) {
    var cmd = raw.trim();
    push('CMD', '$ ' + esc(cmd), 'c');
    if (!cmd) return;
    var key = cmd.toLowerCase().split(/\s+/)[0];
    if (key === 'nowplaying' || key === 'np') { nowplaying(); return; }
    if (COMMANDS[key]) {
      var out = COMMANDS[key]();
      if (out) out.forEach(function (line) { push('OUT', esc(line), 'g'); });
    } else {
      push('OUT', 'zsh: command not found: ' + esc(key) + " — try 'help'", 'w');
    }
  }

  panel.addEventListener('click', function () { input.focus(); });
  input.addEventListener('focus', enterTerm);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { run(input.value); input.value = ''; }
    else if (e.key === 'Escape') { exitTerm(); }
  });
})();
