In 1971, Chilean President Salvador Allende launched a system called Project Cybersyn. The idea was to pull real-time economic data from the country's nationalized industries into one place, so the government could actually make decisions based on what was happening rather than what it assumed was happening. Fifty years later it reads as one of the clearest case studies of the thing I do for a living: a data pipeline with real consequences attached.

## A real-time data platform, fifty years early

Strip away the period detail and Cybersyn's architecture is oddly familiar to anyone who works in data today.

Start with ingestion. Roughly 500 telex machines wired factories across the country into a central hub, sending production figures continuously instead of in quarterly batches. Then the processing layer: a piece of software called Cyberstride took those streams, computed statistical indicators, and ran a Bayesian model that flagged anomalies. When a factory's numbers drifted outside expected bounds, the system raised an alert before the problem had a chance to grow. And then the interface, the now-iconic operations room, where a small group read aggregated indicators off the screens and acted on them in close to real time.

So: ingestion, a streaming anomaly-detection model, an alerting layer, and an executive dashboard. An end-to-end pipeline, built on 1970s mainframes and a borrowed telex network. It worked well enough to show that information systems can change how economic decisions get made, and that a planned economy doesn't have to be slow, blind, or unable to react before a shortage turns into a crisis.

## Where the loop broke

The failure lived in the same place as the promise. By treating workers as data points, Cybersyn lost sight of what was actually happening on the factory floor. It pushed people toward targets defined purely by statistical output, and people did what they always do when a metric becomes a target: they reported numbers that hit the goal, whether or not the goal was reachable.

This isn't a quaint historical bug. It's Goodhart's Law running in production. When a measure becomes a target, it stops being a good measure, and it's the failure mode I think about most in my own work. A pipeline is only as honest as its inputs. The moment a number starts driving consequences, the people upstream start optimizing the number instead of the reality it was supposed to stand in for. Cybersyn had a genuinely sophisticated anomaly detector pointed at data that was quietly being gamed. Add the politics of the Cold War, and the project collapsed.

## What I take from it

Cybersyn keeps asking the same questions, and they've only gotten louder. How do you design technology that gives people more agency instead of replacing it? How does an information system account for the human stuff (incentives, workplace dynamics, who trusts whom) without giving up on the gains that made it worth building? With AI agents and machine learning now in the mix, those stopped being abstract.

This is the part of the job I actually care about. The systems I build (ETL pipelines, data-quality checks, agentic RAG workflows) are small Cybersyns. Each one decides what gets measured, what becomes legible, and what happens as a result. That's why I treat data-quality validation and lineage as the real work rather than housekeeping. They're the parts of the system that stop and ask whether a number is true, and where it came from, before anyone acts on it.

It's also why I don't trust any pipeline, human or AI, that takes its inputs as ground truth. The better design keeps a person in the loop, not as a rubber stamp but as the thing that can notice when the data has drifted away from reality. Allende's engineers got the architecture remarkably right. What they underestimated is that in any information system, the most important variable is the people it's measuring.
