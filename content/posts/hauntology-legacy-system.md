Every team has one. The pipeline nobody fully understands, that everybody routes around, that runs at 2:40am for reasons lost to staff turnover. We call it "legacy" — but legacy is the wrong word. Legacy implies inheritance, something handed down on purpose. This is something else. This is a *haunting*.

> Hauntology: the persistence of a present that refuses to become past.

Mark Fisher borrowed the word from Derrida to describe culture haunted by futures that never arrived. It turns out to describe legacy infrastructure almost perfectly.

## What actually haunts

When people say "technical debt," they picture an invoice — something rational, quantifiable, payable. But the legacy system isn't debt. It's a *revenant*: a set of decisions that outlived the people and the context that made them sensible, still executing, still shaping what's downstream, no longer answerable to anyone.

The fear it produces is specific. It's not the fear of complexity — engineers love complexity. It's the eerie: the sense that something is *agentic* in there, that the system has intentions nobody authored.

## Making the ghost legible

The way out isn't a rewrite. It's an exorcism by documentation:

- **Trace the dependency graph mechanically.** Parse the SQL, the job configs, the cron. Let the machine draw the haunted house.
- **Annotate with archaeology, not blame.** "This filter exists because of a 2019 billing migration" dissolves more fear than any refactor.
- **Name the eeriness out loud.** A README that admits "we are not sure why this step is here, but removing it broke prod in 2021" is more honest — and more *useful* — than false confidence.

You don't make a legacy system safe by pretending it isn't haunted. You make it safe by turning around and looking directly at the ghost, writing down what you see, and letting the next person inherit understanding instead of dread.
