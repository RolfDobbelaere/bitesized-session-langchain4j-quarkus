# Slide 10 — RAG four ways (the demo spine)

## On screen
Four rows, one per endpoint: **01 `/ask/no-rag`** (no retrieval), **02 `/ask/naive-rag`** (RAG by hand), **03 `/ask/easy-rag`** (RAG by config), **04 `/ask/transformed-rag`** (RAG, tuned). Same question, same corpus of newsletters.

## Background
This slide is the map for the entire demo. Put it up, then return to it between demo steps so nobody loses the thread. The progression is deliberate and tells a story:
- **01 — the problem.** Raw model, no retrieval. Hallucinates. This is slide 3 live.
- **02 — the mechanism.** RAG wired by hand so the audience sees there's no magic (retriever + injector).
- **03 — the ergonomics.** The same result with the wiring deleted — config-only. Shows how far the tooling has come.
- **04 — the tuning.** Naive RAG can still miss on a vague question; query transformation recovers it. Shows RAG is a spectrum, not a switch.

Why one corpus of **company newsletters**: a generic model has zero chance of knowing their contents, so 01's failure is unambiguous and 02–04's successes are obviously grounded. The same question across all four is what makes the comparison legible.

All four are real endpoints in `langchain4j-quarkus-example-1` (`RagDemoResource`), each backed by its own AiService/augmentor, so you can curl them live.

## What to say
"Here's the plan for the demo. Four endpoints, same question, same set of company newsletters. Watch what each layer buys us.
One: no RAG — the problem. Two: RAG by hand — so you see the mechanism, no magic. Three: RAG by config — the same answer with the code deleted. Four: RAG, tuned — because naive retrieval isn't always enough.
I'll keep coming back to this slide so you always know where we are."

## If asked
- *"Are these four different apps?"* — One app, four endpoints, each with its own retrieval configuration. That's a feature of the AiService model.
- *"Which is 'the right' one for production?"* — Usually you start at easy-rag (03), and drop to explicit augmentors (02/04) only where you need to tune. There's no single winner — that's the point.

## Time
~1 minute. It's a signpost; don't over-explain — the demo does the explaining.
