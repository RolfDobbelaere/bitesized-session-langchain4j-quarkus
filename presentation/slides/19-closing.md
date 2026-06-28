# Slide 17 — Closing + Q&A

## On screen
Big line: **"If you can write a REST endpoint, you can build an AI feature."** Subtitle: *You've been overthinking it…* Four takeaway chips: **Ground it with RAG · Stay in Java · Keep your APM · Ship the JAR.** Resource links: github.com/langchain4j · quarkus.io/guides · docs.quarkiverse.io/quarkus-langchain4j.

## Background
The closing line is the thesis compressed to a sentence — deliver it cleanly and then **stop talking** and let it land. Don't add a second closing line; the silence does the work.

The four chips are the entire talk reduced to four words each. If an audience member remembers nothing else, these are the four:
- **Ground it with RAG** — don't let the model guess; give it the answer key.
- **Stay in Java** — it's an integration problem, on your stack.
- **Keep your APM** — JVM mode + Elastic agent; no new observability.
- **Ship the JAR** — JVM mode is the boring, correct default; native is optional.

Leave the resource links on screen through Q&A so people can photograph them.

## Anticipated Q&A (prep)
- **Data security / "does our data leave?"** — With a hosted model, prompts (including retrieved chunks) go to the provider. If unacceptable, on-prem Ollama → nothing leaves the network. This is usually the first question; answer it confidently.
- **Cost** — Variable cost is tokens, scales with usage; infra is flat. On-prem inference converts it to fixed hardware cost.
- **"Why not Python?"** — Your data and your operations are already on the JVM; a second runtime is operational overhead, not capability. LangChain4j covers the RAG path on your stack.
- **"Is JVM mode really production-grade?"** — Yes; faster start and lighter than Spring Boot, fully debuggable. Native is an optimisation for serverless/scale-to-zero, not a requirement.
- **Spring AI?** — Separate, Spring-specific project; LangChain4j is framework-agnostic and runs in Spring too. Pick by where you want flexibility.
- **Accuracy / "what if RAG is still wrong?"** — Debugging ladder from slide 13: log retrieved chunks; fix the query, then chunking/`maxResults`, then add a reranker. Most issues are retrieval, not the model.
- **Hallucination even with RAG?** — Reduced, not eliminated; constrain with a strict system prompt ("answer only from the provided context; if it's not there, say you don't know") and show sources.

## What to say
"So here's where I'll leave it. If you can write a REST endpoint, you can build an AI feature. You've been overthinking it — the hard part was never the model, it was wiring it to your data safely, and that's the part Java has always been good at.
Four things to take home: ground it with RAG, stay in Java, keep your APM, ship the JAR.
Thank you — and I'd love your questions."

## Time
~1 minute for the close, then Q&A to fill the remainder. Leave links on screen.
