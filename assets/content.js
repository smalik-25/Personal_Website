/* SAM·MALIK — content loaders for markdown-driven blog + reading.
   Requires marked.js (loaded via CDN in the page).
   Works when served over http(s) — e.g. GitHub Pages or a local server.
   NOTE: opening pages via file:// will block fetch(); use a local server. */
(function () {
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function md(text) {
    if (window.marked) {
      try { return window.marked.parse(text); } catch (e) { /* fall through */ }
    }
    return '<p>' + esc(text).replace(/\n\n+/g, '</p><p>') + '</p>';
  }

  function fail(el, msg) {
    el.innerHTML = '<p class="loading">' + esc(msg) + '</p>';
  }

  /* ---------------- BLOG ---------------- */
  var postList = document.getElementById('post-list');
  var postReader = document.getElementById('post-reader');

  function renderPostList(posts) {
    var html = '<ul class="post-list">';
    posts.forEach(function (p) {
      html += '<li><a class="post-link" href="writing.html?post=' + encodeURIComponent(p.slug) + '">' +
        '<span class="p-date mono">' + esc(p.date) + '</span>' +
        '<span><span class="p-title">' + esc(p.title) + '</span>' +
        (p.summary ? '<div class="dim" style="margin-top:6px">' + esc(p.summary) + '</div>' : '') +
        '</span>' +
        '<span class="p-arrow">→</span></a></li>';
    });
    html += '</ul>';
    postList.innerHTML = html;
  }

  function renderPost(post) {
    fetch('content/posts/' + post.file).then(function (r) {
      if (!r.ok) throw new Error('not found');
      return r.text();
    }).then(function (text) {
      postReader.innerHTML =
        '<a href="index.html#writing" class="sm-label" style="display:inline-block;margin-bottom:24px">← ALL WRITING</a>' +
        '<p class="eyebrow"><span class="idx">' + esc(post.index || '¶') + '</span> &nbsp;' + esc(post.date) + '</p>' +
        '<h1 style="margin:8px 0 32px">' + esc(post.title) + '</h1>' +
        '<div class="md">' + md(text) + '</div>';
      document.title = post.title + ' · SAM·MALIK';
    }).catch(function () { fail(postReader, 'Could not load this post.'); });
  }

  if (postList || postReader) {
    fetch('content/posts/manifest.json').then(function (r) { return r.json(); })
      .then(function (posts) {
        posts.sort(function (a, b) { return (a.date < b.date) ? 1 : -1; });
        var slug = new URLSearchParams(location.search).get('post');
        if (slug && postReader) {
          var match = posts.filter(function (p) { return p.slug === slug; })[0];
          if (postList) postList.style.display = 'none';
          if (match) { renderPost(match); } else { fail(postReader, 'Post not found.'); }
        } else {
          if (postReader) postReader.style.display = 'none';
          if (postList) renderPostList(posts);
        }
      })
      .catch(function () {
        if (postReader && postReader.style.display !== 'none') fail(postReader, 'Could not load writing index. Serve the site over http (see README).');
        if (postList) fail(postList, 'Could not load writing index. Serve the site over http (see README).');
      });
  }

  /* ---------------- READING ---------------- */
  var shelf = document.getElementById('shelf');
  if (shelf) {
    var STATUS = {
      last: { label: 'PAST', cls: 'last' },
      current: { label: 'PRESENT', cls: 'now' },
      next: { label: 'FUTURE', cls: 'next' }
    };
    fetch('content/reading/manifest.json').then(function (r) { return r.json(); })
      .then(function (books) {
        var order = { last: 0, current: 1, next: 2 };
        books.sort(function (a, b) { return order[a.status] - order[b.status]; });
        Promise.all(books.map(function (b) {
          return fetch('content/reading/' + b.file).then(function (r) { return r.ok ? r.text() : ''; }).catch(function () { return ''; });
        })).then(function (texts) {
          var html = '';
          books.forEach(function (b, i) {
            var s = STATUS[b.status] || STATUS.current;
            if (i > 0) html += '<div class="shelf-arrow" aria-hidden="true">→</div>';
            html +=
              '<article class="book">' +
              '<div class="book__status ' + s.cls + '">' + s.label + '</div>' +
              '<h3 class="book__title">' + esc(b.title) + '</h3>' +
              '<div class="book__author">' + esc(b.author) + (b.year ? ' &middot; ' + esc(b.year) : '') + '</div>' +
              '<div class="md" style="font-size:.95rem; margin-top:10px">' + md(texts[i] || '_No notes yet._') + '</div>' +
              '</article>';
          });
          shelf.classList.add('shelf--flow');
          shelf.innerHTML = html;
        });
      })
      .catch(function () { fail(shelf, 'Could not load reading list. Serve the site over http (see README).'); });
  }
})();
