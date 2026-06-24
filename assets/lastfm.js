/* SAM·MALIK — live Last.fm recent-tracks feed.
   Set window.LASTFM_USER and window.LASTFM_API_KEY (inline in index.html).
   Get a free key at https://www.last.fm/api/account/create
   The key is read-only public data; it's fine to ship in client JS. */
(function () {
  var body = document.getElementById('lastfm-body');
  if (!body) return;

  var USER = (window.LASTFM_USER || 'tequila_sunset');
  var KEY = (window.LASTFM_API_KEY || '').trim();

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function ago(uts) {
    if (!uts) return '';
    var s = Math.floor(Date.now() / 1000) - uts;
    if (s < 90) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    var d = Math.floor(s / 86400);
    if (d < 7) return d + 'd ago';
    var dt = new Date(uts * 1000);
    return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  if (!KEY) {
    body.innerHTML = '<p class="loading" style="padding:8px 0">Add a free Last.fm API key to go live (see README).</p>';
    return;
  }

  function load() {
    var url = 'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks'
      + '&user=' + encodeURIComponent(USER)
      + '&api_key=' + encodeURIComponent(KEY)
      + '&format=json&limit=6';
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.recenttracks || !d.recenttracks.track) {
          body.innerHTML = '<p class="loading" style="padding:8px 0">Couldn\'t read Last.fm (check the key).</p>';
          return;
        }
        var tracks = d.recenttracks.track;
        if (!tracks.length) { body.innerHTML = '<p class="loading" style="padding:8px 0">No recent scrobbles.</p>'; return; }
        var html = '<ul class="lf-list">';
        tracks.forEach(function (t) {
          var now = t['@attr'] && t['@attr'].nowplaying === 'true';
          var artist = (t.artist && (t.artist['#text'] || t.artist.name)) || '';
          var name = t.name || '';
          var right = now
            ? '<span class="lf-now-tag">▶ NOW PLAYING</span>'
            : '<span class="lf-when">' + esc(t.date ? ago(+t.date.uts) : '') + '</span>';
          html += '<li class="lf-row' + (now ? ' lf-row--now' : '') + '">'
            + '<span class="lf-track"><b>' + esc(artist) + '</b> &middot; ' + esc(name) + '</span>'
            + right + '</li>';
        });
        html += '</ul>';
        body.innerHTML = html;
      })
      .catch(function () {
        body.innerHTML = '<p class="loading" style="padding:8px 0">Couldn\'t reach Last.fm right now.</p>';
      });
  }

  load();
  setInterval(load, 60000); // refresh every minute
})();
