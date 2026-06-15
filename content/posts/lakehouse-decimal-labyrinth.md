There's a particular feeling you get the first time you really navigate a mature lakehouse: every table is reachable, every transformation is logged, every path is *indexed* — and yet you have the distinct sense of being lost inside a structure that is technically fully mapped.

> The lakehouse as decimal labyrinth: every path is indexed, none of them are innocent.

That's not a failure of the architecture. It's the nature of the thing. A data platform is a labyrinth we build on purpose, then have to learn to read.

## The index is not the territory

We tell ourselves that lineage solves comprehension. It doesn't. Lineage tells you *that* `fct_orders` depends on `stg_orders`; it says nothing about *why* a decision three layers down quietly changed what "an order" means. The decimal index — `0.1`, `0.2.3`, `:04` — gives you an address, not an understanding.

What actually helps:

- **Name things for the question they answer**, not the table they came from.
- **Write down the decisions, not just the schema.** A column comment is cheap; the reasoning behind a `WHERE` clause is priceless and almost never recorded.
- **Treat the warehouse as a text to be read**, with a reader's suspicion. Who wrote this model? What were they afraid of? What did they leave out?

## Reading like a suspicious reader

This is where the theory-fiction habit pays off. The same attention you bring to a dense Fisher paragraph — *what is this sentence avoiding?* — is the attention a good pipeline review needs. The eerie, in Fisher's sense, is the feeling of a presence where there should be absence, or an absence where there should be presence. A NULL where there should be a value is a small eerie. A row that exists but shouldn't is another.

The labyrinth is navigable. You just have to stop pretending the map is the same as knowing the way.
