# Slide 1 — Title

## On screen
**RAG, Four Ways** — Grounded AI in Java with Quarkus + LangChain4j.
Tagline: *Teaching a language model to stop making things up — without rebuilding your infrastructure.*
Presenter line: Rolf Dobbelaere · ~30 minutes · one live demo · zero containers.

## Background
The three nouns in the subtitle are the entire thesis, and they're chosen to defuse the three objections an enterprise Java audience walks in with:
- **"Grounded"** — answers come from *your* data, not the model's imagination. This is the RAG promise.
- **"in Java"** — no polyglot detour, no Python service to operate alongside the JVM stack.
- **"without rebuilding your infrastructure"** — the unspoken fear is that "AI" means Kubernetes, GPUs, a vector-database vendor, and a new observability stack. The whole talk argues it doesn't.

"Four Ways" is a deliberate hook: most intros treat RAG as one technique. Framing it as a spectrum (from hand-wired to config-only to tuned) is what makes this talk different and gives the live demo its spine.

## What to say
"Over the next half hour I want to convince you of one thing: making a language model answer from your own data is an integration problem, and integration is something Java has always been good at. Thirty minutes, one live demo, and — for anyone here from DevOps — zero containers. You can relax."

## If asked
- *"Is this production-ready or a toy?"* — The patterns are production-ready in JVM mode today; the demo uses an in-memory store for simplicity, and slide 16 shows the production swap-ins.
- *"Do I need to know ML?"* — No. If you can write a REST endpoint and read a builder pattern, you're qualified.

## Time
~1 minute. Don't linger — the opener on slide 2 is where you earn attention.
