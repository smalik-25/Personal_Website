# DEVLOG · sam-malik.com

Running log of what changed on the site and why. Newest first.

## 2026-07-08 · Projects page: live demos embedded, ModelSense viewer wired (Phase 3)

Put the two live demos on the page and made project 00 lead with the ModelSense viewer shot.

- **ModelSense viewer, lead exhibit.** The screenshot I took (Cesium Milk Truck, the agent finding both wheel nodes and highlighting the front pair) now opens the ModelSense exhibit column, above the architecture figure. It shows the same "wheel" request the Langfuse trace below it breaks down, so the product shot and the trace read as one story. One thing I have to fix at the source: the agent's reply baked into that screenshot uses em dashes, which the page rules forbid. Retouching the image would be dishonest, so I left a visible TODO to regenerate the shot from a reply that uses commas or parentheses (or to strip em dashes in the app's response rendering first).
- **Alexa classifier, embedded.** The HF Space serves its own HTML form at `GET /` (textarea, predict, result), so the embed is a plain iframe of the Space. No CORS work and no change to the classifier repo. It sits full width below the case study.
- **Sneaker Resale dashboard, embedded.** Plain iframe of the Streamlit app with `?embed=true`, full width below its case study.
- **Lazy, not eager.** Neither iframe is in the initial HTML. An IntersectionObserver in main.js injects the iframe only when the band scrolls within 400px of the viewport, so the two heavy embeds cost nothing on load and never touch interactive time before you reach them. main.js is shared across every page and does nothing where there are no demo bands.
- **Cold-start handling.** Each band shows a spinner and honest copy while it wakes: the HF free tier can take 30 to 60 seconds from sleep, and Streamlit Community Cloud sleeps after about 12 hours and may show its own wake button, which you can click inside the frame or open in a new tab. Every band carries an "open in a new tab" link that works before, during, and after load.

Reviewed the whole change adversarially before calling it done and fixed four things it surfaced:

- The 12-second "safety" timer used to reveal the iframe even when it had not loaded, so a slow cold start could flash a blank white box over the dark page and hide the escape link. The iframe now reveals only on a real load event; the timer, pushed past the 60-second ceiling, degrades the skeleton in place instead and keeps the new-tab link.
- The hidden skeleton was only faded out, so its link stayed in the keyboard tab order and the screen-reader tree after the demo loaded. It now goes `visibility:hidden` once the iframe is ready.
- With JavaScript off, the spinner spun forever under copy that promised a load that would never come. The spinner and "waking" line are now gated behind a JS class, and a static "loads with JavaScript, open in a new tab" line shows in their place.
- Renamed the viewer caption from "one tool-driven turn" to "one tool-driven request" so it stops colliding with the "4 turns" number printed inside the same screenshot.

Verified locally: HTML tag balance holds, main.js passes `node --check`, and all four target URLs return 200 with no redirect. The ModelSense production URL (`model-sense-web.vercel.app`) now loads publicly and serves the real app rather than a Vercel login, so the deployment-protection blocker looks cleared. Cold-start timing and mobile layout still need a real post-deploy check, since neither can be trusted from a local file open.

Next:
- Confirm both embeds cold and warm on the deployed site, and the ModelSense URL in an incognito window.
- Regenerate modelsense-viewer.png without em dashes (see the TODO in projects.html).
- Still open from Phase 2: the fitness dbt DAG screenshot.
- Optional stretch: an HF keep-alive and a Streamlit wake job, both in their own repos, not this one.
- Separate from this work: the section eyebrows, date ranges, and two older image alt lines still use em dashes. They pre-date this change and belong to the existing eyebrow style, so I left them, but they are worth a call since the copy rule is no em dashes anywhere.

## 2026-07-08 · Projects page: 13-scroll to 6 featured + archive (Phase 1, part of Phase 2)

Reworked `projects.html` from a flat 13-project scroll into six featured case studies with an archive underneath. The old page treated every project as equal, which buried the work I'd actually defend in an interview under coursework I did in a weekend. The new page is built to read two ways at once: a stat band and a one-paragraph hook for a 30-second skim, a full case study with an architecture figure and honest results for anyone who wants the 10-minute version.

