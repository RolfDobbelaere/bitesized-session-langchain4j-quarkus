# Slide 8 — Architecture at a glance

## On screen
A flow: Browser/curl → Quarkus REST (JAX-RS) → LangChain4j AiService → LLM provider; and downward: AiService → Retrieval Augmentor → Embedding store ← Newsletter PDFs. A strip across the bottom: *Wrapped by the JVM, watched by your Elastic APM agent — every box is a traced span.*
Higher-fidelity standalone version: `../assets/architecture.svg`.

## Background
This is the "it fits in your head" slide. Trace one request:
1. `POST /ask/naive-rag` hits a **JAX-RS resource** (`RagDemoResource`).
2. The resource calls a **LangChain4j AiService** — a Java interface annotated `@RegisterAiService` whose implementation Quarkus generates at build time.
3. For the RAG endpoints, a **Retrieval Augmentor** intercepts the call: it embeds the question, queries the **Embedding store**, and injects the retrieved chunks into the prompt.
4. The augmented prompt goes to the **LLM provider** (OpenAI in the demo; swappable).
5. The answer returns up the same path.

Out-of-band: at startup, the **Newsletter PDFs** are parsed, chunked, embedded, and loaded into the store (the ingestion phase from slide 5).

Two boxes are deliberately swappable and become slide 16: the **embedding store** (in-memory → pgvector) and the **LLM provider** (OpenAI → Azure → on-prem Ollama).

The bottom strip is the punchline for the DevOps-minded: the entire flow runs inside **one JVM**, so the Elastic APM Java agent they already attach sees every hop — the REST call, the vector search, the outbound LLM call — as spans, with no new agent and no new backend.

## What to say
"Here's the whole thing on one slide. A request comes in to a JAX-RS endpoint, calls a LangChain4j AiService — which is just an annotated Java interface — and for the RAG endpoints an augmentor sits in the middle: it embeds the question, hits the embedding store, and injects what it finds before the call goes out to the model.
Two boxes are swappable — the store and the provider — and that's literally the production story we'll get to.
And here's the part DevOps cares about: it's all one JVM. Your existing Elastic APM agent already sees every one of these boxes as a span. No new infrastructure to watch this."

## If asked
- *"Where does the augmentor come from?"* — It's a CDI bean (`Supplier<RetrievalAugmentor>`) bound to the AiService via `@RegisterAiService(retrievalAugmentor = ...)`. The naive and transformed endpoints supply their own; easy-rag supplies a default automatically.
- *"Is the LLM call synchronous?"* — In the demo, yes (blocking REST). LangChain4j supports streaming/reactive too if you want token-by-token responses.

## Time
~1.5 minutes. Trace one request with your finger, then point at the bottom strip.
