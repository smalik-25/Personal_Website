Engineers reach for "exactly-once" like it's a switch you flip on a single component. It isn't. Exactly-once is a property of the whole loop: the producer, the transport, the consumer, and the store they all agree to write to. Any one of them can quietly break the guarantee while the dashboard still shows green.

## The three honest failures

There are really only three things that go wrong, and they all hide well.

The first is double-counting, where the same event lands twice and your metrics quietly inflate. Nobody notices until a number looks too good to be true. The second is silent drops, where an event vanishes between hops and the metrics deflate instead. That one's worse, because you can't miss what you never saw. The third is reordering, where events arrive out of sequence and your "latest" state turns out to be stale.

None of these throw an exception. That's what makes them dangerous.

## Idempotency is the real mechanism

What actually buys you exactly-once isn't a magic flag. It's idempotent writes keyed on something stable, plus replayable offsets so you can re-run any window and land in the same place.

```python
# the whole trick, more or less
merge_key = (source_id, event_id)   # stable, unique, never reused
upsert(target, rows, on=merge_key)  # running twice == running once
```

If running your pipeline twice produces the same table as running it once, you have exactly-once, no matter what the streaming layer claims. If it doesn't, no amount of broker configuration is going to save you.

## Correctness is a circuit

This is the engineering version of something the cyberneticists worked out a long time ago: a system's behavior comes from its feedback loop, not its parts. You don't get a correct pipeline by buying correct components. You get it by closing the loop, making every stage replayable, every write idempotent, every offset durable, so the circuit lands in the same state no matter where it gets interrupted.

Boring. Load-bearing. The good kind of boring.
