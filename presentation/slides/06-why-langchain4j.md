# Slide 6 — Why LangChain4j, not the managed button

## On screen
Three cards: *You own the retrieval* · *No vendor lock-in* · *It's just Java.* Plus an aside addressing "What about Spring AI?"

## Background
The honest competitor here is **managed/built-in RAG** (e.g. Azure AI Search's "add your data," or a cloud vendor's one-click RAG). They're genuinely good for a first pass. The argument for owning the pipeline:

- **You own retrieval.** Chunking strategy, which embedding model, how many results, how context is injected into the prompt, query rewriting, reranking — these are exactly the levers you reach for when answers are wrong. Managed RAG hides them. You will need them (slide 13 is a live example).
- **No vendor lock-in.** LangChain4j abstracts the provider: OpenAI, Azure OpenAI, Google, Anthropic, Ollama, etc. Swapping is a config + dependency change, not a rewrite. This matters for cost control and for "we must run on-prem" mandates.
- **It's just Java.** Same build, same tests, same CI, same people. And LangChain4j is framework-agnostic — it runs inside Spring Boot too, so choosing it doesn't lock you into Quarkus.

**Spring AI** comes up every time, so pre-empt it:
- Spring AI is a *separate* project, not built on LangChain4j, and it's Spring-specific.
- LangChain4j is framework-agnostic. If you're a Spring shop and happy there, Spring AI is reasonable. If you want framework flexibility, or you're moving toward Quarkus, LangChain4j fits better — and it still works inside Spring.
- Don't trash Spring AI on stage; the credible position is "different tool, pick by where you want the flexibility."

## What to say
"Why not just click the cloud vendor's 'add your data' button? For a prototype, do — it's fine. But the moment your answers are wrong, you'll want to change how retrieval works: chunk size, how many results, how context gets injected. Managed RAG hides exactly those knobs. Owning the pipeline means you can fix it.
Second, lock-in. LangChain4j treats the provider as config — OpenAI today, on-prem Ollama tomorrow, same code. That's your answer to both the finance team and the security team.
And it's just Java. Same stack, same tests. It's framework-agnostic, so it even runs inside Spring — which brings us to the question someone's about to ask…"

## If asked
- *"Spring AI vs LangChain4j?"* — See above. Separate projects; Spring AI is Spring-specific, LangChain4j is framework-agnostic and runs in Spring too. Not a religious choice.
- *"Is LangChain4j tied to Quarkus?"* — No. We use the Quarkus extension for ergonomics, but the core library is plain Java.
- *"What about cost vs a managed service?"* — Owning it lets you pick cheaper or local models and tune token usage; managed services bundle convenience at a premium and limit those choices.

## Time
~2 minutes. Handle Spring AI proactively so it doesn't derail Q&A later.
