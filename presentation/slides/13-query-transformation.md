# Slide 13 — When retrieval misses, fix the question

## On screen
Left: a vague question ("the time-off thing they mentioned") → weak retrieval → bad answer; then a transformer rewrites it ("the company's paid time-off / holiday policy") → right chunks → recovered answer. Right: the one extra builder call (`.queryTransformer(new CompressingQueryTransformer(model))`) and a ladder of knobs to reach for in order.

## Background
This is the payoff for "RAG is a spectrum, not a switch." Naive RAG's most common failure mode is **not** the model — it's the **question**. A vague or context-dependent question embeds to a fuzzy vector, so the nearest chunks are off-target, the model gets bad context, and the answer is wrong. The cheapest fix is to rewrite the question *before* embedding it.

A **query transformer** sits at the front of the augmentor:
- **CompressingQueryTransformer** uses the chat model to fold conversation context into a single, self-contained question (good for follow-ups like "what about the time-off thing?").
- **ExpandingQueryTransformer** rewrites one question into several phrasings and retrieves for each, widening recall.

It's one extra builder call on the same `DefaultRetrievalAugmentor` from slide 11 — that's the whole change.

The **ladder on the right** is the real takeaway; it gives the audience a debugging procedure, not just a demo:
1. **Rewrite the query** (this slide) — cheap, no extra service, often enough.
2. **Tune chunk size / `maxResults`** — config only.
3. **Add a reranker** — a scoring model re-orders retrieved chunks by relevance; more accurate, but it's an extra (often paid) model call, so it's deliberately out of scope for this demo.

In the live demo: hit `/ask/naive-rag` with the deliberately vague question and let it whiff (honesty buys credibility), then hit `/ask/transformed-rag` with the *same* question and watch it recover.

## What to say
"When naive RAG gives a bad answer, the instinct is to blame the model. Usually it's the question. A vague question — 'what about that time-off thing?' — embeds to a fuzzy vector, so we retrieve the wrong chunks and the model faithfully answers from bad context.
The fix is one extra builder call: a query transformer that rewrites the question before we embed it. Same documents, same model — but now we ask 'what's the paid time-off policy?' and the right chunks come back.
And here's the order to reach for things when retrieval disappoints: rewrite the query first — it's free. Then tune chunk size and how many results. Only then reach for a reranker, which costs an extra model call. Most of the time you stop at step one."

## If asked
- *"Does the transformer cost an extra LLM call?"* — Yes, a small one (the rewrite). Usually worth it; you can cache or gate it.
- *"What's reranking exactly?"* — A scoring model takes the retrieved chunks and the query and re-orders by true relevance, filtering weak matches. LangChain4j supports it (e.g. Cohere scoring); skipped here to avoid a paid dependency.
- *"How do I know retrieval is the problem?"* — Log the retrieved chunks. If the right passage isn't in the top-k, it's a retrieval problem, not a model problem — fix the query or the chunking.

## Time
~2 minutes. Demo step 4. Let the naive endpoint fail first — the recovery is the lesson.