Featured order and why: 00 ModelSense (the agentic MCP work, rarest and most current), 01 Sneaker Price MLOps Pipeline, 02 ReliQuery, 03 Data-Driven Fitness, 04 Voice Assistant Sentiment Classifier, 05 Sneaker Resale Intelligence. 01 and 05 are Phase 2 and Phase 1 of the same system, so they now cross-link both ways with in-page anchors.

What I added or changed:

- **ModelSense (new).** Wrote the case study from the repo. Nine MCP tools (eight read-only, one gated export behind a human approval), a fifty-task Python eval harness whose golden answers are computed from the GLBs rather than hand-typed, and a Langfuse trace per turn. Stat band: 9 MCP tools, 50 golden evals at 100%, 4.48/5 context fidelity. Built the architecture figure and an eval table that shows the honest bit: the harness caught the measurement category sitting at 62%, and one system-prompt change forcing the `measure` tool took the suite from 94% to 100%. The case study names the Claude Agent SDK and the eval models it runs on (claude-sonnet-5 for the agent, claude-haiku-4-5 as the context-fidelity judge). Live demo wired to the public deploy at `model-sense-web.vercel.app`.
- **ReliQuery (new).** Case study leads with the real hard problem, entity resolution across marketplaces with no shared key, not the scraping. Typed anti-corruption adapters, a staged rapidfuzz resolver, Neon Postgres, dbt marts, a thin Next.js read layer. Stat band from the live site: 4,280 sold comps, 531 resolved pieces, about 86% of rows resolved. Kept the price-model result honest, it lands within roughly 1% of the brand-and-archetype median, so it's reported as evaluated, not as a win. Repo is named TrueComp; noted that on the card.
- **Stat bands for 03 and 05.** Fitness now leads with 328 MB of Apple Health XML, the DEXA delta, and the point of the whole project, at most 4.3 lb of the 8.4 lb "lean gain" is muscle. Sneaker Resale now shows 99,956 real StockX sales, a 21.3x peak premium over retail, and 9 dbt models.
- **Existing four restructured, not rewritten.** MLOps, Alexa, Fitness, and Sneaker Resale kept their copy and figures. Reindexed to the new order, added the two stat bands above, added the cross-links.
- **Archive.** The other nine projects collapsed into compact one-per-row entries (title, one-liner, tags, links) under a single `§ ARCHIVE` divider. New `.arch-*` block in `styles.css`, scoped so it touches nothing else.
- **Intro + tag row.** Rewrote the lead so it stops undual-selling the set as "almost all Python and SQL," and added TypeScript, MCP, Next.js, and three.js to the identity tags.
- **Contact line.** Updated the roles line from "data analyst and data engineering roles" to "data and analytics engineering, ML, and agentic-AI roles" across all four pages that carry the footer (index, experience, projects, writing) so it reads consistently.

Architecture figures for ModelSense and ReliQuery are the native styled-HTML stack blocks, same as the existing ones. Three real screenshots are now wired: the Langfuse trace of one ModelSense turn (three tool spans, 28.2s, $0.15, 4 turns) and two ReliQuery product shots (the Rick Owens Ramones priced at $375 off 51 comps, and the 17% Grailed-vs-eBay cross-marketplace spread that shows the resolution paying off). The still-open slots (a static ModelSense viewer shot, the fitness dbt DAG, an optional sneaker-intel dbt DAG) carry visible TODO comments, not broken image tags.

Verified by opening the page locally: six featured render in order, both new figures and all four stat bands render, archive rows are compact and single-column on mobile, no broken images, existing links intact.

Next:
- Phase 2 assets: Langfuse trace screenshot, a short ModelSense viewer GIF, the fitness dbt DAG, a ReliQuery product screenshot.
- Remaining Phase 2 assets: a static ModelSense viewer screenshot, the fitness dbt lineage DAG, and an optional sneaker-intel dbt DAG.
- Phase 3 interactivity: the Alexa demo is a plain iframe (the Space serves its own HTML UI, no CORS work), the Streamlit dashboard embeds with `?embed=true`, both lazy-loaded with cold-start handling.
- Confirm the ModelSense live demo works cold in an incognito window (the page loads publicly; the agent backend cold-start is the thing to eyeball).
- Staying on the full scroll for now; will reconsider expandable case studies later.
