# SAM·MALIK — Personal Site

A multi-page static portfolio built on the *Sam Malik Design System* (terminal-meets-gothic:
void + bone, phosphor + oxblood). Plain HTML/CSS/JS — no build step, hosts anywhere static.

## Pages
- `index.html` — Home: name, credentials, bio, index of the site
- `ethos.html` — Ethos: the data/technology/art/culture diagram + writeup
- `experience.html` — Experience: roles, tools, impact
- `projects.html` — Projects: why / tools / what I did / what I learned + visual refs
- `writing.html` — Blog (loads markdown posts)
- `reading.html` — What I'm reading: last / current / next (loads markdown)
- Connect lives in the footer of every page (`#connect`)

## Important: run it over a local server
The blog and reading pages **fetch markdown files**, which browsers block on `file://`.
Opening the HTML by double-clicking will show empty Writing/Reading pages. Use any static server:

```bash
cd site
python3 -m http.server 8000
# then open http://localhost:8000
```

The other pages (home, ethos, experience, projects) work fine opened directly.

## Publishing a new blog post
1. Add a markdown file to `content/posts/`, e.g. `content/posts/my-post.md`.
2. Add an entry to `content/posts/manifest.json`:
   ```json
   {
     "slug": "my-post",
     "title": "My Post Title",
     "date": "2026-06-14",
     "index": "¶ 04",
     "file": "my-post.md",
     "summary": "One-line teaser."
   }
   ```
   Posts sort newest-first by `date` automatically.

## Updating the reading shelf
Edit `content/reading/manifest.json` (exactly three entries: one each of `last`,
`current`, `next`) and edit the matching `.md` writeups in `content/reading/`.

## Adding real project screenshots
The gray panels are `.visref` placeholders. To use a real image, replace a
`<div class="visref" ...></div>` with `<img src="assets/img/your-shot.png" alt="…">`
(create the `assets/img/` folder).

## Customizing
- All brand colors, fonts, and tokens live at the top of `assets/styles.css` (`:root`).
- Update the placeholder bio, roles, projects, and the LinkedIn/GitHub URLs
  (search for `linkedin.com/in/` and `github.com/` across the `.html` files).

## Last.fm live feed (Listening section)

The "LAST.FM · LIVE FEED" card pulls recent scrobbles live from the Last.fm API.
To turn it on:

1. Get a free API key at https://www.last.fm/api/account/create (any app name; callback can be blank).
2. Open `index.html`, find this line near the bottom, and paste the key:
   ```html
   <script>window.LASTFM_USER = "tequila_sunset"; window.LASTFM_API_KEY = "";</script>
   ```
3. That's it. The widget fetches `user.getRecentTracks` on load and refreshes every 60s,
   showing a "NOW PLAYING" row when you're listening.

The key is read-only public data, so it's safe to ship in the page. Until a key is added,
the card shows a short "add a key" note instead of breaking.

## Deploy to GitHub Pages
1. Push the contents of `site/` to a repo (or put them at the repo root).
2. Settings → Pages → deploy from branch → root.
3. Markdown fetch works on Pages because it's served over https.

> Built in the ruins of the present. © Sam Malik.
